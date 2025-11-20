# Tunga Pay

A modern bill splitting and payment management application built with React, TypeScript, and Tailwind CSS. Tunga Pay helps users manage shared expenses, split bills with groups, and track transaction history.

## 🚀 Features

- **Authentication System**
  - User login and signup
  - Welcome page with onboarding

- **Dashboard**
  - Real-time statistics display
  - Quick action buttons for common tasks
  - Recent bills overview
  - Tab navigation between Bills and Groups

- **Bill Management**
  - Create new bills with multiple split methods
  - View recent bills and transactions
  - Transaction history tracking
  - Empty state handling

- **Groups**
  - Manage payment groups
  - Group-based bill splitting

- **Profile Settings**
  - User account management
  - Payment method configuration
  - Support and help center
  - Logout functionality

## 🛠️ Tech Stack

- **Framework:** React 18.2 with TypeScript
- **Build Tool:** Vite 5.0
- **Routing:** React Router DOM 7.9
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Form Handling:** React Hook Form + Zod validation
- **Date Handling:** date-fns
- **Charts:** Recharts
- **Animations:** Tailwind CSS Animate

## 📁 Project Structure

```
tunga-pay/
├── src/
│   ├── components/
│   │   ├── atoms/           # Basic building blocks
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── ...
│   │   ├── molecules/       # Composed components
│   │   │   ├── Header.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── TabsContainer.tsx
│   │   │   └── ...
│   │   └── organisms/       # Complex sections
│   │       ├── AuthCard.tsx
│   │       ├── GroupsContent.tsx
│   │       ├── RecentBillsSection.tsx
│   │       └── ...
│   ├── pages/              # Page-level components
│   │   ├── WelcomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── CreateNewBillPage.tsx
│   │   ├── ProfileSettingsPage.tsx
│   │   └── TransactionHistoryPage.tsx
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.cjs
└── postcss.config.cjs
```

## 🏗️ Component Architecture

The project follows **Atomic Design principles**:

- **Atoms** (`src/components/atoms/`)
  Smallest, reusable UI elements like buttons, inputs, cards, and avatars.

- **Molecules** (`src/components/molecules/`)
  Combinations of atoms that form functional UI components like forms, headers, and action containers.

- **Organisms** (`src/components/organisms/`)
  Complex UI sections composed of molecules and atoms, such as authentication cards, bills sections, and settings panels.

- **Pages** (`src/pages/`)
  Full page components that combine organisms, molecules, and atoms to create complete views.

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

- `npm run dev` - Start development server with hot reload
- `npm run type-check` - Run TypeScript type checking
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎨 Styling

The project uses **Tailwind CSS** for styling with custom configurations:

- Configuration: `tailwind.config.cjs`
- PostCSS setup: `postcss.config.cjs`
- Custom animations via `tailwindcss-animate`
- Utility classes with `tailwind-merge` and `clsx`
- Dark mode support via `next-themes`

## 🔧 Configuration Files

- **vite.config.ts** - Vite build configuration
- **tsconfig.json** - TypeScript compiler options
- **tailwind.config.cjs** - Tailwind CSS customization
- **postcss.config.cjs** - PostCSS plugins configuration

## 📝 Development Notes

- The application currently uses mock/placeholder data for demonstration
- Authentication logic needs to be integrated with a real backend API
- Profile data is hardcoded and should be connected to user state management
- Bill splitting calculations and group management require backend integration

## 🔐 Environment Setup

For production deployment, ensure to:
1. Configure environment variables for API endpoints
2. Set up proper authentication middleware
3. Implement secure session management
4. Connect to a database for data persistence

## 🤝 Contributing

When contributing to this project, please:
1. Follow the atomic design structure
2. Maintain TypeScript typing
3. Use Tailwind CSS for styling
4. Write reusable components
5. Keep components focused and single-purpose

## 📄 License

[Add your license information here]

## 👥 Team

Tunga Pay Frontend Team

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
