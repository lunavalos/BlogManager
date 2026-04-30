'use client'
import React from 'react'
import { useField, Button } from '@payloadcms/ui'

const PasswordToggleButton: React.FC = () => {
  // Access the 'security.changePassword' field state
  const { value, setValue } = useField<boolean>({ path: 'security.changePassword' })

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button
        buttonStyle="secondary"
        onClick={() => setValue(!value)}
        type="button"
      >
        {value ? 'Cancelar Cambio' : 'Cambiar Contraseña'}
      </Button>
    </div>
  )
}

export default PasswordToggleButton
