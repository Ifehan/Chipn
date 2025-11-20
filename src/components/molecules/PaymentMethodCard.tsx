import { Phone } from 'lucide-react'

interface PaymentMethodCardProps {
  name: string
  phoneNumber: string
  status: 'Active' | 'Inactive'
}

export function PaymentMethodCard({ name, phoneNumber, status }: PaymentMethodCardProps) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Phone size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 text-sm">{name}</p>
        <p className="text-xs text-slate-600">{phoneNumber}</p>
      </div>
      <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex-shrink-0">
        {status}
      </span>
    </div>
  )
}

export default PaymentMethodCard
