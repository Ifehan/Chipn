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
import { AdminRoute } from "./components/AdminRoute"
import { AdminDashboard } from "./pages/AdminDashboard"
import { VendorsPage } from "./pages/VendorsPage"
import { UserManagementPage } from "./pages/UserManagementPage"
import { AdminLoginPage } from "./pages/AdminLoginPage"
import { TransactionsManagementPage } from "./pages/TransactionsManagementPage"
import { NotFoundPage } from "./pages/NotFoundPage"

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
        <Route path="/password-reset/confirm" element={<PasswordResetPage />} />
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
              <ProfileSettingsPage />
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
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            <AdminRoute>
              <VendorsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <AdminRoute>
              <TransactionsManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagementPage />
            </AdminRoute>
          }
        />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
