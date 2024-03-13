import React from 'react'
import Image from 'next/image'
import { TechWeUse } from '@/components/TechWeUse'
import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'

export function TechCaller(): React.ReactElement {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        priority={true}
        unoptimized
      />
      <Container className="relative flex items-center justify-center">
        <TechWeUse />
      </Container>
    </section>
  )
}
