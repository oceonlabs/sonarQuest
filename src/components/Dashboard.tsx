import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { mockProjects, mockDevelopers, mockTeams, getRatingColor, getRatingLabel, getQualityGateColor } from '../lib/mockData'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SonarQuest Dashboard</h1>
          <p className="text-gray-500">
            Gamify your code quality journey with SonarQube integration
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{mockProjects.length}</div>
              <p className="text-sm text-gray-500 mt-1">Active projects being monitored</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Developers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{mockDevelopers.length}</div>
              <p className="text-sm text-gray-500 mt-1">Contributing to code quality</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{mockTeams.length}</div>
              <p className="text-sm text-gray-500 mt-1">Competing in the challenge</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Overview */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={project.qualityGateStatus === 'OK' ? 'success' : project.qualityGateStatus === 'WARN' ? 'warning' : 'destructive'}>
                        {project.qualityGateStatus}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Coverage</span>
                          <span className="text-sm">{project.metrics.coverage.toFixed(1)}%</span>
                        </div>
                        <Progress value={project.metrics.coverage} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Ratings</span>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getRatingColor(project.metrics.reliability_rating)}>
                            R: {getRatingLabel(project.metrics.reliability_rating)}
                          </Badge>
                          <Badge variant="outline" className={getRatingColor(project.metrics.security_rating)}>
                            S: {getRatingLabel(project.metrics.security_rating)}
                          </Badge>
                          <Badge variant="outline" className={getRatingColor(project.metrics.sqale_rating)}>
                            M: {getRatingLabel(project.metrics.sqale_rating)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-red-600">{project.metrics.bugs}</div>
                        <div className="text-gray-500">Bugs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-orange-600">{project.metrics.vulnerabilities}</div>
                        <div className="text-gray-500">Vulnerabilities</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-yellow-600">{project.metrics.code_smells}</div>
                        <div className="text-gray-500">Code Smells</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Developer Leaderboard */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Developer Leaderboard</h2>
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>Based on code quality improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDevelopers.map((developer, index) => (
                    <div key={developer.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-100/50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-blue-600-foreground font-bold text-sm">
                        #{developer.rank}
                      </div>
                      <div className="text-2xl">{developer.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{developer.name}</div>
                        <div className="text-sm text-gray-500">
                          {developer.stats.issuesFixed} issues fixed • {developer.achievements.length} achievements
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-blue-600">{developer.score.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Rankings */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Team Rankings</h3>
              <div className="space-y-3">
                {mockTeams.map((team) => (
                  <Card key={team.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <Badge variant="outline">#{team.rank}</Badge>
                            {team.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {team.members.length} members • {team.projects.length} projects
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-blue-600">
                            {team.totalScore.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">points</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDevelopers.flatMap(dev => dev.achievements).slice(0, 8).map((achievement) => (
              <Card key={achievement.id} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {achievement.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}