export type Category =
  | 'dairy'
  | 'meat'
  | 'veggies'
  | 'fruits'
  | 'drinks'
  | 'leftovers'
  | 'condiments'
  | 'other'

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'meat', label: 'Meat & Fish', emoji: '🥩' },
  { value: 'veggies', label: 'Veggies', emoji: '🥦' },
  { value: 'fruits', label: 'Fruits', emoji: '🍎' },
  { value: 'drinks', label: 'Drinks', emoji: '🧃' },
  { value: 'leftovers', label: 'Leftovers', emoji: '🍱' },
  { value: 'condiments', label: 'Condiments', emoji: '🫙' },
  { value: 'other', label: 'Other', emoji: '📦' },
]

export interface FridgeItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: Category
  expiryDate: string // YYYY-MM-DD
  addedAt: string   // ISO timestamp
}

export type ExpiryStatus = 'expired' | 'today' | 'soon' | 'ok'

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const diffDays = Math.round((expiry.getTime() - today.getTime()) / 86400000)

  if (diffDays < 0) return 'expired'
  if (diffDays === 0) return 'today'
  if (diffDays <= 3) return 'soon'
  return 'ok'
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  return Math.round((expiry.getTime() - today.getTime()) / 86400000)
}
