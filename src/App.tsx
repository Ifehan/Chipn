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

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
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
          path="/transaction-history"
          element={
            <ProtectedRoute>
              <TransactionHistoryPage />
            </ProtectedRoute>
          }
        />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
