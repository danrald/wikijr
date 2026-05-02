import { createFileRoute } from '@tanstack/react-router'
import ShellLayout from '../components/ShellLayout'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <ShellLayout>
      <p>Main content goes here.</p>
    </ShellLayout>
  )
}
