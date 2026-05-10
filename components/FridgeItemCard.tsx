'use client'

import { useState } from 'react'
import { FridgeItem, CATEGORIES, getExpiryStatus, getDaysUntilExpiry } from '@/lib/types'
import { Trash2, Pencil, Check, X } from 'lucide-react'

interface Props {
  item: FridgeItem
  onRemove: (id: string) => void
  onUpdate: (item: FridgeItem) => void
}

const statusConfig = {
  expired: {
    color: 'var(--status-expired)',
    bg: 'rgba(248,81,73,0.06)',
    border: 'rgba(248,81,73,0.22)',
    accent: 'var(--status-expired)',
  },
  today: {
    color: 'var(--status-today)',
    bg: 'rgba(219,109,40,0.06)',
    border: 'rgba(219,109,40,0.22)',
    accent: 'var(--status-today)',
  },
  soon: {
    color: 'var(--status-soon)',
    bg: 'rgba(210,153,34,0.06)',
    border: 'rgba(210,153,34,0.22)',
    accent: 'var(--status-soon)',
  },
  ok: {
    color: 'var(--status-ok)',
    bg: 'var(--surface)',
    border: 'var(--border)',
    accent: 'var(--status-ok)',
  },
}

function expiryLabel(date: string): string {
  const days = getDaysUntilExpiry(date)
  if (days < 0) return `${Math.abs(days)}d ago`
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  return `${days}d left`
}

export default function FridgeItemCard({ item, onRemove, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [qty, setQty] = useState(item.quantity)

  const status = getExpiryStatus(item.expiryDate)
  const cfg = statusConfig[status]
  const cat = CATEGORIES.find((c) => c.value === item.category)

  function saveQty() {
    onUpdate({ ...item, quantity: qty })
    setEditing(false)
  }

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: '12px',
        padding: '13px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '13px',
      }}
    >
      <span style={{ fontSize: '26px', flexShrink: 0, lineHeight: 1 }}>{cat?.emoji}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontSize: '15px',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: 'var(--font-sans)',
            }}>
              {item.name}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0', fontFamily: 'var(--font-sans)' }}>
              {cat?.label}
            </p>
          </div>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '99px',
            border: `1px solid ${cfg.border}`,
            color: cfg.color,
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}>
            {expiryLabel(item.expiryDate)}
          </span>
        </div>

        <div style={{ marginTop: '8px' }}>
          {editing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={qty}
                onChange={(e) => setQty(parseFloat(e.target.value))}
                autoFocus
                style={{
                  width: '62px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--accent)',
                  borderRadius: '6px',
                  padding: '3px 7px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {item.unit}
              </span>
              <button
                onClick={saveQty}
                style={{ color: 'var(--status-ok)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '2px' }}
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => { setEditing(false); setQty(item.quantity) }}
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-mono)',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <span>{item.quantity} {item.unit}</span>
              <Pencil size={10} />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        title="Remove"
        style={{
          flexShrink: 0,
          color: 'var(--text-muted)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '5px',
          borderRadius: '6px',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-expired)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
