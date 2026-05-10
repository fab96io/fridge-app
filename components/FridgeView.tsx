'use client'

import { useState, useEffect } from 'react'
import { FridgeItem, Category, CATEGORIES, getExpiryStatus } from '@/lib/types'
import { loadItems, addItem, removeItem, updateItem, clearItems } from '@/lib/storage'
import FridgeItemCard from './FridgeItemCard'
import AddItemForm from './AddItemForm'
import { Search, Plus, Trash2, Snowflake } from 'lucide-react'

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
  const [confirmClear, setConfirmClear] = useState(false)
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

  function handleClearAll() {
    setItems(clearItems())
    setConfirmClear(false)
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        background: 'rgba(13, 17, 23, 0.88)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <Snowflake size={20} color="var(--accent)" strokeWidth={1.5} />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '21px',
                color: 'var(--text-primary)',
                letterSpacing: '-0.3px',
              }}>
                My Fridge
              </span>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '99px',
                padding: '1px 7px',
                fontFamily: 'var(--font-mono)',
              }}>
                {items.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {items.length > 0 && (
                confirmClear ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Clear all?</span>
                    <button
                      onClick={handleClearAll}
                      style={{
                        fontSize: '12px',
                        color: 'var(--status-expired)',
                        background: 'rgba(248, 81, 73, 0.08)',
                        border: '1px solid rgba(248, 81, 73, 0.3)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Yes, clear
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    title="Clear all items"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '6px 11px',
                      cursor: 'pointer',
                      transition: 'color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--status-expired)'
                      e.currentTarget.style.borderColor = 'rgba(248, 81, 73, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Clear all</span>
                  </button>
                )
              )}

              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0d1117',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.82')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={15}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '10px 13px 10px 36px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        <div className="scrollbar-hide" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          {expiringCount > 0 && (
            <FilterChip
              label={`⚠️ Expiring (${expiringCount})`}
              active={filter === 'expiring'}
              onClick={() => setFilter('expiring')}
              warning
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

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '72px 0', color: 'var(--text-muted)' }}>
            <Snowflake
              size={44}
              color="var(--border)"
              strokeWidth={1}
              style={{ margin: '0 auto 16px', display: 'block' }}
            />
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
              fontStyle: 'italic',
            }}>
              {items.length === 0 ? 'Fridge is empty' : 'No items match'}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  color: 'var(--accent)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Add your first item
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
  warning,
}: {
  label: string
  active: boolean
  onClick: () => void
  warning?: boolean
}) {
  const activeStyle = warning
    ? { background: 'rgba(219,109,40,0.18)', color: 'var(--status-today)', borderColor: 'rgba(219,109,40,0.45)' }
    : { background: 'var(--accent)', color: '#0d1117', borderColor: 'var(--accent)' }

  const inactiveStyle = warning
    ? { background: 'rgba(219,109,40,0.05)', color: 'var(--status-today)', borderColor: 'rgba(219,109,40,0.18)' }
    : { background: 'var(--surface)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }

  return (
    <button
      onClick={onClick}
      style={{
        whiteSpace: 'nowrap',
        padding: '5px 12px',
        borderRadius: '99px',
        fontSize: '13px',
        fontWeight: '500',
        border: '1px solid',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s',
        fontFamily: 'var(--font-sans)',
        ...(active ? activeStyle : inactiveStyle),
      }}
    >
      {label}
    </button>
  )
}
