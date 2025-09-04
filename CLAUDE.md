# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DeepResearchAgent is a hierarchical multi-agent system for deep research and general task solving. It uses a two-layer architecture with a top-level planning agent coordinating specialized lower-level agents.

## Setup and Installation

### Environment Setup
```bash
# Create and activate conda environment
conda create -n dra python=3.11
conda activate dra

# Install dependencies (choose one)
make install                # Using Poetry
make install-requirements   # Using requirements.txt
```

### Configuration
- Copy `.env.template` to `.env` and configure API keys
- Main configuration files are in `configs/` directory
- Uses mmengine config format (Python-based configs)

## Development Commands

### Running the Application
```bash
python main.py                    # Run main application with default config
python main.py --config configs/config_main.py  # Run with specific config
python examples/run_general.py   # Run single agent example
python examples/run_gaia.py      # Run GAIA evaluation
```

### Testing
```bash
# Run specific test files (uses unittest framework)
python tests/test_researcher.py
python tests/test_analyzer.py
python tests/test_python_interpreter.py
```

### Dependency Management
```bash
make update          # Update dependencies using Poetry
poetry install       # Install new dependencies
```

## Architecture

### Core Components

1. **Planning Agent** (`src/agent/planning_agent/`)
   - Top-level orchestrator that decomposes tasks
   - Coordinates specialized lower-level agents
   - Configured in `planning_agent_config`

2. **Specialized Agents** (`src/agent/`)
   - `deep_researcher_agent`: Web research and information synthesis
   - `deep_analyzer_agent`: Systematic data analysis
   - `browser_use_agent`: Automated browser operations with pixel-level control

3. **Tools System** (`src/tools/`)
   - Modular tool architecture with registry pattern
   - Python interpreter with sandboxing (`python_interpreter_tool`)
   - Browser automation (`auto_browser_use_tool`)
   - Research tools (`deep_researcher_tool`)

4. **MCP Integration** (`src/mcp/`)
   - Model Context Protocol support for tool discovery
   - Both local and remote MCP tool integration
   - Configured via `mcp_tools_config`

### Configuration System

- **Base Config**: `configs/base.py` contains shared settings
- **Main Config**: `configs/config_main.py` for production setup
- **Specialized Configs**: 
  - `config_gaia.py`: GAIA benchmark evaluation
  - `config_general.py`: Single agent setup
  - `config_oai_deep_research.py`: OpenAI-specific setup

### Agent Creation Pattern

Agents are built using the factory pattern in `src/agent/agent.py`:
- `build_agent()`: Creates individual agent instances
- `create_agent()`: Main entry point for hierarchical or single agent setup
- Registry system (`src/registry.py`) for dynamic agent/tool discovery

### Model Support

Supports multiple LLM providers via `src/models/`:
- OpenAI (GPT-4.1)
- Anthropic (Claude-3.7-sonnet-thinking)
- Google (Gemini 2.5 Pro)
- Local models via vLLM (Qwen family)

## Key Development Patterns

### Agent Configuration
Each agent requires:
- `type`: Agent class name
- `model_id`: LLM model identifier
- `tools`: List of available tools
- `max_steps`: Maximum execution steps
- `template_path`: Prompt template location

### Tool Integration
- Tools registered in `TOOL` registry
- Config-based tool instantiation
- Support for regular tools, MCP tools, and managed agents

### Async Operations
- Entire framework is async-first
- Use `asyncio.run(main())` for entry points
- Agent coordination handles concurrent operations

## Testing Strategy

- Unit tests in `tests/` directory using `unittest` framework
- Integration tests for GAIA benchmark evaluation
- Sandbox testing for Python interpreter security

## Special Features

- **Sandboxed Execution**: Python interpreter with import controls and resource limits
- **Browser Automation**: Pixel-level browser control via browser-use integration  
- **Image/Video Generation**: Imagen and Veo3 model integration
- **MCP Support**: Dynamic tool discovery and execution