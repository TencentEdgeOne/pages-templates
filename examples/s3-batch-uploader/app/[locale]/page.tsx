'use client'

import { useEffect } from 'react'
import { useRouter, redirect } from 'next/navigation'

export default function HomePage({ params }: { params: { locale: string } }) {
  const router = useRouter()
  redirect('/en/upload')
}