'use client'
import React, { useState } from 'react'
import { useField } from '@payloadcms/ui'
import { Eye, EyeOff } from 'lucide-react'

type Props = {
  path: string
  label?: string
  required?: boolean
}

const CustomPasswordField: React.FC<Props> = ({ path, label, required }) => {
  const { value, setValue } = useField<string>({ path })
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      {label && (
        <label
          htmlFor={path}
          style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#666'
          }}
        >
          {label} {required && <span style={{ color: '#ff5555' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          id={path}
          type={showPassword ? 'text' : 'password'}
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 40px 10px 15px',
            background: '#121212',
            border: '1px solid #333',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}

export default CustomPasswordField
