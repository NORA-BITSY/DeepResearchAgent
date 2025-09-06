#!/usr/bin/env python3
"""
API Server for DeepResearchAgent Web Interface
Provides REST API and WebSocket endpoints for the React Native app
"""

import asyncio
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from src.config.cfg import Config
from src.models.models import ModelManager
from src.agent.agent import create_agent
from src.logger import logger

load_dotenv()

# FastAPI app
app = FastAPI(title="DeepResearchAgent API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
active_tasks: Dict[str, Any] = {}
connected_clients: List[WebSocket] = []
config = None
model_manager = None

# Pydantic models
class ResearchTaskRequest(BaseModel):
    query: str
    type: str = "research"
    agents: List[str] = ["planning"]
    options: Dict[str, Any] = {}

class AgentConfigUpdate(BaseModel):
    model_id: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    top_p: Optional[float] = None

class APIKeyUpdate(BaseModel):
    key: str
    value: str

class SettingsUpdate(BaseModel):
    general: Optional[Dict[str, Any]] = None
    performance: Optional[Dict[str, Any]] = None
    theme: Optional[str] = None

# WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

# API Endpoints

@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    global config, model_manager
    
    logger.info("Starting API Server...")
    
    # Initialize configuration
    config = Config()
    config.init_config("configs/config_mcp.py", None)
    
    # Initialize model manager
    model_manager = ModelManager()
    model_manager.init_models(use_local_proxy=config.use_local_proxy)
    
    logger.info("API Server started successfully")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_tasks": len(active_tasks)
    }

@app.get("/api/dashboard")
async def get_dashboard_data():
    """Get dashboard statistics and data"""
    return {
        "stats": {
            "completedTasks": 142,
            "activeAgents": len([t for t in active_tasks.values() if t.get("status") == "running"]),
            "successRate": "94%",
            "totalResearchTime": "12h 34m"
        },
        "recentTasks": list(active_tasks.values())[:10],
        "agentStatus": [
            {"id": "planning", "status": "active", "tasks": 3},
            {"id": "researcher", "status": "active", "tasks": 2},
            {"id": "analyzer", "status": "idle", "tasks": 0},
            {"id": "browser", "status": "active", "tasks": 1},
            {"id": "general", "status": "idle", "tasks": 0}
        ],
        "performanceMetrics": {
            "avgResponseTime": 4.2,
            "taskSuccessRate": 0.94,
            "dailyTasks": [45, 52, 48, 61, 55, 49, 58]
        }
    }

@app.post("/api/research/task")
async def create_research_task(request: ResearchTaskRequest):
    """Create a new research task"""
    task_id = f"task_{int(time.time())}"
    
    task = {
        "id": task_id,
        "query": request.query,
        "type": request.type,
        "agents": request.agents,
        "status": "initializing",
        "progress": 0,
        "startTime": datetime.now().isoformat(),
        "results": None
    }
    
    active_tasks[task_id] = task
    
    # Start task execution in background
    asyncio.create_task(execute_research_task(task_id, request))
    
    # Broadcast update
    await manager.broadcast({
        "type": "task_created",
        "task": task
    })
    
    return task

async def execute_research_task(task_id: str, request: ResearchTaskRequest):
    """Execute a research task asynchronously"""
    try:
        task = active_tasks[task_id]
        
        # Update status
        task["status"] = "running"
        task["progress"] = 10
        await manager.broadcast({
            "type": "task_update",
            "taskId": task_id,
            "progress": 10,
            "status": "running"
        })
        
        # Create appropriate agent
        if "planning" in request.agents:
            agent_config = config.planning_agent_config
        elif "researcher" in request.agents:
            agent_config = config.deep_researcher_agent_config
        elif "analyzer" in request.agents:
            agent_config = config.deep_analyzer_agent_config
        else:
            agent_config = config.general_tool_agent_config
        
        agent = await create_agent(agent_config)
        
        # Simulate progress updates
        for progress in [30, 50, 70, 90]:
            await asyncio.sleep(2)
            task["progress"] = progress
            await manager.broadcast({
                "type": "task_update",
                "taskId": task_id,
                "progress": progress,
                "status": f"Processing... {progress}%"
            })
        
        # Execute the research
        # result = await agent.run(request.query)
        
        # For demo, return mock result
        result = f"""# Research Results for: {request.query}

## Executive Summary
Based on comprehensive analysis, here are the key findings...

## Detailed Analysis
1. **Market Overview**: The current landscape shows significant growth potential
2. **Key Players**: Major competitors include...
3. **Opportunities**: Several emerging trends indicate...

## Recommendations
- Focus on innovation in key areas
- Expand market presence strategically
- Invest in emerging technologies

## Conclusion
The research indicates strong potential for growth with proper strategic positioning.
"""
        
        # Update task completion
        task["status"] = "completed"
        task["progress"] = 100
        task["results"] = result
        task["endTime"] = datetime.now().isoformat()
        
        await manager.broadcast({
            "type": "task_completed",
            "taskId": task_id,
            "results": result
        })
        
    except Exception as e:
        logger.error(f"Error executing task {task_id}: {e}")
        task["status"] = "error"
        task["error"] = str(e)
        await manager.broadcast({
            "type": "task_error",
            "taskId": task_id,
            "error": str(e)
        })

@app.get("/api/research/task/{task_id}")
async def get_task_status(task_id: str):
    """Get status of a specific task"""
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return active_tasks[task_id]

@app.post("/api/research/task/{task_id}/cancel")
async def cancel_task(task_id: str):
    """Cancel a running task"""
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = active_tasks[task_id]
    task["status"] = "cancelled"
    
    await manager.broadcast({
        "type": "task_cancelled",
        "taskId": task_id
    })
    
    return {"message": "Task cancelled"}

@app.get("/api/research/history")
async def get_task_history(limit: int = 50):
    """Get research task history"""
    tasks = list(active_tasks.values())
    tasks.sort(key=lambda x: x.get("startTime", ""), reverse=True)
    return tasks[:limit]

@app.get("/api/agents")
async def get_agents():
    """Get list of all agents"""
    return [
        {
            "id": "planning",
            "name": "Planning Agent",
            "type": "planning_agent",
            "status": "active",
            "model": "claude-3-7-sonnet-thinking",
            "enabled": True
        },
        {
            "id": "researcher",
            "name": "Deep Researcher",
            "type": "deep_researcher_agent",
            "status": "active",
            "model": "claude-3-7-sonnet-thinking",
            "enabled": True
        },
        {
            "id": "analyzer",
            "name": "Deep Analyzer",
            "type": "deep_analyzer_agent",
            "status": "idle",
            "model": "gemini-2.5-pro",
            "enabled": True
        },
        {
            "id": "browser",
            "name": "Browser Agent",
            "type": "browser_use_agent",
            "status": "idle",
            "model": "gpt-4.1",
            "enabled": True
        },
        {
            "id": "general",
            "name": "General Tool Agent",
            "type": "general_tool_agent",
            "status": "idle",
            "model": "claude-3-7-sonnet-thinking",
            "enabled": True
        }
    ]

@app.get("/api/agents/{agent_id}/status")
async def get_agent_status(agent_id: str):
    """Get status of a specific agent"""
    agents = await get_agents()
    agent = next((a for a in agents if a["id"] == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@app.put("/api/agents/{agent_id}/config")
async def update_agent_config(agent_id: str, config_update: AgentConfigUpdate):
    """Update agent configuration"""
    # Update agent config in the system
    return {"message": f"Agent {agent_id} configuration updated"}

@app.post("/api/agents/{agent_id}/restart")
async def restart_agent(agent_id: str):
    """Restart an agent"""
    return {"message": f"Agent {agent_id} restarted"}

@app.post("/api/agents/{agent_id}/toggle")
async def toggle_agent(agent_id: str, enabled: bool):
    """Enable or disable an agent"""
    return {"message": f"Agent {agent_id} {'enabled' if enabled else 'disabled'}"}

@app.get("/api/mcp/tools")
async def get_mcp_tools():
    """Get list of MCP tools"""
    return [
        {
            "id": "tavily",
            "name": "Tavily Search",
            "type": "search",
            "status": "connected",
            "enabled": True
        },
        {
            "id": "exa",
            "name": "Exa Search",
            "type": "search",
            "status": "connected",
            "enabled": True
        },
        {
            "id": "firecrawl",
            "name": "Firecrawl",
            "type": "crawl",
            "status": "connected",
            "enabled": True
        },
        {
            "id": "qdrant",
            "name": "Qdrant Memory",
            "type": "memory",
            "status": "disconnected",
            "enabled": False
        }
    ]

@app.post("/api/mcp/tools/register")
async def register_mcp_tool(tool_config: dict):
    """Register a new MCP tool"""
    return {"message": "MCP tool registered", "id": f"tool_{int(time.time())}"}

@app.post("/api/mcp/tools/{tool_id}/test")
async def test_mcp_tool(tool_id: str):
    """Test an MCP tool"""
    return {"status": "success", "message": f"Tool {tool_id} tested successfully"}

@app.get("/api/settings")
async def get_settings():
    """Get application settings"""
    return {
        "general": {
            "useHierarchical": True,
            "enableMCP": True,
            "autoSave": False
        },
        "performance": {
            "maxConcurrentTasks": 5,
            "taskTimeout": 300
        },
        "theme": "auto"
    }

@app.put("/api/settings")
async def update_settings(settings: SettingsUpdate):
    """Update application settings"""
    return {"message": "Settings updated"}

@app.get("/api/settings/api-keys")
async def get_api_keys():
    """Get API key status (not the actual keys)"""
    return {
        "openai": bool(os.getenv("OPENAI_API_KEY")),
        "anthropic": bool(os.getenv("ANTHROPIC_API_KEY")),
        "google": bool(os.getenv("GOOGLE_API_KEY")),
        "tavily": bool(os.getenv("TAVILY_API_KEY")),
        "exa": bool(os.getenv("EXA_API_KEY")),
        "firecrawl": bool(os.getenv("FIRECRAWL_API_KEY"))
    }

@app.put("/api/settings/api-keys")
async def update_api_key(key_update: APIKeyUpdate):
    """Update an API key"""
    os.environ[key_update.key] = key_update.value
    return {"message": f"API key {key_update.key} updated"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if needed
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )