import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { WelcomePage } from "./pages/WelcomePage"
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { PasswordResetPage } from "./pages/PasswordResetPage"
import { HomePage } from "./pages/HomePage"
import { ProfileSettingsPage } from "./pages/ProfileSettingsPage"
import { CreateNewBillPage } from "./pages/CreateNewBillPage"
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AdminDashboard } from "./pages/AdminDashboard"
import { VendorsPage } from "./pages/VendorsPage"
import { UserManagementPage } from "./pages/UserManagementPage"
import { AdminLoginPage } from "./pages/AdminLoginPage"
import { TransactionsManagementPage } from "./pages/TransactionsManagementPage"

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSettingsPage
                onBack={() => window.history.back()}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-bill"
          element={
            <ProtectedRoute>
              <CreateNewBillPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            <ProtectedRoute>
              <VendorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute>
              <TransactionsManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
