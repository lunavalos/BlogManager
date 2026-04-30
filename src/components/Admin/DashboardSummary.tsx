'use client'
import React, { useEffect, useState } from 'react'

const DashboardSummary: React.FC = () => {
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/posts?limit=5&sort=-createdAt&depth=1')
        const data = await response.json()
        setStats(data.docs || [])
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div style={{ padding: '0', marginBottom: '40px', color: 'var(--theme-elevation-800)' }}>
      <h2 style={{ marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>Resumen de Actividad</h2>
      <p style={{ color: 'var(--theme-elevation-450)', marginBottom: '20px', fontSize: '14px' }}>Aquí puedes ver las últimas publicaciones y quién las creó.</p>

        {loading ? (
          <p>Cargando actividad...</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {stats.map((post: any) => (
              <div 
                key={post.id} 
                style={{ 
                  padding: '15px 20px', 
                  background: 'var(--theme-elevation-100)', 
                  border: '1px solid var(--theme-elevation-150)', 
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{post.title}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginTop: '4px' }}>
                    Creado por: <span style={{ color: 'var(--theme-elevation-800)', fontWeight: '500' }}>{post.author?.username || post.author?.email || 'Sistema'}</span> | {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 12px', 
                  borderRadius: '6px', 
                  fontSize: '11px', 
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: post._status === 'published' ? 'rgba(0, 204, 68, 0.1)' : 'rgba(255, 170, 0, 0.1)',
                  color: post._status === 'published' ? '#00cc44' : '#ffaa00',
                  border: `1px solid ${post._status === 'published' ? 'rgba(0, 204, 68, 0.2)' : 'rgba(255, 170, 0, 0.2)'}`
                }}>
                  {post._status === 'published' ? 'Publicado' : 'Borrador'}
                </div>
              </div>
            ))}
            {stats.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', background: 'var(--theme-elevation-50)', borderRadius: '8px', border: '1px dashed var(--theme-elevation-200)' }}>
                <p style={{ color: 'var(--theme-elevation-400)' }}>No hay publicaciones recientes para mostrar.</p>
              </div>
            )}
          </div>
        )}
    </div>
  )
}

export default DashboardSummary
