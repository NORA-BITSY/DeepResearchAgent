# MCP (Model Context Protocol) Integration Guide

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Basic Configuration](#basic-configuration)
- [Service Integrations](#service-integrations)
  - [Gmail](#gmail-integration)
  - [Dropbox](#dropbox-integration)
  - [GitHub](#github-integration)
  - [Digital Ocean](#digital-ocean-integration)
  - [Linode](#linode-integration)
  - [Slack](#slack-integration)
  - [Google Drive](#google-drive-integration)
  - [AWS](#aws-integration)
- [Advanced Configuration](#advanced-configuration)
- [Creating Custom MCP Tools](#creating-custom-mcp-tools)
- [Troubleshooting](#troubleshooting)

## Overview

MCP (Model Context Protocol) enables DeepResearchAgent to integrate with external services and tools through a standardized protocol. This guide shows how to configure and use MCP servers for popular services like Gmail, Dropbox, GitHub, and cloud providers.

### What is MCP?

MCP is a protocol that allows AI agents to interact with external tools and services in a secure, standardized way. It provides:
- Unified tool interface across different services
- Secure authentication and authorization
- Consistent error handling
- Tool discovery and introspection

## Installation

### Prerequisites

```bash
# Install MCP dependencies
pip install fastmcp mcp-server-tools

# Install service-specific MCP servers
npm install -g @modelcontextprotocol/server-gmail
npm install -g @modelcontextprotocol/server-dropbox
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-slack
npm install -g @modelcontextprotocol/server-gdrive
```

### Python MCP Servers

```bash
# Install Python-based MCP servers
pip install mcp-server-aws
pip install mcp-server-digitalocean
pip install mcp-server-linode
pip install mcp-server-notion
pip install mcp-server-jira
```

## Basic Configuration

### 1. Update Configuration File

Edit `configs/config_main.py` to include MCP configuration:

```python
from configs.base import base_config

# MCP Tools Configuration
mcp_tools_config = {
    "mcpServers": {
        # Gmail Server
        "gmail": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-gmail"],
            "env": {
                "GMAIL_CLIENT_ID": "${GMAIL_CLIENT_ID}",
                "GMAIL_CLIENT_SECRET": "${GMAIL_CLIENT_SECRET}",
                "GMAIL_REFRESH_TOKEN": "${GMAIL_REFRESH_TOKEN}"
            }
        },
        
        # Dropbox Server
        "dropbox": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-dropbox"],
            "env": {
                "DROPBOX_ACCESS_TOKEN": "${DROPBOX_ACCESS_TOKEN}",
                "DROPBOX_APP_KEY": "${DROPBOX_APP_KEY}",
                "DROPBOX_APP_SECRET": "${DROPBOX_APP_SECRET}"
            }
        },
        
        # GitHub Server
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_TOKEN": "${GITHUB_TOKEN}",
                "GITHUB_OWNER": "${GITHUB_OWNER}",
                "GITHUB_REPO": "${GITHUB_REPO}"
            }
        },
        
        # Digital Ocean Server
        "digitalocean": {
            "command": "python",
            "args": ["-m", "mcp_server_digitalocean"],
            "env": {
                "DO_API_TOKEN": "${DO_API_TOKEN}",
                "DO_SPACES_ACCESS_KEY": "${DO_SPACES_ACCESS_KEY}",
                "DO_SPACES_SECRET_KEY": "${DO_SPACES_SECRET_KEY}"
            }
        },
        
        # Linode Server
        "linode": {
            "command": "python",
            "args": ["-m", "mcp_server_linode"],
            "env": {
                "LINODE_API_TOKEN": "${LINODE_API_TOKEN}",
                "LINODE_OBJECT_STORAGE_ACCESS_KEY": "${LINODE_ACCESS_KEY}",
                "LINODE_OBJECT_STORAGE_SECRET_KEY": "${LINODE_SECRET_KEY}"
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

# Update the main config
config = {
    **base_config,
    "mcp_tools_config": mcp_tools_config,
    "tools": [
        "mcp_manager_agent",  # Enable MCP manager
        "deep_researcher_agent",
        "deep_analyzer_agent"
    ]
}
```

### 2. Environment Variables

Add service credentials to your `.env` file:

```env
# Gmail Configuration
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token

# Dropbox Configuration
DROPBOX_ACCESS_TOKEN=your_dropbox_access_token
DROPBOX_APP_KEY=your_dropbox_app_key
DROPBOX_APP_SECRET=your_dropbox_app_secret

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username_or_org
GITHUB_REPO=default_repository_name

# Digital Ocean Configuration
DO_API_TOKEN=your_digitalocean_api_token
DO_SPACES_ACCESS_KEY=your_spaces_access_key
DO_SPACES_SECRET_KEY=your_spaces_secret_key

# Linode Configuration
LINODE_API_TOKEN=your_linode_api_token
LINODE_ACCESS_KEY=your_object_storage_access_key
LINODE_SECRET_KEY=your_object_storage_secret_key

# Slack Configuration
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_APP_TOKEN=your_slack_app_token

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

## Service Integrations

### Gmail Integration

#### Setup OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Get refresh token using OAuth playground

#### Available Tools

```python
# Gmail MCP tools available after configuration:
- gmail_send_email
- gmail_read_emails
- gmail_search_emails
- gmail_get_labels
- gmail_create_draft
- gmail_attach_file
- gmail_mark_as_read
- gmail_delete_email
```

#### Usage Example

```python
async def send_email_example():
    agent = create_agent(config_path="configs/config_main.py")
    
    result = await agent.run(
        "Send an email to john@example.com with subject 'Project Update' "
        "and body 'The project is on track for Q1 delivery.'"
    )
    
    print(result)
```

### Dropbox Integration

#### Setup Access Token

1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Create a new app
3. Generate access token
4. Set permissions for file access

#### Available Tools

```python
# Dropbox MCP tools:
- dropbox_upload_file
- dropbox_download_file
- dropbox_list_files
- dropbox_create_folder
- dropbox_delete_file
- dropbox_move_file
- dropbox_share_file
- dropbox_get_file_metadata
```

#### Usage Example

```python
async def dropbox_example():
    agent = create_agent(config_path="configs/config_main.py")
    
    result = await agent.run(
        "Upload the report.pdf file to Dropbox folder '/Reports/2024' "
        "and create a shareable link"
    )
    
    print(result)
```

### GitHub Integration

#### Setup Personal Access Token

1. Go to GitHub Settings → Developer settings
2. Generate new Personal Access Token (classic)
3. Select required scopes (repo, workflow, etc.)

#### Available Tools

```python
# GitHub MCP tools:
- github_create_issue
- github_create_pr
- github_list_issues
- github_get_pr_details
- github_merge_pr
- github_create_repository
- github_commit_files
- github_list_branches
- github_create_release
- github_manage_workflows
```

#### Usage Example

```python
async def github_example():
    agent = create_agent(config_path="configs/config_main.py")
    
    result = await agent.run(
        "Create a GitHub issue titled 'Bug: Login not working' "
        "with description of the problem and assign it to @developer"
    )
    
    print(result)
```

### Digital Ocean Integration

#### Setup API Token

1. Log in to Digital Ocean Control Panel
2. Go to API → Tokens/Keys
3. Generate new Personal Access Token
4. Set read/write permissions

#### Available Tools

```python
# Digital Ocean MCP tools:
- do_create_droplet
- do_list_droplets
- do_manage_droplet
- do_create_snapshot
- do_manage_volumes
- do_manage_load_balancers
- do_manage_databases
- do_manage_kubernetes
- do_spaces_upload
- do_spaces_download
```

#### Usage Example

```python
async def digitalocean_example():
    agent = create_agent(config_path="configs/config_main.py")
    
    result = await agent.run(
        "Create a new Ubuntu 22.04 droplet in NYC3 region "
        "with 2GB RAM and attach it to my project"
    )
    
    print(result)
```

### Linode Integration

#### Setup API Token

1. Log in to Linode Cloud Manager
2. Go to Profile → API Tokens
3. Create Personal Access Token
4. Set required permissions

#### Available Tools

```python
# Linode MCP tools:
- linode_create_instance
- linode_list_instances
- linode_manage_instance
- linode_create_volume
- linode_manage_nodebalancer
- linode_manage_domains
- linode_object_storage_upload
- linode_object_storage_download
- linode_create_backup
```

#### Usage Example

```python
async def linode_example():
    agent = create_agent(config_path="configs/config_main.py")
    
    result = await agent.run(
        "Deploy a new Linode instance with 4GB RAM in Atlanta "
        "running Ubuntu 22.04 and set up automatic backups"
    )
    
    print(result)
```

### Slack Integration

#### Setup Bot Token

1. Create Slack App at [api.slack.com](https://api.slack.com/apps)
2. Add OAuth scopes (chat:write, channels:read, etc.)
3. Install app to workspace
4. Get Bot User OAuth Token

#### Available Tools

```python
# Slack MCP tools:
- slack_send_message
- slack_read_channel
- slack_create_channel
- slack_upload_file
- slack_search_messages
- slack_get_user_info
- slack_schedule_message
- slack_add_reaction
```

### Google Drive Integration

#### Setup Credentials

1. Enable Google Drive API in Cloud Console
2. Create OAuth 2.0 credentials
3. Get refresh token

#### Available Tools

```python
# Google Drive MCP tools:
- gdrive_upload_file
- gdrive_download_file
- gdrive_list_files
- gdrive_create_folder
- gdrive_share_file
- gdrive_search_files
- gdrive_get_file_metadata
- gdrive_move_file
```

### AWS Integration

#### Setup Credentials

1. Create IAM user in AWS Console
2. Attach required policies
3. Generate access keys

#### Available Tools

```python
# AWS MCP tools:
- aws_s3_upload
- aws_s3_download
- aws_ec2_manage_instances
- aws_lambda_invoke
- aws_dynamodb_query
- aws_sns_publish
- aws_sqs_send_message
- aws_cloudformation_deploy
```

## Advanced Configuration

### Multiple Service Accounts

Configure multiple accounts for the same service:

```python
mcp_tools_config = {
    "mcpServers": {
        "gmail_personal": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-gmail"],
            "env": {
                "GMAIL_CLIENT_ID": "${GMAIL_PERSONAL_CLIENT_ID}",
                "GMAIL_CLIENT_SECRET": "${GMAIL_PERSONAL_CLIENT_SECRET}",
                "GMAIL_REFRESH_TOKEN": "${GMAIL_PERSONAL_REFRESH_TOKEN}"
            }
        },
        "gmail_work": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-gmail"],
            "env": {
                "GMAIL_CLIENT_ID": "${GMAIL_WORK_CLIENT_ID}",
                "GMAIL_CLIENT_SECRET": "${GMAIL_WORK_CLIENT_SECRET}",
                "GMAIL_REFRESH_TOKEN": "${GMAIL_WORK_REFRESH_TOKEN}"
            }
        }
    }
}
```

### Custom Tool Filtering

Control which tools are available:

```python
# Enable specific tools only
mcp_tools_config = {
    "mcpServers": {
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {"GITHUB_TOKEN": "${GITHUB_TOKEN}"},
            "tools_filter": [
                "github_create_issue",
                "github_list_issues",
                "github_create_pr"
            ]
        }
    }
}
```

### Rate Limiting

Configure rate limits for API calls:

```python
mcp_tools_config = {
    "mcpServers": {
        "gmail": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-gmail"],
            "env": {"GMAIL_CLIENT_ID": "${GMAIL_CLIENT_ID}"},
            "rate_limit": {
                "requests_per_minute": 60,
                "requests_per_hour": 1000
            }
        }
    }
}
```

### Proxy Configuration

Use proxy for MCP servers:

```python
mcp_tools_config = {
    "mcpServers": {
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_TOKEN": "${GITHUB_TOKEN}",
                "HTTP_PROXY": "http://proxy.example.com:8080",
                "HTTPS_PROXY": "http://proxy.example.com:8080"
            }
        }
    }
}
```

## Creating Custom MCP Tools

### 1. Create Tool Definition

Create `src/mcp/custom_tools.py`:

```python
from fastmcp import FastMCP
import os

# Create MCP server instance
mcp = FastMCP("Custom Tools")

@mcp.tool()
async def send_sms(phone_number: str, message: str) -> str:
    """Send SMS using Twilio"""
    from twilio.rest import Client
    
    client = Client(
        os.getenv("TWILIO_ACCOUNT_SID"),
        os.getenv("TWILIO_AUTH_TOKEN")
    )
    
    message = client.messages.create(
        body=message,
        from_=os.getenv("TWILIO_PHONE_NUMBER"),
        to=phone_number
    )
    
    return f"SMS sent successfully. Message ID: {message.sid}"

@mcp.tool()
async def translate_text(text: str, target_language: str) -> str:
    """Translate text using Google Translate"""
    from googletrans import Translator
    
    translator = Translator()
    result = translator.translate(text, dest=target_language)
    
    return result.text

@mcp.tool()
async def generate_qr_code(data: str, file_path: str) -> str:
    """Generate QR code for given data"""
    import qrcode
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(file_path)
    
    return f"QR code saved to {file_path}"

# Run the server
if __name__ == "__main__":
    import asyncio
    asyncio.run(mcp.run())
```

### 2. Register Custom Tools

Update configuration:

```python
mcp_tools_config = {
    "mcpServers": {
        "custom_tools": {
            "command": "python",
            "args": ["src/mcp/custom_tools.py"],
            "env": {
                "TWILIO_ACCOUNT_SID": "${TWILIO_ACCOUNT_SID}",
                "TWILIO_AUTH_TOKEN": "${TWILIO_AUTH_TOKEN}",
                "TWILIO_PHONE_NUMBER": "${TWILIO_PHONE_NUMBER}"
            }
        }
    }
}
```

### 3. Use Custom Tools

```python
async def use_custom_tools():
    agent = create_agent(config_path="configs/config_main.py")
    
    # Send SMS
    result = await agent.run(
        "Send an SMS to +1234567890 saying 'Meeting rescheduled to 3 PM'"
    )
    
    # Generate QR code
    result = await agent.run(
        "Generate a QR code for the URL https://example.com "
        "and save it as website_qr.png"
    )
    
    # Translate text
    result = await agent.run(
        "Translate 'Hello, how are you?' to Spanish"
    )
```

## Complete Working Example

Here's a complete example that integrates multiple MCP services:

```python
# complete_example.py
from src.agent import create_agent
import asyncio

async def multi_service_workflow():
    """
    Example workflow using multiple MCP services:
    1. Read data from Google Drive
    2. Process and analyze the data
    3. Upload results to Dropbox
    4. Create GitHub issue with findings
    5. Send notification via Gmail
    """
    
    agent = create_agent(config_path="configs/config_main.py")
    
    # Complete workflow
    result = await agent.run("""
        Please perform the following tasks:
        
        1. Download the 'sales_data_2024.csv' file from Google Drive
        2. Analyze the data to find top performing products
        3. Create a visualization chart
        4. Upload the analysis report to Dropbox folder '/Reports/Q4'
        5. Create a GitHub issue titled 'Q4 Sales Analysis Complete' 
           with the key findings
        6. Send an email to team@company.com with subject 
           'Q4 Analysis Ready' including the Dropbox link
    """)
    
    print("Workflow completed:", result)

# Run the example
if __name__ == "__main__":
    asyncio.run(multi_service_workflow())
```

## Troubleshooting

### Common Issues

#### 1. MCP Server Not Starting

```bash
# Check if MCP server is installed
npm list -g @modelcontextprotocol/server-gmail

# Reinstall if needed
npm install -g @modelcontextprotocol/server-gmail

# Test server directly
npx @modelcontextprotocol/server-gmail
```

#### 2. Authentication Errors

```python
# Debug authentication
import os
print("Gmail Client ID:", os.getenv("GMAIL_CLIENT_ID"))
print("Token exists:", bool(os.getenv("GMAIL_REFRESH_TOKEN")))
```

#### 3. Tool Not Found

```python
# List available tools
async def list_mcp_tools():
    from src.mcp.client import Client
    
    async with Client("configs/config_main.py") as client:
        tools = await client.list_tools()
        for tool in tools:
            print(f"- {tool.name}: {tool.description}")

asyncio.run(list_mcp_tools())
```

#### 4. Rate Limiting

```python
# Implement retry logic
mcp_tools_config = {
    "retry_config": {
        "max_retries": 3,
        "retry_delay": 5,
        "exponential_backoff": True
    }
}
```

### Debug Mode

Enable debug logging for MCP:

```python
mcp_tools_config = {
    "mcpServers": {
        "gmail": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-gmail"],
            "env": {
                "GMAIL_CLIENT_ID": "${GMAIL_CLIENT_ID}",
                "DEBUG": "true",
                "LOG_LEVEL": "debug"
            }
        }
    },
    "debug": True,
    "log_file": "mcp_debug.log"
}
```

### Testing MCP Integration

```python
# test_mcp.py
import pytest
import asyncio
from src.agent import create_agent

@pytest.mark.asyncio
async def test_gmail_integration():
    agent = create_agent(config_path="configs/config_test.py")
    
    # Test sending email
    result = await agent.run(
        "Send a test email to test@example.com"
    )
    
    assert "sent successfully" in result.lower()

@pytest.mark.asyncio
async def test_github_integration():
    agent = create_agent(config_path="configs/config_test.py")
    
    # Test listing issues
    result = await agent.run(
        "List all open issues in the repository"
    )
    
    assert "issues" in result.lower()
```

## Security Best Practices

### 1. Credential Management

- Never commit credentials to version control
- Use environment variables or secret management tools
- Rotate API keys regularly
- Use least privilege principle for API permissions

### 2. Secure Configuration

```python
# Use encrypted credential storage
from cryptography.fernet import Fernet

def encrypt_credential(credential: str, key: bytes) -> str:
    f = Fernet(key)
    return f.encrypt(credential.encode()).decode()

def decrypt_credential(encrypted: str, key: bytes) -> str:
    f = Fernet(key)
    return f.decrypt(encrypted.encode()).decode()
```

### 3. Audit Logging

```python
mcp_tools_config = {
    "audit_log": {
        "enabled": True,
        "log_file": "mcp_audit.log",
        "log_level": "INFO",
        "include_params": False  # Don't log sensitive parameters
    }
}
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/docs)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [FastMCP Documentation](https://github.com/jlowin/fastmcp)
- [DeepResearchAgent MCP Examples](https://github.com/skyworkai/DeepResearchAgent/tree/main/examples/mcp)

## Support

For MCP-related issues:
- GitHub Issues: [DeepResearchAgent Issues](https://github.com/skyworkai/DeepResearchAgent/issues)
- Discord: [MCP Community](https://discord.gg/mcp)
- Email: mcp-support@skywork.ai