# Development commands for Learn to Auth!

PORT ?= 8080
BIN := ./node_modules/.bin

.PHONY: help install serve format lint check check-html check-links check-all diagrams

help:
	@echo "Learn to Auth! - Development Commands"
	@echo ""
	@echo "make install       - Install development dependencies"
	@echo "make serve         - Serve the site on port $(PORT)"
	@echo "make format        - Format code with Biome"
	@echo "make lint          - Lint code with Biome"
	@echo "make check         - Run Biome checks"
	@echo "make check-html    - Validate HTML"
	@echo "make check-links   - Check local links and service-worker paths"
	@echo "make check-all     - Run every check"
	@echo "make diagrams      - Render diagrams/*.excalidraw to assets/diagrams/*.svg"

install:
	npm install

serve:
	@echo "Serving on http://localhost:$(PORT)"
	@python3 -m http.server $(PORT)

format: require-node-modules
	@$(BIN)/biome format --write .

lint: require-node-modules
	@$(BIN)/biome lint .

check: require-node-modules
	@$(BIN)/biome check .

check-html: require-node-modules
	@$(BIN)/html-validate "**/*.html"

check-links:
	@node scripts/check-links.mjs

check-all: check check-html check-links

diagrams: require-node-modules
	@node scripts/render-diagrams.mjs

require-node-modules:
	@if [ ! -x "$(BIN)/biome" ]; then \
		echo "Development dependencies are missing. Run: make install"; \
		exit 1; \
	fi
