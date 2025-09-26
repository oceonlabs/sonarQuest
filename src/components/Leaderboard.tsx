import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { mockDevelopers, mockTeams } from '../lib/mockData'

export function Leaderboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-500">
            Top performers in code quality improvement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Individual Developer Rankings */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Individual Rankings</h2>
            <div className="space-y-4">
              {mockDevelopers.map((developer, index) => (
                <Card key={developer.id} className="relative overflow-hidden">
                  {/* Rank indicator */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                  }`} />
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                        }`}>
                          #{developer.rank}
                        </div>
                        <div className="text-4xl">{developer.avatar}</div>
                        <div>
                          <CardTitle className="text-xl">{developer.name}</CardTitle>
                          <CardDescription>{developer.email}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {developer.score.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {developer.stats.bugsFixed}
                        </div>
                        <div className="text-xs text-gray-500">Bugs Fixed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">
                          {developer.stats.vulnerabilitiesFixed}
                        </div>
                        <div className="text-xs text-gray-500">Vulnerabilities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-600">
                          {developer.stats.codeSmellsFixed}
                        </div>
                        <div className="text-xs text-gray-500">Code Smells</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {developer.stats.coverageImprovement.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Coverage +</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {developer.stats.totalCommits}
                        </div>
                        <div className="text-xs text-gray-500">Commits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-indigo-600">
                          {developer.achievements.length}
                        </div>
                        <div className="text-xs text-gray-500">Achievements</div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm text-gray-500">Recent Achievements</h4>
                      <div className="flex flex-wrap gap-2">
                        {developer.achievements.map((achievement) => (
                          <Badge key={achievement.id} variant="secondary" className="text-xs">
                            {achievement.icon} {achievement.name}
                          </Badge>
                        ))}
                        {developer.achievements.length === 0 && (
                          <div className="text-sm text-gray-500">No achievements yet</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Rankings */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Team Rankings</h2>
            <div className="space-y-4">
              {mockTeams.map((team, index) => (
                <Card key={team.id} className="relative overflow-hidden">
                  {/* Rank indicator */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    index === 0 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg ${
                          index === 0 ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          #{team.rank}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{team.name}</CardTitle>
                          <CardDescription>
                            {team.members.length} members • {team.projects.length} projects
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {team.totalScore.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">total points</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Team Members */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm text-gray-500">Team Members</h4>
                      <div className="space-y-2">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 bg-gray-100/30 rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="text-lg">{member.avatar}</div>
                              <div>
                                <div className="font-medium text-sm">{member.name}</div>
                                <div className="text-xs text-gray-500">
                                  {member.achievements.length} achievements
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-blue-600">
                                {member.score.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">points</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-sm text-gray-500">Projects</h4>
                      <div className="flex flex-wrap gap-2">
                        {team.projects.map((project) => (
                          <Badge key={project.id} variant="outline" className="text-xs">
                            {project.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Monthly Challenge */}
            <Card className="mt-6 border-2 border-dashed border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏆 Monthly Challenge
                </CardTitle>
                <CardDescription>
                  Fix 50 issues to win the monthly challenge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>32/50 issues</span>
                    </div>
                    <Progress value={64} className="h-3" />
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="text-sm">
                      🎯 18 issues remaining
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}