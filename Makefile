# Makefile for Auth Systems Primer Development

# Default target
.PHONY: serve help format lint check-format check-lint

# Port for development server
PORT ?= 8080

# Help command
help:
	@echo "Auth Systems Primer - Development Commands"
	@echo ""
	@echo "make serve         - Start development server on port 8080"
	@echo "make format        - Format code with Biome"
	@echo "make lint          - Lint code with Biome"
	@echo "make check-format  - Check if code is formatted with Biome"
	@echo "make check-lint    - Check for linting issues with Biome"
	@echo "make help          - Show this help message"

# Serve files for development using Python
serve:
	@echo "Starting development server on http://localhost:$(PORT)"
	@echo "Press Ctrl+C to stop"
	@python3 -m http.server $(PORT) || echo "Python3 not available. Try make serve-node"

# Alternative serve option using Node.js
serve-node:
	@echo "Starting development server on http://localhost:$(PORT)"
	@echo "Press Ctrl+C to stop"
	@if ! command -v npx &> /dev/null; then \
		echo "npx not found. Please install Node.js"; \
		exit 1; \
	fi
	@npx http-server -p $(PORT) || echo "http-server not available. Install with: npm install -g http-server"

# Biome commands
format:
	@if ! command -v npx &> /dev/null; then \
		echo "npx not found. Please install Node.js"; \
		exit 1; \
	fi
	@npx @biomejs/biome format --write .

lint:
	@if ! command -v npx &> /dev/null; then \
		echo "npx not found. Please install Node.js"; \
		exit 1; \
	fi
	@npx @biomejs/biome lint .

check-format:
	@if ! command -v npx &> /dev/null; then \
		echo "npx not found. Please install Node.js"; \
		exit 1; \
	fi
	@npx @biomejs/biome format --check .

check-lint:
	@if ! command -v npx &> /dev/null; then \
		echo "npx not found. Please install Node.js"; \
		exit 1; \
	fi
	@npx @biomejs/biome lint --diagnostic-level=warn .
