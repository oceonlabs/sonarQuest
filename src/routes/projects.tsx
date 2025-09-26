import { createFileRoute } from '@tanstack/react-router'
import { Projects } from '../components/Projects'

export const Route = createFileRoute('/projects')({
  component: Projects,
})