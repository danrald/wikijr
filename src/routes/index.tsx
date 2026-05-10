import { createFileRoute } from '@tanstack/react-router'
import ShellLayout from '../components/ShellLayout'
import HomeContent from '../components/HomeContent'

export const Route = createFileRoute('/')({
  component: () => (
    <ShellLayout>
      <HomeContent />
    </ShellLayout>
  ),
})
