import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'
import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s - Wissen blitzschnell abrufbar.',
    default: 'Wissen blitzschnell abrufbar.',
  },
  description: 'Dein KI-Assistent: Wissen blitzschnell abrufbar.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/png"
          sizes="32x32"
        />
        <title></title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        {/*<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>*/}
        {/*<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>*/}
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#124dcd"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="flex h-full flex-col">{children}</body>
    </html>
  )
}
