import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { WelcomePage } from "./pages/WelcomePage"
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { HomePage } from "./pages/HomePage"
import { ProfileSettingsPage } from "./pages/ProfileSettingsPage"
import { CreateNewBillPage } from "./pages/CreateNewBillPage"
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/profile"
          element={
            <ProfileSettingsPage
              onBack={() => window.history.back()}
              userName="test"
              userEmail="test@mail.com"
              phoneNumber="+254710670537"
              avatar="T"
            />
          }
        />
        <Route path="/create-bill" element={<CreateNewBillPage />} />
        <Route path="/transaction-history" element={<TransactionHistoryPage />} />
      </Routes>
    </Router>
  )
}
