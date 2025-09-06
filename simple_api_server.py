#!/usr/bin/env python3
"""
Simple API Server for DeepResearchAgent Web Interface
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# FastAPI app
app = FastAPI(title="DeepResearchAgent API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Simple API server is running"
    }

@app.get("/api/dashboard")
async def get_dashboard_data():
    """Get dashboard statistics and data"""
    return {
        "stats": {
            "completedTasks": 0,
            "activeAgents": 0,
            "successRate": "0%",
            "totalResearchTime": "0h 0m"
        },
        "recentTasks": [],
        "agentStatus": [],
        "performanceMetrics": {
            "avgResponseTime": 0,
            "taskSuccessRate": 0,
            "dailyTasks": []
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "simple_api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
