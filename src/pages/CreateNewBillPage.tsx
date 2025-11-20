"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, DollarSign, LayoutGrid, Phone, Users, ContactRound, Calculator } from "lucide-react"
import { SplitMethodSelector } from "../components/molecules/SplitMethodSelector"

export function CreateNewBillPage() {
  const navigate = useNavigate()
  const [totalAmount, setTotalAmount] = useState("")
  const [description, setDescription] = useState("")
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal")
  const [participants, setParticipants] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState("")

  const handleAddParticipant = () => {
    if (phoneInput.trim()) {
      setParticipants([...participants, phoneInput])
      setPhoneInput("")
    }
  }

  const handleSendRequests = () => {
    console.log("[v0] Bill details:", { totalAmount, description, splitMethod, participants })
    navigate("/home")
  }

  const isFormValid = totalAmount && parseFloat(totalAmount) > 0 && description.trim() && participants.length > 0

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

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Total Amount (KSH)</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <input
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

        <button
          onClick={handleSendRequests}
          disabled={!isFormValid}
          className={`w-full bg-emerald-400 hover:bg-emerald-500 text-white py-3.5 px-4 rounded-xl font-semibold text-base transition-colors shadow-sm ${
            isFormValid
              ? "bg-emerald-400 hover:bg-emerald-500 text-white cursor-pointer"
              : "bg-emerald-400 text-gray-500 cursor-not-allowed"
          }`}
        >
          Send Payment Requests
        </button>
      </div>
    </div>
  )
}

export default CreateNewBillPage
