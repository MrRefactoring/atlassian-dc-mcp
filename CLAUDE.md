# Atlassian DC MCP Project Guidelines

## Build/Test/Lint Commands
```bash
# Build all packages (builds common first, then others)
npm run build

# Build specific package
npm run build --workspace=@atlassian-dc-mcp/jira

# Run all tests
npm run test

# Run tests for specific package
npm run test --workspace=@atlassian-dc-mcp/jira

# Run specific test (using Jest)
npx jest -t 'test name' --workspace=@atlassian-dc-mcp/jira

# Development mode
npm run dev:jira
npm run dev:confluence
npm run dev:bitbucket

# Debugging
npm run debug
npm run debug:verbose
```

## Code Style Guidelines
- **TypeScript**: Use strong typing, avoid `any`
- **Imports**: External dependencies first, then internal packages, then local imports
- **Classes**: Max 300 lines of code
- **Functions**: Max 35 lines of code
- **Error Handling**: Use `handleApiOperation` utility from common package
- **Naming**: PascalCase for classes/interfaces, camelCase for variables/functions
- **Composition**: Prefer small, composable functions and classes
- **Comments**: Avoid generic comments, only explain non-obvious solutions
- **APIs**: Use service classes with consistent error handling patterns
- **DRY**: Avoid duplication, extract common code into functions or classes