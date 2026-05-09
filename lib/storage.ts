import { FridgeItem } from './types'

const KEY = 'fridge-items'

export function loadItems(): FridgeItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveItems(items: FridgeItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function addItem(items: FridgeItem[], item: FridgeItem): FridgeItem[] {
  const next = [item, ...items]
  saveItems(next)
  return next
}

export function removeItem(items: FridgeItem[], id: string): FridgeItem[] {
  const next = items.filter((i) => i.id !== id)
  saveItems(next)
  return next
}

export function updateItem(items: FridgeItem[], updated: FridgeItem): FridgeItem[] {
  const next = items.map((i) => (i.id === updated.id ? updated : i))
  saveItems(next)
  return next
}
