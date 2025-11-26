"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, DollarSign, LayoutGrid, Phone, Users, ContactRound, Calculator } from "lucide-react"
import { SplitMethodSelector } from "../components/molecules/SplitMethodSelector"
import { useSTKPush } from "../hooks/usePayment"
import { useCurrentUser } from "../hooks/useUsers"
import type { Payment } from "../services"

export function CreateNewBillPage() {
  const navigate = useNavigate()
  const [billName, setBillName] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [description, setDescription] = useState("")
  const [splitMethod, setSplitMethod] = useState<"equal" | "percentage" | "custom">("equal")
  const [participants, setParticipants] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState("")
  const [currentUserPhone, setCurrentUserPhone] = useState<string>("")

  const { initiateSTKPush, loading: stkLoading, error: stkError } = useSTKPush()
  const { getCurrentUser, loading: userLoading } = useCurrentUser()

  // Fetch current user's phone number on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUserPhone(user.phone_number)
      } catch (error) {
        console.error("Failed to fetch current user:", error)
      }
    }
    fetchCurrentUser()
  }, [getCurrentUser])

  const handleAddParticipant = () => {
    if (phoneInput.trim()) {
      setParticipants([...participants, phoneInput])
      setPhoneInput("")
    }
  }

  /**
   * Normalize phone number to E.164 format (254XXXXXXXXX)
   */
  const normalizePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '')

    // Handle different formats
    if (cleaned.startsWith('254')) {
      return cleaned
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1)
    } else if (cleaned.length === 9) {
      return '254' + cleaned
    }

    return cleaned
  }

  /**
   * Calculate payment amounts based on split method
   */
  const calculatePayments = (): Payment[] => {
    const total = parseFloat(totalAmount)
    const allParticipants = [currentUserPhone, ...participants]

    switch (splitMethod) {
      case "equal": {
        const amountPerPerson = Math.round((total / allParticipants.length) * 100) / 100
        return allParticipants.map(phone => ({
          amount: amountPerPerson,
          phone_number: normalizePhoneNumber(phone)
        }))
      }
      case "percentage": {
        // For percentage split, divide equally for now
        // In a real app, you'd have UI to set percentages
        const amountPerPerson = Math.round((total / allParticipants.length) * 100) / 100
        return allParticipants.map(phone => ({
          amount: amountPerPerson,
          phone_number: normalizePhoneNumber(phone)
        }))
      }
      case "custom": {
        // For custom split, divide equally for now
        // In a real app, you'd have UI to set custom amounts
        const amountPerPerson = Math.round((total / allParticipants.length) * 100) / 100
        return allParticipants.map(phone => ({
          amount: amountPerPerson,
          phone_number: normalizePhoneNumber(phone)
        }))
      }
      default:
        return []
    }
  }

  const handleSendRequests = async () => {
    try {
      const payments = calculatePayments()

      await initiateSTKPush({
        payments,
        account_reference: billName || `Bill-${Date.now()}`,
        transaction_desc: description || `Payment for ${billName}`
      })

      // Navigate to home on success
      navigate("/home")
    } catch (error) {
      console.error("Failed to initiate STK Push:", error)
      // Error is already handled by the hook
    }
  }

  const isFormValid = billName.trim() && totalAmount && parseFloat(totalAmount) > 0 && participants.length > 0 && currentUserPhone

  return (
    <div className="app-shell bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/home")} className="p-1 hover:opacity-70 transition-opacity">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Create New Bill</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {/* Bill Details Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-gray-900" />
            <h2 className="font-semibold text-gray-900">Bill Details</h2>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600 leading-relaxed">
              You've already paid this bill. Add participants to request payment for their share.
            </p>
          </div>

          {/* Bill Name */}
          <div>
            <label htmlFor="bill-name" className="block text-sm font-medium text-gray-900 mb-2">Bill Name</label>
            <input
              id="bill-name"
              type="text"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              placeholder="e.g., Dinner at Restaurant"
              className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label htmlFor="total-amount" className="block text-sm font-medium text-gray-900 mb-2">Total Amount (KSH)</label>
            <input
              id="total-amount"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this bill for? (e.g., Lunch at Java House)"
              className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Split Method Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Calculator size={20} className="text-gray-900" />
            <h2 className="font-semibold text-gray-900">Split Method</h2>
          </div>

          <SplitMethodSelector
            selectedMethod={splitMethod}
            onMethodChange={setSplitMethod}
          />
        </div>

        {/* Participants Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Phone size={20} className="text-gray-900" />
            <h2 className="font-semibold text-gray-900">Participants ({participants.length})</h2>
          </div>

          <button className="w-full bg-blue-50 text-blue-600 py-3 px-4 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
            <ContactRound size={18} />
            Add from Contacts
          </button>

          {/* Manual Entry */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px bg-gray-300 flex-1" />
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">or enter manually</p>
              <div className="h-px bg-gray-300 flex-1" />
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="0712345678 or +254712345678"
                className="flex-1 bg-gray-50 border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddParticipant}
                className="bg-gray-900 text-white rounded-lg w-12 h-12 hover:bg-gray-800 transition-colors flex items-center justify-center text-xl font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Participants List */}
          {participants.length === 0 ? (
            <div className="py-10 text-center">
              <Users size={48} className="text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-gray-900 font-medium mb-1">No participants added yet</p>
              <p className="text-sm text-gray-500">Add from contacts or enter phone numbers manually</p>
            </div>
          ) : (
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                  <span className="text-foreground">{participant}</span>
                  <button
                    onClick={() => setParticipants(participants.filter((_, i) => i !== index))}
                    className="text-destructive hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {stkError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">
              {stkError.message || "Failed to initiate payment. Please try again."}
            </p>
          </div>
        )}

        <button
          onClick={handleSendRequests}
          disabled={!isFormValid || stkLoading || userLoading}
          className={`w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-colors shadow-sm ${
            isFormValid && !stkLoading && !userLoading
              ? "bg-emerald-400 hover:bg-emerald-500 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {stkLoading ? "Processing..." : "Send Payment Requests"}
        </button>
      </div>
    </div>
  )
}

export default CreateNewBillPage
