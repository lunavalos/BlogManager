"use client"
import React from 'react'

const DashboardLink: React.FC = () => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <a 
        href="/admin" 
        className="nav__link dashboard-custom-link"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 15px 10px 45px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          backgroundColor: '#000',
          color: '#fff',
          textDecoration: 'none',
          marginBottom: '10px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '15px center',
          backgroundSize: '20px',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%23ffffff"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>')`
        }}
      >
        Actividades
      </a>
    </div>
  )
}

export default DashboardLink
