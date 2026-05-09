'use client'

import { useState } from 'react'
import { FridgeItem, CATEGORIES, getExpiryStatus, getDaysUntilExpiry } from '@/lib/types'

interface Props {
  item: FridgeItem
  onRemove: (id: string) => void
  onUpdate: (item: FridgeItem) => void
}

const statusStyles = {
  expired: 'bg-red-100 text-red-700 border-red-200',
  today: 'bg-orange-100 text-orange-700 border-orange-200',
  soon: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ok: 'bg-green-100 text-green-700 border-green-200',
}

const cardBorder = {
  expired: 'border-l-4 border-l-red-400',
  today: 'border-l-4 border-l-orange-400',
  soon: 'border-l-4 border-l-yellow-400',
  ok: 'border-l-4 border-l-green-400',
}

function expiryLabel(date: string): string {
  const days = getDaysUntilExpiry(date)
  if (days < 0) return `Expired ${Math.abs(days)}d ago`
  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires tomorrow'
  return `Expires in ${days}d`
}

export default function FridgeItemCard({ item, onRemove, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [qty, setQty] = useState(item.quantity)

  const status = getExpiryStatus(item.expiryDate)
  const cat = CATEGORIES.find((c) => c.value === item.category)

  function saveQty() {
    onUpdate({ ...item, quantity: qty })
    setEditing(false)
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 ${cardBorder[status]}`}>
      <span className="text-3xl flex-shrink-0">{cat?.emoji}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 truncate">{item.name}</p>
            <p className="text-sm text-gray-500">{cat?.label}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap ${statusStyles[status]}`}>
            {expiryLabel(item.expiryDate)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-3">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={qty}
                onChange={(e) => setQty(parseFloat(e.target.value))}
                className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <span className="text-sm text-gray-500">{item.unit}</span>
              <button onClick={saveQty} className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700">Save</button>
              <button onClick={() => { setEditing(false); setQty(item.quantity) }} className="text-xs text-gray-500 hover:text-gray-700">✕</button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item.quantity} {item.unit}
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors text-xl leading-none"
        title="Remove item"
      >
        🗑
      </button>
    </div>
  )
}
