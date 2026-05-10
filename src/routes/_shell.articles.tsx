import { createFileRoute } from '@tanstack/react-router'
import ArticlesContent from '../components/ArticlesContent'

export const Route = createFileRoute('/_shell/articles')({
  component: ArticlesContent,
})
