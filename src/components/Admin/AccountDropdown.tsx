'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { ChevronUp, User, LogOut } from 'lucide-react'

const AccountDropdown: React.FC = () => {
  const { user, logOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsOpen(false)
    await logOut()
    window.location.href = '/admin/login'
  }

  const goToProfile = () => {
    router.push(`/admin/account`)
    setIsOpen(false)
  }

  if (!user) return null

  return (
    <div
      ref={dropdownRef}
      style={{ 
        position: 'absolute', 
        bottom: '0',
        left: '0',
        padding: '20px', 
        width: '100%',
        boxSizing: 'border-box',
        borderTop: '1px solid var(--theme-elevation-150)',
        backgroundColor: 'var(--theme-elevation-50)',
        color: 'var(--theme-elevation-800)'
      }}
    >
      {/* Dropdown menu (OPENS UPWARDS) */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% - 10px)',
            left: '20px',
            right: '20px',
            background: 'var(--theme-elevation-100)',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '8px',
            boxShadow: '0 -8px 24px rgba(0,0,0,0.2)',
            zIndex: 99999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '10px 16px',
              fontSize: '11px',
              color: 'var(--theme-elevation-400)',
              borderBottom: '1px solid var(--theme-elevation-150)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.email}
          </div>

          <MenuRow
            icon={<User size={14} />}
            label="Mi Perfil"
            onClick={goToProfile}
          />

          <MenuRow
            icon={<LogOut size={14} />}
            label="Cerrar Sesión"
            onClick={handleLogout}
            danger
          />
        </div>
      )}

      {/* Trigger: Rectangular button like the reference */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 15px',
          background: 'var(--theme-elevation-150)',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: 'inherit',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'var(--theme-elevation-200)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'var(--theme-elevation-150)'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: 'var(--theme-elevation-800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--theme-elevation-0)',
          fontSize: '14px',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
        </div>
        
        <div style={{ 
          flex: 1, 
          textAlign: 'left',
          overflow: 'hidden'
        }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {user.username || 'Usuario'}
          </div>
        </div>

        <ChevronUp 
          size={16} 
          style={{ 
            color: 'var(--theme-elevation-400)',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease'
          }} 
        />
      </button>
    </div>
  )
}

const MenuRow: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void,
  danger?: boolean 
}> = ({ icon, label, onClick, danger }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: danger ? '#ff4d4d' : 'var(--theme-elevation-800)',
        fontSize: '13px',
        transition: 'background 0.2s ease',
        textAlign: 'left'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'var(--theme-elevation-50)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <span style={{ display: 'flex', color: danger ? 'inherit' : 'var(--theme-elevation-400)' }}>
        {icon}
      </span>
      {label}
    </button>
  )
}

export default AccountDropdown
