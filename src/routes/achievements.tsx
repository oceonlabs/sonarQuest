import { createFileRoute } from '@tanstack/react-router'
import { Achievements } from '../components/Achievements'

export const Route = createFileRoute('/achievements')({
  component: Achievements,
})