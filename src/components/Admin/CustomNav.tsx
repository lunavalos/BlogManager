"use client"
import React from 'react'
import { useAuth } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

const CustomNav: React.FC = () => {
  const { user } = useAuth()
  const pathname = usePathname()
  
  const isAdmin = user?.roles?.includes('admin')
  
  const navItems = [
    {
      label: 'Actividades',
      href: '/admin',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      label: 'Perfil',
      href: '/admin/collections/users',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      label: 'Media',
      href: '/admin/collections/media',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      label: 'Categorias',
      href: '/admin/collections/categories',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
    },
    {
      label: 'Posts',
      href: '/admin/collections/posts',
      icon: 'M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76'
    }
  ]

  return (
    <nav className="custom-nav" style={{ marginTop: '20px' }}>
      <div className="custom-nav-group-label" style={{ 
        paddingLeft: '15px', 
        marginBottom: '15px', 
        fontSize: '12px', 
        textTransform: 'uppercase', 
        letterSpacing: '1px', 
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: 'bold'
      }}>
        Gestión de Contenido
      </div>
      {navItems.map((item, i) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        // Special case for dashboard: only active on exact /admin
        const isDashboardActive = item.href === '/admin' ? pathname === '/admin' : isActive

        return (
          <a
            key={i}
            href={item.href}
            className={`nav__link custom-nav-link ${isDashboardActive ? 'nav__link--active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 15px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              marginBottom: '4px',
              color: isDashboardActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
              background: isDashboardActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style={{ width: '18px', height: '18px', marginRight: '12px' }} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span style={{ fontSize: '14px', fontWeight: isDashboardActive ? '600' : '500' }}>
              {item.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}

export default CustomNav
