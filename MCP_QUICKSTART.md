# MCP Tools Quick Start Checklist

## 1. Copy and configure environment variables
```bash
cp .env.template .env
# Edit .env with your API keys
```

## 2. Install MCP dependencies
```bash
conda activate dra
pip install mcp-server-fetch mcp-server-qdrant
brew install uv  # macOS only
```

## 3. Start Qdrant (optional, for memory)
```bash
docker run -p 6333:6333 qdrant/qdrant
```

## 4. Test MCP configuration
```bash
# Use the MCP-enabled config
python main.py --config configs/config_mcp.py

# Or test individual MCP servers
npx -y @tavily/mcp --version
uvx markitdown-mcp-server --help
```

## 5. Quick integration options

### Option A: Use MCP Manager Agent
```python
# In your code or interactive session
"Register all MCP servers from configs/mcp_tools.json"
```

### Option B: Direct config usage
```python
from configs.config_mcp import config
# Your MCP-enabled agents are ready to use
```

### Option C: Manual registration
```python
from src.mcp.mcp_manager import MCPManager
manager = MCPManager()
manager.load_from_json("configs/mcp_tools.json")
```

## Files created:
- `configs/mcp_tools.json` - MCP server definitions
- `configs/config_mcp.py` - Python config with MCP integration
- `MCP_INTEGRATION_GUIDE.md` - Full documentation
- `.env.template` - Updated with MCP API keys

## Essential API keys to get started:
1. **Tavily** - https://tavily.com (free tier)
2. **Firecrawl** - https://firecrawl.dev (free tier)
3. **Exa** - https://exa.ai (optional, enhanced search)