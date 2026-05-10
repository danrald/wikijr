import { createFileRoute } from '@tanstack/react-router'
import TeamContent from '../components/TeamContent'

export const Route = createFileRoute('/_shell/team')({
  component: TeamContent,
})
