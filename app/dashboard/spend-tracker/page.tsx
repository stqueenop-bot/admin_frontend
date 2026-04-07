import { Metadata } from 'next'
import SpendTrackerPage from './SpendTrackerPage'

export const metadata: Metadata = {
  title: 'Spend Tracker - Fastxera Admin',
  description: 'Track and manage your expenses',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return <SpendTrackerPage />
}
