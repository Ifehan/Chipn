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
  - View recent bills and transactions
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
- **Testing Framework:** Jest 30.2
- **Testing Library:** React Testing Library 16.3
- **Test Utilities:** @testing-library/user-event 14.6, @testing-library/jest-dom 6.9
- **Coverage:** 70% threshold for branches, functions, lines, and statements

### Development Tools
- **TypeScript:** 5.5 with strict type checking
- **PostCSS:** 8.5 with Tailwind CSS
- **Analytics:** Vercel Analytics 1.3

## 📁 Project Structure

```
tunga-pay/
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
├── README.md                   # This file
└── TESTING.md                  # Comprehensive testing documentation
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
| `/transaction-history` | TransactionHistoryPage | View all transactions |

## 🎯 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

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

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run type-check` - Run TypeScript type checking
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:ui` - Run tests with verbose output

See [`TESTING.md`](TESTING.md) for comprehensive testing documentation.

## 🧪 Testing

The project has comprehensive test coverage with **33 test files** covering all component levels:

- **8 Atom tests** - Unit tests for basic components
- **11 Molecule tests** - Tests for composed components
- **7 Organism tests** - Integration tests for complex sections
- **7 Page tests** - Full page integration tests

**Testing Stack:**
- Jest 30.2 with jsdom environment
- React Testing Library 16.3
- User Event 14.6 for interaction simulation
- 70% coverage threshold

**Key Testing Features:**
- Co-located tests in `__tests__` directories
- Custom render utilities with router support
- Mocked browser APIs (matchMedia, IntersectionObserver, ResizeObserver)
- Comprehensive test patterns and best practices

For detailed testing guidelines, see [`TESTING.md`](TESTING.md).

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

## 📊 Code Quality

### TypeScript
- Strict type checking enabled
- Path aliases configured (`@/` → `src/`)
- Comprehensive type definitions
- No implicit any

### Testing Coverage
- 70% minimum coverage threshold
- Unit tests for all atoms and molecules
- Integration tests for organisms and pages
- User interaction testing with userEvent

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

## 🔐 Environment Setup

For production deployment, ensure to:

1. **Configure environment variables** for API endpoints
2. **Set up authentication** middleware and JWT handling
3. **Implement secure session** management
4. **Connect to database** for data persistence
5. **Enable HTTPS** for secure communication
6. **Set up monitoring** and error tracking
7. **Configure CDN** for static assets

## 🤝 Contributing

When contributing to this project, please:

1. **Follow the atomic design structure** - Place components in the correct directory
2. **Maintain TypeScript typing** - Add proper types for all props and functions
3. **Use Tailwind CSS** for styling - Avoid inline styles or CSS modules
4. **Write tests** - Add tests for new components (see [`TESTING.md`](TESTING.md))
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

- **[`README.md`](README.md)** - This file, project overview
- **[`TESTING.md`](TESTING.md)** - Comprehensive testing documentation
- **Component Documentation** - JSDoc comments in component files
- **Type Definitions** - TypeScript interfaces and types

## 📄 License

[Add your license information here]

## 👥 Team

Tunga Pay Frontend Team

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
