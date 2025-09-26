import { createFileRoute } from '@tanstack/react-router'
import { Leaderboard } from '../components/Leaderboard'

export const Route = createFileRoute('/leaderboard')({
  component: Leaderboard,
})