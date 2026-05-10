'use client'

import { useState } from 'react'
import { Category, CATEGORIES, FridgeItem } from '@/lib/types'
import { X, PackagePlus } from 'lucide-react'

interface Props {
  onAdd: (item: FridgeItem) => void
  onClose: () => void
}

const UNITS = ['pcs', 'g', 'kg', 'ml', 'L', 'pack', 'bottle', 'box']

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '9px 12px',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelBase: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '500',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  fontFamily: 'var(--font-sans)',
}

export default function AddItemForm({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('pcs')
  const [category, setCategory] = useState<Category>('other')
  const [expiryDate, setExpiryDate] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !expiryDate) return
    const item: FridgeItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      quantity,
      unit,
      category,
      expiryDate,
      addedAt: new Date().toISOString(),
    }
    onAdd(item)
    onClose()
  }

  function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = 'var(--accent)'
  }
  function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = 'var(--border)'
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PackagePlus size={17} color="var(--accent)" strokeWidth={1.75} />
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              color: 'var(--text-primary)',
              margin: 0,
              fontStyle: 'italic',
            }}>
              Add Item
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
              borderRadius: '6px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelBase}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Milk, Cheese..."
              required
              style={inputBase}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelBase}>Quantity</label>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                style={{ ...inputBase, fontFamily: 'var(--font-mono)' }}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>
            <div>
              <label style={labelBase}>Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{ ...inputBase, cursor: 'pointer' }}
                onFocus={focusBorder}
                onBlur={blurBorder}
              >
                {UNITS.map((u) => <option key={u} value={u} style={{ background: 'var(--surface-2)' }}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelBase}>Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '9px 4px',
                    borderRadius: '8px',
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'var(--font-sans)',
                    ...(category === cat.value
                      ? {
                          background: 'rgba(88,166,255,0.1)',
                          borderColor: 'var(--accent)',
                          color: 'var(--accent)',
                        }
                      : {
                          background: 'var(--surface-2)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-muted)',
                        }
                    ),
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                  <span style={{ fontSize: '10px', marginTop: '4px', textAlign: 'center', lineHeight: 1.2 }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelBase}>Expiry Date *</label>
            <input
              type="date"
              value={expiryDate}
              min={todayStr()}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              style={{ ...inputBase, colorScheme: 'dark', fontFamily: 'var(--font-mono)' }}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent)',
                color: '#0d1117',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.82')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Add to Fridge
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
