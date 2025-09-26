import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🎮</div>
          <Link to="/" className="text-xl font-bold text-blue-600">
            SonarQuest
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-blue-600"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-blue-600" }}
            inactiveProps={{ className: "text-gray-500" }}
          >
            Dashboard
          </Link>
          
          <Link 
            to="/leaderboard" 
            className="text-sm font-medium transition-colors hover:text-blue-600"
            activeProps={{ className: "text-blue-600" }}
            inactiveProps={{ className: "text-gray-500" }}
          >
            Leaderboard
          </Link>
          
          <Link 
            to="/projects" 
            className="text-sm font-medium transition-colors hover:text-blue-600"
            activeProps={{ className: "text-blue-600" }}
            inactiveProps={{ className: "text-gray-500" }}
          >
            Projects
          </Link>
          
          <Link 
            to="/achievements" 
            className="text-sm font-medium transition-colors hover:text-blue-600"
            activeProps={{ className: "text-blue-600" }}
            inactiveProps={{ className: "text-gray-500" }}
          >
            Achievements
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Connect SonarQube
          </Button>
        </div>
      </div>
    </header>
  )
}
