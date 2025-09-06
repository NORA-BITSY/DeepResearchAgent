#!/usr/bin/env python
"""Test script for MCP configuration"""

import asyncio
import sys
from src.config import Config
from src.models import ModelManager
from src.agent import create_agent

async def test_mcp_config():
    """Test that MCP configuration loads and agents can be created"""
    
    print("Loading MCP configuration...")
    config = Config()
    config.init_config("configs/config_mcp.py", None)
    
    print("Configuration loaded successfully!")
    print(f"MCP Servers configured: {list(config.mcp_tools_config['mcpServers'].keys())}")
    
    print("\nInitializing model manager...")
    model_manager = ModelManager()
    model_manager.init_models(use_local_proxy=config.use_local_proxy)
    
    print("\nCreating agent with MCP support...")
    agent = await create_agent(config.planning_agent_config)
    
    if agent:
        print("✓ Agent created successfully with MCP configuration!")
        print(f"  Agent type: {agent.__class__.__name__}")
        print(f"  Available tools: {[t.__class__.__name__ for t in agent.tools] if hasattr(agent, 'tools') else 'N/A'}")
        return True
    else:
        print("✗ Failed to create agent")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_mcp_config())
    sys.exit(0 if success else 1)