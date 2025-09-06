#!/usr/bin/env python
"""
Example script demonstrating MCP service integrations
Run this after configuring your MCP services in .env file
"""

import asyncio
import os
from pathlib import Path
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.agent import create_agent
from src.config import Config

async def test_gmail_integration():
    """Test Gmail MCP integration"""
    print("\n📧 Testing Gmail Integration...")
    
    agent = create_agent(config_path="configs/config_mcp_services.py")
    
    # Example: Send an email
    result = await agent.run("""
        Send an email to test@example.com with:
        Subject: "Test from DeepResearchAgent"
        Body: "This is a test email sent via MCP Gmail integration."
    """)
    
    print(f"Result: {result}")
    return result

async def test_github_integration():
    """Test GitHub MCP integration"""
    print("\n🐙 Testing GitHub Integration...")
    
    agent = create_agent(config_path="configs/config_mcp_services.py")
    
    # Example: List repository issues
    result = await agent.run("""
        List all open issues in the current GitHub repository
        and provide a summary of each issue.
    """)
    
    print(f"Result: {result}")
    return result

async def test_dropbox_integration():
    """Test Dropbox MCP integration"""
    print("\n📦 Testing Dropbox Integration...")
    
    agent = create_agent(config_path="configs/config_mcp_services.py")
    
    # Example: List files in Dropbox
    result = await agent.run("""
        List all files in the root folder of my Dropbox
        and show their sizes and last modified dates.
    """)
    
    print(f"Result: {result}")
    return result

async def test_slack_integration():
    """Test Slack MCP integration"""
    print("\n💬 Testing Slack Integration...")
    
    agent = create_agent(config_path="configs/config_mcp_services.py")
    
    # Example: Send a Slack message
    result = await agent.run("""
        Send a message to the #general channel in Slack saying:
        "DeepResearchAgent MCP integration test successful! 🎉"
    """)
    
    print(f"Result: {result}")
    return result

async def test_gdrive_integration():
    """Test Google Drive MCP integration"""
    print("\n📁 Testing Google Drive Integration...")
    
    agent = create_agent(config_path="configs/config_mcp_services.py")
    
    # Example: List Google Drive files
    result = await agent.run("""
        List all files in my Google Drive root folder
        and identify any spreadsheets or documents.
    """)
    
    print(f"Result: {result}")
    return result

async def test_digitalocean_integration():
    """Test Digital Ocean MCP integration"""
    print("\n🌊 Testing Digital Ocean Integration...")
    
    agent = create_agent(config_path="configs/config_mcp_services.py")
    
    # Example: List droplets
    result = await agent.run("""
        List all my Digital Ocean droplets with their:
        - Name
        - Status
        - IP Address
        - Region
        - Size
    """)
    
    print(f"Result: {result}")
    return result

async def test_linode_integration():
    """Test Linode MCP integration"""
    print("\n🖥️ Testing Linode Integration...")
    
    agent = create_agent(config_path="configs/config_mcp_services.py")
    
    # Example: List Linode instances
    result = await agent.run("""
        List all my Linode instances and show:
        - Label
        - Status
        - Region
        - Type
        - IPv4 address
    """)
    
    print(f"Result: {result}")
    return result

async def multi_service_workflow():
    """
    Example workflow using multiple MCP services together
    """
    print("\n🔄 Testing Multi-Service Workflow...")
    
    agent = create_agent(config_path="configs/config_mcp_services.py")
    
    # Complex workflow using multiple services
    result = await agent.run("""
        Please perform this multi-service workflow:
        
        1. Search my Google Drive for any files with "report" in the name
        2. If found, download the most recent report file
        3. Create a summary of the report content
        4. Upload the summary to Dropbox in a folder called "Summaries"
        5. Create a GitHub issue titled "Report Summary Created" with the summary
        6. Send a Slack notification to #reports channel about the new summary
        7. Send an email to team@example.com with the summary and links
        
        Provide a detailed status of each step.
    """)
    
    print(f"Workflow Result: {result}")
    return result

async def list_available_tools():
    """List all available MCP tools"""
    print("\n🛠️ Available MCP Tools:")
    
    from src.mcp.client import Client
    
    # List tools from each configured MCP server
    services = ["gmail", "github", "dropbox", "slack", "gdrive", "digitalocean", "linode"]
    
    for service in services:
        try:
            print(f"\n{service.upper()} Tools:")
            # This would connect to each MCP server and list tools
            # Implementation depends on your MCP client setup
            print(f"  - {service}_* tools available when configured")
        except Exception as e:
            print(f"  - Not configured or error: {e}")

def check_env_variables():
    """Check if required environment variables are set"""
    print("\n🔍 Checking Environment Variables...")
    
    required_vars = {
        "Gmail": ["GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"],
        "GitHub": ["GITHUB_TOKEN"],
        "Dropbox": ["DROPBOX_ACCESS_TOKEN"],
        "Slack": ["SLACK_BOT_TOKEN", "SLACK_APP_TOKEN"],
        "Google Drive": ["GDRIVE_CLIENT_ID", "GDRIVE_CLIENT_SECRET", "GDRIVE_REFRESH_TOKEN"],
        "Digital Ocean": ["DO_API_TOKEN"],
        "Linode": ["LINODE_API_TOKEN"],
    }
    
    for service, vars in required_vars.items():
        configured = all(os.getenv(var) for var in vars)
        status = "✅ Configured" if configured else "❌ Not configured"
        print(f"  {service}: {status}")
        if not configured:
            missing = [var for var in vars if not os.getenv(var)]
            print(f"    Missing: {', '.join(missing)}")

async def main():
    """Main function to run MCP service tests"""
    
    print("=" * 60)
    print("DeepResearchAgent MCP Services Integration Test")
    print("=" * 60)
    
    # Check environment variables
    check_env_variables()
    
    # Menu for testing
    print("\n📋 Select a test to run:")
    print("1. Test Gmail")
    print("2. Test GitHub")
    print("3. Test Dropbox")
    print("4. Test Slack")
    print("5. Test Google Drive")
    print("6. Test Digital Ocean")
    print("7. Test Linode")
    print("8. Run Multi-Service Workflow")
    print("9. List Available Tools")
    print("0. Run All Tests")
    
    choice = input("\nEnter your choice (0-9): ").strip()
    
    tests = {
        "1": test_gmail_integration,
        "2": test_github_integration,
        "3": test_dropbox_integration,
        "4": test_slack_integration,
        "5": test_gdrive_integration,
        "6": test_digitalocean_integration,
        "7": test_linode_integration,
        "8": multi_service_workflow,
        "9": list_available_tools,
    }
    
    if choice == "0":
        # Run all tests
        for name, test_func in tests.items():
            if name != "9":  # Skip listing tools in all tests
                try:
                    await test_func()
                except Exception as e:
                    print(f"❌ Error in test: {e}")
    elif choice in tests:
        # Run selected test
        try:
            if choice == "9":
                await tests[choice]()
            else:
                await tests[choice]()
        except Exception as e:
            print(f"❌ Error: {e}")
            print("\nMake sure:")
            print("1. Required environment variables are set in .env")
            print("2. MCP servers are installed (npm install -g @modelcontextprotocol/server-*)")
            print("3. API credentials are valid and have required permissions")
    else:
        print("Invalid choice. Please run again and select 0-9.")

if __name__ == "__main__":
    asyncio.run(main())