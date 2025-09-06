# MCP Tools Integration Guide for DeepResearchAgent

## Quick Start

### 1. Install Prerequisites

```bash
# Activate your DRA environment
conda activate dra

# Install Python MCP servers
pip install mcp-server-fetch mcp-server-qdrant

# Install UV for running Python MCP tools (macOS/Linux)
brew install uv  # macOS
# or
curl -LsSf https://astral.sh/uv/install.sh | sh  # Linux

# Install Node.js MCP servers globally (optional, npx will handle it)
npm install -g @tavily/mcp exa-mcp firecrawl-mcp-server
```

### 2. Set Up API Keys

Add these to your `.env` file:

```bash
# Core Search & Crawl
TAVILY_API_KEY=your_tavily_api_key_here
EXA_API_KEY=your_exa_api_key_here
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
PUREMD_API_KEY=your_puremd_api_key_here

# Memory & Persistence
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=optional_if_local
QDRANT_COLLECTION=deep_research

# Project Sources (optional)
GITHUB_TOKEN=your_github_token_here
NOTION_TOKEN=your_notion_token_here

# Filesystem Access
FILE_ACCESS_ROOT=./data
```

### 3. Start Qdrant (for memory persistence)

```bash
# Using Docker
docker run -p 6333:6333 qdrant/qdrant

# Or using local binary
./qdrant --storage-dir ./qdrant_storage
```

## Agent-Specific Tool Mapping

### Deep Researcher Agent
- **Primary:** Tavily (breadth-first discovery)
- **Secondary:** Exa (precision search)
- **Fallback:** Fetch, Firecrawl (tough pages)
- **Sources:** GitHub, Notion

### Browser Use Agent
- **Primary:** Firecrawl (JS rendering)
- **Unblocker:** Pure.md (anti-bot bypass)
- **Basic:** Tavily extract tools

### Deep Analyzer Agent
- **Converter:** MarkItDown (PDF/DOCX/PPTX → Markdown)
- **Sources:** GitHub (code analysis)
- **Local:** Filesystem access

### General Tool Agent
- **Memory:** Qdrant (store/retrieve)
- **Basic:** Fetch, Filesystem
- **Coordination:** Tool reuse registry

## Usage Patterns

### 1. Research Pipeline
```python
# In your config or agent code
research_flow = [
    "tavily_search",     # Initial discovery
    "exa_search",        # Precision refinement  
    "firecrawl_crawl",   # Deep extraction
    "markitdown_convert", # Normalize formats
    "qdrant_store"       # Persist findings
]
```

### 2. Tough Site Handling
```python
# Fallback chain for difficult sites
if fetch_fails:
    try_firecrawl()  # JS rendering
    if still_blocked:
        use_puremd()  # Unblocking service
```

### 3. Memory & Reuse
```python
# Store research artifacts
qdrant.store(
    collection="deep_research",
    embeddings=findings,
    metadata={"agent": "deep_researcher", "task": task_id}
)

# Retrieve on follow-ups
context = qdrant.search(query, collection="deep_research")
```

## Configuration in DeepResearchAgent

### Option 1: Direct JSON Loading
The MCP tools config is already at `configs/mcp_tools.json`. DRA can load it directly.

### Option 2: Python Config Integration
See `configs/config_mcp.py` for Python-based configuration.

### Option 3: MCP Manager Agent
Ask the MCP Manager Agent to:
```
"Register all MCP servers from configs/mcp_tools.json"
```

## Tool Priority & Fallbacks

1. **Search Chain:**
   - Tavily → Exa → Fetch → Pure.md

2. **Crawl Chain:**
   - Firecrawl → Pure.md → Fetch

3. **Document Processing:**
   - MarkItDown → (fallback to raw text)

4. **Memory:**
   - Qdrant → (local file cache)

## Troubleshooting

### Common Issues

1. **MCP server not starting:**
   ```bash
   # Check if command exists
   which uvx
   which npx
   
   # Test server directly
   npx -y @tavily/mcp --version
   ```

2. **API key issues:**
   ```bash
   # Verify env vars are loaded
   python -c "import os; print(os.getenv('TAVILY_API_KEY'))"
   ```

3. **Qdrant connection:**
   ```bash
   # Check if Qdrant is running
   curl http://localhost:6333/health
   ```

### Debug Mode

Enable MCP debug logging in your config:
```python
mcp_config = {
    "debug": True,
    "log_level": "DEBUG",
    "log_file": "logs/mcp_debug.log"
}
```

## Performance Tips

1. **Batch Operations:** Use Firecrawl's batch mode for multiple URLs
2. **Caching:** Enable cache_ttl in mcp_tools.json (default: 1 hour)
3. **Parallel Search:** Run Tavily + Exa concurrently
4. **Memory Limits:** Configure Qdrant collection size limits
5. **Timeout Tuning:** Adjust per-tool timeouts based on your needs

## API Key Resources

- **Tavily:** https://tavily.com (free tier: 1000 searches/month)
- **Exa:** https://exa.ai (free tier: 1000 searches/month)
- **Firecrawl:** https://firecrawl.dev (free tier: 500 pages/month)
- **Pure.md:** https://pure.md (free tier available)
- **Qdrant:** Local instance is free, cloud at https://cloud.qdrant.io
- **GitHub:** https://github.com/settings/tokens
- **Notion:** https://www.notion.so/my-integrations