# Configuration for DeepResearchAgent with MCP tools integration
from mmengine.config import read_base

# Import base configurations using mmengine syntax
with read_base():
    from .base import *

# General Config
tag = "mcp"
concurrency = 1
workdir = "workdir"
log_path = "log.txt"
save_path = "dra_mcp.jsonl"
use_local_proxy = False
use_hierarchical_agent = True

# Enhanced MCP tools configuration
mcp_tools_config = {
    "mcpServers": {
        # Tavily Search
        "tavily": {
            "command": "npx",
            "args": ["-y", "@tavily/mcp"],
            "env": {"TAVILY_API_KEY": "$TAVILY_API_KEY"}
        },
        # Exa Search
        "exa": {
            "command": "npx",
            "args": ["-y", "exa-mcp"],
            "env": {"EXA_API_KEY": "$EXA_API_KEY"}
        },
        # Firecrawl
        "firecrawl": {
            "command": "npx",
            "args": ["-y", "firecrawl-mcp-server"],
            "env": {"FIRECRAWL_API_KEY": "$FIRECRAWL_API_KEY"}
        },
        # Fetch
        "fetch": {
            "command": "python",
            "args": ["-m", "mcp_server_fetch"]
        },
        # Qdrant Memory
        "qdrant": {
            "command": "uvx",
            "args": ["mcp-server-qdrant"],
            "env": {
                "QDRANT_URL": "$QDRANT_URL",
                "QDRANT_API_KEY": "$QDRANT_API_KEY",
                "QDRANT_COLLECTION": "$QDRANT_COLLECTION"
            }
        },
        # Local MCP server (existing)
        "LocalMCP": {
            "command": "python",
            "args": ["src/mcp/server.py"],
            "env": {"DEBUG": "true"}
        }
    }
}

# Agent configurations with MCP support
deep_researcher_agent_config = dict(
    type="deep_researcher_agent",
    name="deep_researcher_agent",
    model_id="claude-3-7-sonnet-thinking",
    description="A deep researcher agent that can conduct extensive web searches.",
    max_steps=3,
    template_path="src/agent/deep_researcher_agent/prompts/deep_researcher_agent.yaml",
    provide_run_summary=True,
    tools=["deep_researcher_tool", "python_interpreter_tool"],
)

deep_analyzer_agent_config = dict(
    type="deep_analyzer_agent",
    name="deep_analyzer_agent",
    model_id="claude-3-7-sonnet-thinking",
    description="A deep analyzer agent that can perform systematic, step-by-step analysis.",
    max_steps=3,
    template_path="src/agent/deep_analyzer_agent/prompts/deep_analyzer_agent.yaml",
    provide_run_summary=True,
    tools=["deep_analyzer_tool", "python_interpreter_tool"],
)

browser_use_agent_config = dict(
    type="browser_use_agent",
    name="browser_use_agent",
    model_id="gpt-4.1",
    description="A browser use agent that can operate a browser to complete tasks.",
    max_steps=3,
    template_path="src/agent/browser_use_agent/prompts/browser_use_agent.yaml",
    provide_run_summary=True,
    tools=["auto_browser_use_tool", "python_interpreter_tool"],
)

general_tool_agent_config = dict(
    type="general_tool_agent",
    name="general_tool_agent",
    model_id="claude-3-7-sonnet-thinking",
    description="A general tool agent that can use various tools.",
    max_steps=3,
    template_path="src/agent/general_tool_agent/prompts/general_tool_agent.yaml",
    provide_run_summary=True,
    tools=["web_fetcher_tool", "web_searcher_tool", "python_interpreter_tool"],
)

planning_agent_config = dict(
    type="planning_agent",
    name="planning_agent",
    model_id="claude-3-7-sonnet-thinking",
    description="A planning agent that can coordinate other agents.",
    max_steps=10,
    template_path="src/agent/planning_agent/prompts/planning_agent.yaml",
    provide_run_summary=True,
    tools=["managed_agent_tool"],
    managed_agents=[
        deep_researcher_agent_config,
        deep_analyzer_agent_config,
        browser_use_agent_config,
        general_tool_agent_config,
    ],
)