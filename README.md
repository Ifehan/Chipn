# Tunga Pay

A modern bill splitting and payment management application built with React, TypeScript, and Tailwind CSS. Tunga Pay helps users manage shared expenses, split bills with groups, and track transaction history.

## 🚀 Features

- **Authentication System**
  - User login and signup
  - Welcome page with onboarding
  - Secure authentication flow

- **Dashboard**
  - Real-time statistics display
  - Quick action buttons for common tasks
  - Recent bills overview
  - Tab navigation between Bills and Groups

- **Bill Management**
  - Create new bills with multiple split methods (Equal, Percentage, Custom)
  - View recent bills andtransaction-history
  - Transaction history tracking
  - Empty state handling with helpful prompts

- **Groups**
  - Manage payment groups
  - Group-based bill splitting
  - Member management

- **Profile Settings**
  - User account management
  - Payment method configuration
  - Support and help center
  - Logout functionality

## 🛠️ Tech Stack

### Core
- **Framework:** React 18.2 with TypeScript 5.5
- **Build Tool:** Vite 5.0
- **Routing:** React Router DOM 7.9
- **Styling:** Tailwind CSS 4.1

### UI & Components
- **UI Components:** Radix UI primitives (Accordion, Dialog, Dropdown, Select, etc.)
- **Icons:** Lucide React 0.454
- **Form Handling:** React Hook Form 7.60 + Zod 3.25 validation
- **Date Handling:** date-fns 4.1
- **Charts:** Recharts 2.15
- **Animations:** Tailwind CSS Animate
- **Notifications:** Sonner 1.7

### Testing
- **Unit/Integration Testing:** Jest 30.2 + React Testing Library 16.3
- **E2E Testing:** Playwright 1.56 with Page Object Model
- **Test Utilities:** @testing-library/user-event 14.6, @testing-library/jest-dom 6.9
- **Coverage:** 70% threshold for branches, functions, lines, and statements

### Development Tools
- **TypeScript:** 5.5 with strict type checking
- **PostCSS:** 8.5 with Tailwind CSS
- **Analytics:** Vercel Analytics 1.3

## 📁 Project Structure

```
tunga-pay/
├── docker/                     # Docker configuration
│   ├── dev/                    # Development environment
│   │   └── Dockerfile          # Dev Dockerfile
│   └── prod/                   # Production environment
│       ├── Dockerfile          # Production Dockerfile
│       └── nginx.conf          # Nginx configuration
├── e2e/                        # E2E tests with Playwright
│   ├── pages/                  # Page Object Models
│   │   ├── BasePage.ts
│   │   ├── WelcomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── HomePage.ts
│   │   └── CreateBillPage.ts
│   ├── auth.spec.ts            # Authentication tests
│   ├── bills.spec.ts           # Bill management tests
│   └── navigation.spec.ts      # Navigation tests
├── src/
│   ├── components/
│   │   ├── atoms/              # Basic building blocks (8 components)
│   │   │   ├── Avatar.tsx
│   │   │   ├── BackButton.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── SettingItem.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── TabButton.tsx
│   │   │   └── __tests__/      # Unit tests for atoms
│   │   ├── molecules/          # Composed components (11 components)
│   │   │   ├── Header.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   ├── PaymentMethodCard.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── SectionCard.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── SplitMethodSelector.tsx
│   │   │   ├── StatsContainer.tsx
│   │   │   ├── TabsContainer.tsx
│   │   │   └── __tests__/      # Unit tests for molecules
│   │   └── organisms/          # Complex sections (7 components)
│   │       ├── AccountSettingsSection.tsx
│   │       ├── AuthCard.tsx
│   │       ├── EmptyBillsState.tsx
│   │       ├── GroupsContent.tsx
│   │       ├── PaymentSettingsSection.tsx
│   │       ├── RecentBillsSection.tsx
│   │       ├── SupportSection.tsx
│   │       └── __tests__/      # Integration tests for organisms
│   ├── pages/                  # Page-level components (7 pages)
│   │   ├── WelcomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── CreateNewBillPage.tsx
│   │   ├── ProfileSettingsPage.tsx
│   │   ├── TransactionHistoryPage.tsx
│   │   └── __tests__/          # Page integration tests
│   ├── test-utils/             # Testing utilities
│   │   └── index.tsx           # Custom render with providers
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.cjs
├── postcss.config.cjs
├── jest.config.ts              # Jest configuration
├── jest.setup.ts               # Test environment setup
├── playwright.config.ts        # Playwright E2E configuration
├── docker-compose.yml          # Docker Compose configuration
├── .dockerignore               # Docker ignore file
├── docs/                       # Documentation directory
│   ├── README.md              # Documentation index
│   ├── unit-testing.md        # Unit/Integration testing guide
│   └── e2e-testing.md         # E2E testing guide
└── README.md                   # This file
```

## 🏗️ Component Architecture

The project follows **Atomic Design principles**:

### **Atoms** (`src/components/atoms/`)
Smallest, reusable UI elements. Each atom is a single-purpose component:
- **Avatar** - User profile pictures
- **BackButton** - Navigation back button
- **Button** - Primary action buttons with variants
- **Card** - Container component
- **Input** - Form input fields
- **SettingItem** - Settings list item
- **StatCard** - Statistics display card
- **TabButton** - Tab navigation button

### **Molecules** (`src/components/molecules/`)
Combinations of atoms that form functional UI components:
- **Header** - App header with user info
- **LoginForm** - Authentication form
- **LogoutButton** - Logout functionality
- **PaymentMethodCard** - Payment method display
- **ProfileCard** - User profile information
- **QuickActions** - Dashboard quick action buttons
- **SectionCard** - Content section wrapper
- **SignupForm** - Registration form
- **SplitMethodSelector** - Bill split method chooser
- **StatsContainer** - Statistics overview
- **TabsContainer** - Tab navigation system

### **Organisms** (`src/components/organisms/`)
Complex UI sections composed of molecules and atoms:
- **AccountSettingsSection** - User account settings
- **AuthCard** - Authentication container
- **EmptyBillsState** - Empty state for bills
- **GroupsContent** - Groups management interface
- **PaymentSettingsSection** - Payment configuration
- **RecentBillsSection** - Recent bills display
- **SupportSection** - Help and support

### **Pages** (`src/pages/`)
Full page components that combine organisms, molecules, and atoms:
- **WelcomePage** - Landing/onboarding
- **LoginPage** - User authentication
- **SignupPage** - New user registration
- **HomePage** - Main dashboard
- **CreateNewBillPage** - Bill creation form
- **ProfileSettingsPage** - User settings
- **TransactionHistoryPage** - Transaction list

## 🚦 Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | WelcomePage | Landing/onboarding page |
| `/login` | LoginPage | User authentication |
| `/signup` | SignupPage | New user registration |
| `/home` | HomePage | Main dashboard with bills/groups |
| `/profile` | ProfileSettingsPage | User settings and profile |
| `/create-bill` | CreateNewBillPage | Create new bill form |
| `/transactions` | TransactionHistoryPage | View alltransaction-history |

## 🎯 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm
- Docker and Docker Compose (for containerized deployment)

### Installation

#### Option 1: Local Development (without Docker)

1. Clone the repository:
```bash
git clone <repository-url>
cd tunga-pay
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

#### Option 2: Docker Development

1. Clone the repository:
```bash
git clone <repository-url>
cd tunga-pay
```

2. Start the development container:
```bash
docker-compose up tunga-pay-dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

The development container includes hot-reload, so changes to your code will be reflected immediately.

#### Option 3: Docker Production

1. Build and start the production container:
```bash
docker-compose up tunga-pay-prod
```

2. Open your browser and navigate to:
```
http://localhost
```

The production build is optimized and served via Nginx.

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run type-check` - Run TypeScript type checking
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Docker Commands

**Development:**
```bash
# Start development container
docker-compose up tunga-pay-dev

# Start in detached mode
docker-compose up -d tunga-pay-dev

# Stop development container
docker-compose down

# View logs
docker-compose logs -f tunga-pay-dev

# Rebuild container
docker-compose up --build tunga-pay-dev
```

**Production:**
```bash
# Build and start production container
docker-compose up tunga-pay-prod

# Start in detached mode
docker-compose up -d tunga-pay-prod

# Stop production container
docker-compose down

# View logs
docker-compose logs -f tunga-pay-prod

# Rebuild container
docker-compose up --build tunga-pay-prod
```

**Using Dockerfile directly:**
```bash
# Build development image
docker build -f docker/dev/Dockerfile -t tunga-pay:dev .

# Run development container
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules tunga-pay:dev

# Build production image
docker build -f docker/prod/Dockerfile -t tunga-pay:prod .

# Run production container
docker run -p 80:80 tunga-pay:prod
```

### Testing

**Unit/Integration Tests (Jest):**
- `npm test` - Run all unit/integration tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:ui` - Run tests with verbose output

**E2E Tests (Playwright):**
- `npm run test:e2e` - Run all E2E tests
- `npm run test:e2e:ui` - Run E2E tests in UI mode
- `npm run test:e2e:headed` - Run E2E tests in headed mode
- `npm run test:e2e:debug` - Debug E2E tests
- `npm run test:e2e:report` - View E2E test report

**📖 Testing Documentation:**
- **[Unit/Integration Testing Guide](docs/unit-testing.md)** - Comprehensive guide for Jest and React Testing Library
- **[E2E Testing Guide](docs/e2e-testing.md)** - Complete Playwright testing documentation with troubleshooting
- **[Documentation Index](docs/README.md)** - Full documentation overview

## 🧪 Testing

The project has comprehensive test coverage at multiple levels:

### Unit & Integration Tests (Jest + RTL)
**33 test files** covering all component levels:
- **8 Atom tests** - Unit tests for basic components
- **11 Molecule tests** - Tests for composed components
- **7 Organism tests** - Integration tests for complex sections
- **7 Page tests** - Full page integration tests

**Stack:**
- Jest 30.2 with jsdom environment
- React Testing Library 16.3
- User Event 14.6 for interaction simulation
- 70% coverage threshold

**Features:**
- Co-located tests in `__tests__` directories
- Custom render utilities with router support
- Mocked browser APIs (matchMedia, IntersectionObserver, ResizeObserver)

### E2E Tests (Playwright)
**3 test suites** covering critical user workflows:
- **Authentication tests** - Login, signup, form validation
- **Bill management tests** - Create bills, form interactions
- **Navigation tests** - Routing, tab switching, protected routes

**Stack:**
- Playwright 1.56 with TypeScript
- Page Object Model architecture
- Multi-browser testing (Chromium, Firefox, WebKit)
- Mobile viewport testing

**Features:**
- Automatic dev server startup
- Screenshots and videos on failure
- Trace recording for debugging
- Parallel test execution

### Testing Documentation

Comprehensive testing guides are available in the [`docs/`](docs/) directory:

- **[Unit/Integration Testing Guide](docs/unit-testing.md)** - Jest and React Testing Library
  - Component testing strategies
  - Test utilities and custom renders
  - Mocking patterns
  - Coverage requirements

- **[E2E Testing Guide](docs/e2e-testing.md)** - Playwright end-to-end testing
  - Page Object Model architecture
  - API mocking requirements (⚠️ **Important**: Login tests require both `/auth/login` AND `/users/me` mocks)
  - Multi-browser testing
  - Debugging and troubleshooting
  - Common issues and solutions

- **[Documentation Index](docs/README.md)** - Complete documentation overview

## 🎨 Styling

The project uses **Tailwind CSS** for styling with custom configurations:

- **Configuration:** [`tailwind.config.cjs`](tailwind.config.cjs)
- **PostCSS setup:** [`postcss.config.cjs`](postcss.config.cjs)
- **Custom animations** via `tailwindcss-animate`
- **Utility classes** with `tailwind-merge` and `clsx`
- **Dark mode support** via `next-themes`
- **Responsive design** with mobile-first approach

### Design System
- **Colors:** Green primary (#10b981), gray neutrals
- **Typography:** System font stack with proper hierarchy
- **Spacing:** Consistent 4px base unit
- **Border radius:** Rounded corners (lg, md, sm)
- **Shadows:** Subtle elevation system

## 🔧 Configuration Files

- **[`vite.config.ts`](vite.config.ts)** - Vite build configuration with React plugin
- **[`tsconfig.json`](tsconfig.json)** - TypeScript compiler options with strict mode
- **[`tailwind.config.cjs`](tailwind.config.cjs)** - Tailwind CSS customization
- **[`postcss.config.cjs`](postcss.config.cjs)** - PostCSS plugins configuration
- **[`jest.config.ts`](jest.config.ts)** - Jest testing configuration
- **[`jest.setup.ts`](jest.setup.ts)** - Test environment setup
- **[`playwright.config.ts`](playwright.config.ts)** - Playwright E2E configuration

## 📊 Code Quality

### TypeScript
- Strict type checking enabled
- Path aliases configured (`@/` → `src/`)
- Comprehensive type definitions
- No implicit any

### Testing Coverage
- 70% minimum coverage threshold (Jest)
- Unit tests for all atoms and molecules
- Integration tests for organisms and pages
- E2E tests for critical user workflows
- User interaction testing with userEvent and Playwright

### Best Practices
- Atomic Design methodology
- Component co-location with tests
- Semantic HTML and accessibility
- Responsive design patterns
- Reusable utility functions

## 📝 Development Notes

### Current State
- The application uses mock/placeholder data for demonstration
- Authentication logic needs backend API integration
- Profile data is hardcoded and requires state management
- Bill splitting calculations need backend validation

### Future Enhancements
- Backend API integration
- Real-time updates with WebSockets
- Push notifications
- Offline support with PWA
- Advanced analytics and reporting
- Multi-currency support
- Receipt scanning with OCR

## 🐳 Docker Architecture

The project includes a multi-stage Dockerfile with three targets:

### Development Stage
- Based on Node.js 18 Alpine
- Includes all dependencies (dev + production)
- Hot-reload enabled via volume mounting
- Exposes port 5173 for Vite dev server
- Ideal for local development

### Production Stage
- Multi-stage build for optimized image size
- Builder stage compiles the application
- Production stage uses Nginx Alpine
- Serves static files with optimized caching
- Includes security headers and gzip compression
- Health checks configured
- Exposes port 80

### Docker Compose Services

**tunga-pay-dev:**
- Development environment with hot-reload
- Volume mounting for live code changes
- Port 5173 exposed
- Auto-restart enabled

**tunga-pay-prod:**
- Production-ready deployment
- Optimized Nginx configuration
- Port 80 exposed
- Health checks enabled
- Auto-restart enabled

## 🔐 Environment Setup

For production deployment, ensure to:

1. **Configure environment variables** for API endpoints
2. **Set up authentication** middleware and JWT handling
3. **Implement secure session** management
4. **Connect to database** for data persistence
5. **Enable HTTPS** for secure communication (use reverse proxy like Traefik or Nginx)
6. **Set up monitoring** and error tracking
7. **Configure CDN** for static assets

### Docker Production Deployment

For production Docker deployment:

1. **Use environment variables** in docker-compose.yml:
```yaml
environment:
  - VITE_API_URL=https://api.example.com
  - VITE_APP_ENV=production
```

2. **Enable HTTPS** with reverse proxy (Traefik, Nginx Proxy Manager, or Caddy)

3. **Use Docker secrets** for sensitive data

4. **Set up health monitoring** with the built-in health checks

5. **Configure logging** with Docker logging drivers

6. **Use Docker volumes** for persistent data if needed

## 🤝 Contributing

When contributing to this project, please:

1. **Follow the atomic design structure** - Place components in the correct directory
2. **Maintain TypeScript typing** - Add proper types for all props and functions
3. **Use Tailwind CSS** for styling - Avoid inline styles or CSS modules
4. **Write tests** - Add unit tests for components and E2E tests for workflows
5. **Keep components focused** - Single responsibility principle
6. **Document complex logic** - Add comments for non-obvious code
7. **Run tests before committing** - Ensure all tests pass
8. **Check coverage** - Maintain 70%+ coverage threshold

### Adding New Components

1. Create component file in appropriate directory (atoms/molecules/organisms)
2. Create corresponding test file in `__tests__` directory
3. Export component from directory index if needed
4. Add component to relevant page or parent component
5. Run tests: `npm test`
6. Check coverage: `npm run test:coverage`

## 📚 Documentation

All documentation is organized in the [`docs/`](docs/) directory:

### Testing Documentation
- **[Unit/Integration Testing Guide](docs/unit-testing.md)** - Complete guide for Jest and React Testing Library
  - Component testing at all levels (atoms, molecules, organisms, pages)
  - Custom test utilities and render functions
  - Mocking strategies for APIs and browser features
  - Coverage requirements and best practices

- **[E2E Testing Guide](docs/e2e-testing.md)** - Comprehensive Playwright testing documentation
  - Page Object Model architecture and patterns
  - **API mocking requirements** (critical for authentication tests)
  - Multi-browser and mobile testing
  - Debugging tools and techniques
  - Troubleshooting common issues

### General Documentation
- **[Documentation Index](docs/README.md)** - Complete documentation overview
- **Component Documentation** - JSDoc comments in component files
- **Type Definitions** - TypeScript interfaces and types throughout the codebase

### Quick Links
- [Testing Overview](#-testing) - Summary of testing approach
- [Getting Started](#-getting-started) - Installation and setup
- [Available Scripts](#-available-scripts) - All npm commands
- [Project Structure](#-project-structure) - Directory organization

For a complete list of available documentation, see the [**Documentation Index**](docs/README.md).

## 📄 License

[Add your license information here]

## 👥 Team

Tunga Pay Frontend Team

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
