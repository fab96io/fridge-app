'use client'

import { useState, useEffect } from 'react'
import { FridgeItem, Category, CATEGORIES, getExpiryStatus } from '@/lib/types'
import { loadItems, addItem, removeItem, updateItem } from '@/lib/storage'
import FridgeItemCard from './FridgeItemCard'
import AddItemForm from './AddItemForm'

type Filter = 'all' | Category | 'expiring'

function sortItems(items: FridgeItem[]): FridgeItem[] {
  const order = { expired: 0, today: 1, soon: 2, ok: 3 }
  return [...items].sort((a, b) => {
    const diff = order[getExpiryStatus(a.expiryDate)] - order[getExpiryStatus(b.expiryDate)]
    if (diff !== 0) return diff
    return a.name.localeCompare(b.name)
  })
}

export default function FridgeView() {
  const [items, setItems] = useState<FridgeItem[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(loadItems())
    setMounted(true)
  }, [])

  function handleAdd(item: FridgeItem) {
    setItems((prev) => addItem(prev, item))
  }

  function handleRemove(id: string) {
    setItems((prev) => removeItem(prev, id))
  }

  function handleUpdate(updated: FridgeItem) {
    setItems((prev) => updateItem(prev, updated))
  }

  const filtered = sortItems(items).filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (filter === 'all') return true
    if (filter === 'expiring') {
      const s = getExpiryStatus(item.expiryDate)
      return s === 'expired' || s === 'today' || s === 'soon'
    }
    return item.category === filter
  })

  const expiringCount = items.filter((i) => {
    const s = getExpiryStatus(i.expiryDate)
    return s === 'expired' || s === 'today' || s === 'soon'
  }).length

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧊</span>
            <h1 className="text-xl font-bold text-gray-900">My Fridge</h1>
            <span className="text-sm text-gray-500 ml-1">({items.length})</span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <span className="text-lg leading-none">+</span> Add
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          {expiringCount > 0 && (
            <FilterChip
              label={`⚠️ Expiring (${expiringCount})`}
              active={filter === 'expiring'}
              onClick={() => setFilter('expiring')}
              highlight
            />
          )}
          {CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat.value).length
            if (count === 0) return null
            return (
              <FilterChip
                key={cat.value}
                label={`${cat.emoji} ${cat.label}`}
                active={filter === cat.value}
                onClick={() => setFilter(cat.value)}
              />
            )
          })}
        </div>

        {/* Items */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🧊</div>
            <p className="font-medium">{items.length === 0 ? 'Fridge is empty' : 'No items match'}</p>
            {items.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-blue-600 hover:underline text-sm"
              >
                Add your first item
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <FridgeItemCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && <AddItemForm onAdd={handleAdd} onClose={() => setShowForm(false)} />}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
  highlight,
}: {
  label: string
  active: boolean
  onClick: () => void
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex-shrink-0 ${
        active
          ? highlight
            ? 'bg-orange-500 text-white border-orange-500'
            : 'bg-blue-600 text-white border-blue-600'
          : highlight
          ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}
