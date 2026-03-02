'use client'

import { useState, useEffect } from 'react'
import { AuthDialog } from './AuthDialog'

export function AuthShell() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('openAuth', handler)
    return () => window.removeEventListener('openAuth', handler)
  }, [])

  return <AuthDialog open={open} onClose={() => setOpen(false)} />
}
