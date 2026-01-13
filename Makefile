# Makefile for Auth Systems Primer Development

# Default target
.PHONY: serve help

# Port for development server
PORT ?= 8080

# Help command
help:
	@echo "Auth Systems Primer - Development Commands"
	@echo ""
	@echo "make serve    - Start development server on port 8080"
	@echo "make help     - Show this help message"

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
