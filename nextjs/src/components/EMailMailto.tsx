'use client'
import React, { ReactNode, useState } from 'react'

interface EMailMailtoProps {
  children: ReactNode
}

export function EMailMailto({ children }: EMailMailtoProps) {
  const [href, setHref] = useState('mailto:thorsten@schminkel@@de')

  const handleMouseOver = () => {
    setHref(href.replace('@@', '.'))
  }

  return (
    <a
      id={'email'}
      className="font-bold underline hover:text-blue-600"
      href={href}
      onMouseOver={handleMouseOver}
    >
      {children}
    </a>
  )
}
