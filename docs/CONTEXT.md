# Project Context Guide

## Key Files for Context Loading

1. **README.md**
   - Project overview
   - Core features
   - Setup instructions
   - Architecture overview

2. **CHANGELOG.md**
   - Recent changes and updates
   - Component additions
   - Technical decisions
   - Current focus areas

3. **TODO.md**
   - High priority tasks
   - Component-specific improvements
   - Technical debt
   - Future enhancements

4. **docs/roadmap.md**
   - Development phases
   - Timeline estimates
   - Feature planning
   - Dependencies

5. **docs/api-endpoints.md**
   - API documentation
   - Backend routes
   - Request/response formats

6. **docs/data-models.md**
   - Database schema
   - Data relationships
   - Model definitions

## Important Technical Details

1. **Backend Configuration**
   - Server runs on port 3001
   - All frontend API calls should reference port 3001
   - Located in backend/ directory
   - Uses Prisma ORM

2. **Frontend Structure**
   - React/Vite application
   - Mix of TypeScript (.tsx) and JavaScript (.jsx)
   - Material-UI for components
   - Located in src/ directory

3. **Authentication Flow**
   - Phantom wallet integration
   - Profile creation for new wallet addresses
   - JWT handling
   - Protected routes

4. **Development Workflow**
   - Make small, incremental changes
   - Test changes frequently
   - Update documentation as needed
   - Follow existing code patterns

## Project Standards

1. **Code Style**
   - Follow existing TypeScript/JavaScript patterns
   - Use Material-UI theming
   - Maintain consistent spacing (8px increments)
   - Keep component backgrounds white

2. **Component Structure**
   - One component per file
   - Shared styling through theme
   - Proper TypeScript types
   - Error boundaries where needed

3. **Documentation**
   - Update CHANGELOG.md for significant changes
   - Keep TODO.md current
   - Document new features
   - Update API documentation

4. **Testing**
   - Test changes incrementally
   - Verify mobile responsiveness
   - Check error handling
   - Validate against requirements

## Common Tasks

1. **Adding New Features**
   - Check roadmap.md for phase alignment
   - Update TODO.md with subtasks
   - Follow existing patterns
   - Test thoroughly

2. **Making Changes**
   - Make small, incremental updates
   - Test each change
   - Update documentation
   - Consider mobile view

3. **Fixing Issues**
   - Identify root cause
   - Make minimal necessary changes
   - Test thoroughly
   - Document the fix

4. **Adding Components**
   - Follow existing component structure
   - Use Material-UI
   - Include proper types
   - Add to documentation
