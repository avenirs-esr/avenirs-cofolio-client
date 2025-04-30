# Avenirs Cofolio Client

The Avenirs Cofolio project is a comprehensive portfolio management system designed to support lifelong portfolio development for citizens. It aims to:

- Enable continuity in portfolio approaches throughout a citizen's life
- Facilitate awareness, recognition, and promotion of skills and competencies
- Support the development of life projects (personal, educational, career orientation, professional development, and civic engagement)
## Project Structure

- `src/`: Source code
  - `assets/`: Static assets
  - `common/`: Shared utilities and cross-cutting concerns
    - `api/`: API services and HTTP client configuration
      - `http.client.ts`: Axios-based HTTP client setup
    - `composables/`: Reusable Vue composition functions
    - `exceptions/`: Error handling infrastructure
  - `components/`: Reusable UI components
  - `features/`: Feature modules
    - `student/`: Student module with complete folder structure
    - `teacher/`: Teacher module with complete folder structure
  - `layouts/`: Application layouts
  - `plugins/`: Vue plugins
  - `router/`: Routing configuration
  - `store/`: State management
  - `ui/`: Core UI components
  - `views/`: Main application views

## Project Architecture

The project follows a feature-based architecture with a clear separation of concerns:

### Feature-Based Organization

Each feature module (`student`, `teacher`) follows a consistent internal structure:

```
features/
├── student/                 # Student module
│   ├── components/          # Student-specific UI components
│   ├── composables/         # Student-specific Vue composition functions
│   ├── layouts/             # Layout structures for student views
│   ├── queries/             # Data fetching logic using TanStack Query
│   ├── views/               # Student page components
│   ├── index.ts             # Module entry point and exports
│   └── routes.ts            # Student route definitions
├── teacher/                 # Teacher module
│   ├── components/          # Teacher-specific UI components
│   ├── composables/         # Teacher-specific Vue composition functions
│   ├── layouts/             # Layout structures for teacher views
│   ├── queries/             # Teacher-specific data fetching
│   ├── views/               # Teacher page components
│   └── ...                  # Similar structure as student module
```

This modular approach ensures that:
- Each user role has dedicated, purpose-built interfaces
- Code is organized by domain rather than technical function
- Features can be developed, tested, and maintained independently
- Clear boundaries exist between different parts of the application
## Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Preview production build
npm run preview

# Build for production
npm run build

# Run all tests (unit + e2e)
npm run test

# Run only unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:watch
```

## Features

- Student portfolio management
- Teacher assessment tools
- Asset organization
- Progress tracking

## Tech Stack

- **Frontend Framework**: Vue.js
- **State Management**: Pinia
- **Routing**: Vue Router
- **API Client**: Axios
- **Data Fetching**: TanStack Vue Query
- **UI Framework**: DSFR (Design System France) via @gouvminint/vue-dsfr 6.0
- **Build Tool**: Vite
- **Language**: TypeScript
- **Testing**:
  - Unit Testing: Vitest 3.1