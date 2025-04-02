import { DemoSection } from '../components/demo-section'
import Playground from '../components/playground'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  description:
    'Starter kit for Cyberdesk',
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full gap-6 justify-center items-center">
      <Playground />
    </div>
  )
}
