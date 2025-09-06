"""
MCP Services Configuration for DeepResearchAgent
This config enables popular MCP server integrations
"""

from configs.base import *

# MCP Services Configuration
mcp_tools_config = {
    "mcpServers": {
        # Gmail Integration
        "gmail": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-gmail"],
            "env": {
                "GMAIL_CLIENT_ID": "${GMAIL_CLIENT_ID}",
                "GMAIL_CLIENT_SECRET": "${GMAIL_CLIENT_SECRET}", 
                "GMAIL_REFRESH_TOKEN": "${GMAIL_REFRESH_TOKEN}"
            }
        },
        
        # GitHub Integration
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_TOKEN": "${GITHUB_TOKEN}"
            }
        },
        
        # Dropbox Integration
        "dropbox": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-dropbox"],
            "env": {
                "DROPBOX_ACCESS_TOKEN": "${DROPBOX_ACCESS_TOKEN}"
            }
        },
        
        # Slack Integration
        "slack": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-slack"],
            "env": {
                "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
                "SLACK_APP_TOKEN": "${SLACK_APP_TOKEN}"
            }
        },
        
        # Google Drive Integration
        "gdrive": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-gdrive"],
            "env": {
                "GDRIVE_CLIENT_ID": "${GDRIVE_CLIENT_ID}",
                "GDRIVE_CLIENT_SECRET": "${GDRIVE_CLIENT_SECRET}",
                "GDRIVE_REFRESH_TOKEN": "${GDRIVE_REFRESH_TOKEN}"
            }
        },
        
        # Digital Ocean Integration (Python-based)
        "digitalocean": {
            "command": "python",
            "args": ["-m", "mcp_server_digitalocean"],
            "env": {
                "DO_API_TOKEN": "${DO_API_TOKEN}"
            }
        },
        
        # Linode Integration (Python-based)
        "linode": {
            "command": "python", 
            "args": ["-m", "mcp_server_linode"],
            "env": {
                "LINODE_API_TOKEN": "${LINODE_API_TOKEN}"
            }
        },
        
        # AWS Integration (Python-based)
        "aws": {
            "command": "python",
            "args": ["-m", "mcp_server_aws"],
            "env": {
                "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
                "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}",
                "AWS_REGION": "${AWS_REGION}"
            }
        },
        
        # Local MCP Server (for custom tools)
        "local": {
            "command": "python",
            "args": ["src/mcp/server.py"],
            "env": {"DEBUG": "true"}
        }
    }
}

# Planning Agent Configuration with MCP
planning_agent_config = dict(
    type="PlanningAgent",
    model_id="gemini-2.0-pro",
    max_steps=30,
    tools=[
        "mcp_manager_agent",  # MCP manager for all MCP tools
        "deep_researcher_agent",
        "deep_analyzer_agent",
        "browser_use_agent",
        "python_interpreter"
    ],
    template_path="templates/planning_agent.txt"
)

# General Agent Configuration with MCP
general_agent_config = dict(
    type="GeneralAgent",
    model_id="gemini-2.0-pro",
    max_steps=20,
    tools=[
        "mcp_manager_agent",  # Access to all MCP tools
        "python_interpreter",
        "web_searcher",
        "file_reader"
    ]
)

# Tool configurations
tools_config = {
    **web_fetcher_tool_config,
    **web_searcher_tool_config,
    **deep_researcher_tool_config,
    **auto_browser_use_tool_config,
    **deep_analyzer_tool_config,
    **file_reader_tool_config,
    "mcp_tools": mcp_tools_config
}

# Main configuration
config = dict(
    agent_type="hierarchical",  # or "single" for single agent
    planning_agent=planning_agent_config,
    general_agent=general_agent_config,
    tools=tools_config,
    mcp_enabled=True,
    debug=False
)