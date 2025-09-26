import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { mockDevelopers, mockAchievements } from '../lib/mockData'

export function Achievements() {
  // Get all achievements and their earn counts
  const allAchievements = mockAchievements.map(achievement => {
    const earnedCount = mockDevelopers.filter(dev => 
      dev.achievements.some(a => a.id === achievement.id)
    ).length
    return { ...achievement, earnedCount, totalDevelopers: mockDevelopers.length }
  })

  // Get recently earned achievements
  const recentAchievements = mockDevelopers
    .flatMap(dev => 
      dev.achievements.map(achievement => ({
        ...achievement,
        developerName: dev.name,
        developerAvatar: dev.avatar
      }))
    )
    .sort((a, b) => new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime())
    .slice(0, 6)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reliability': return 'bg-green-500 text-white'
      case 'security': return 'bg-red-500 text-white'
      case 'maintainability': return 'bg-blue-500 text-white'
      case 'coverage': return 'bg-purple-500 text-white'
      case 'general': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reliability': return '🔧'
      case 'security': return '🛡️'
      case 'maintainability': return '🧹'
      case 'coverage': return '📊'
      case 'general': return '⭐'
      default: return '🏆'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-500">
            Unlock badges and rewards for improving code quality
          </p>
        </div>

        {/* Achievement Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {['reliability', 'security', 'maintainability', 'coverage', 'general'].map(category => {
            const categoryAchievements = allAchievements.filter(a => a.category === category)
            const totalEarned = categoryAchievements.reduce((sum, a) => sum + a.earnedCount, 0)
            const totalPossible = categoryAchievements.length * mockDevelopers.length
            
            return (
              <Card key={category} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
                  <div className="font-semibold capitalize">{category}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {totalEarned}/{totalPossible} earned
                  </div>
                  <Progress 
                    value={(totalEarned / totalPossible) * 100} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* All Achievements */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">All Achievements</h2>
            <div className="space-y-4">
              {allAchievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{achievement.name}</h3>
                            <p className="text-sm text-gray-500">
                              {achievement.description}
                            </p>
                          </div>
                          <Badge 
                            className={getCategoryColor(achievement.category)}
                            variant="secondary"
                          >
                            {achievement.category}
                          </Badge>
                        </div>
                        
                        {/* Progress and stats */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Earned by developers</span>
                            <span>{achievement.earnedCount}/{achievement.totalDevelopers}</span>
                          </div>
                          <Progress 
                            value={(achievement.earnedCount / achievement.totalDevelopers) * 100} 
                            className="h-2"
                          />
                        </div>

                        {/* Rarity */}
                        <div className="mt-3">
                          {achievement.earnedCount === 0 && (
                            <Badge variant="outline" className="text-xs">
                              🔒 Unclaimed
                            </Badge>
                          )}
                          {achievement.earnedCount === 1 && (
                            <Badge variant="outline" className="text-xs text-purple-600">
                              💎 Legendary
                            </Badge>
                          )}
                          {achievement.earnedCount > 1 && achievement.earnedCount <= mockDevelopers.length * 0.25 && (
                            <Badge variant="outline" className="text-xs text-blue-600">
                              💠 Rare
                            </Badge>
                          )}
                          {achievement.earnedCount > mockDevelopers.length * 0.25 && achievement.earnedCount <= mockDevelopers.length * 0.75 && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              🟢 Common
                            </Badge>
                          )}
                          {achievement.earnedCount > mockDevelopers.length * 0.75 && (
                            <Badge variant="outline" className="text-xs text-gray-600">
                              ⚪ Basic
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Achievements & Progress */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Recent Achievements</h2>
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <Card key={`${achievement.id}-${achievement.developerName}-${index}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{achievement.developerAvatar}</span>
                            <span className="font-semibold">{achievement.developerName}</span>
                            <span className="text-gray-500 text-sm">earned</span>
                          </div>
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(achievement.earnedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge 
                          className={getCategoryColor(achievement.category)}
                          variant="secondary"
                        >
                          {achievement.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Progress Tracking</CardTitle>
                <CardDescription>
                  Track your journey toward upcoming achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>🔥 Streak Master (7 consecutive days)</span>
                      <span>4/7 days</span>
                    </div>
                    <Progress value={57} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>🧹 Clean Code Champion (50 code smells)</span>
                      <span>32/50 fixed</span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>🎯 Coverage Expert (90% coverage)</span>
                      <span>87.5/90%</span>
                    </div>
                    <Progress value={97} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>🚀 Performance Pro (0ms response time)</span>
                      <span>12/0ms avg</span>
                    </div>
                    <Progress value={0} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      Need to optimize response times
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Tips */}
            <Card className="border-2 border-dashed border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">💡 Achievement Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span>🐛</span>
                  <span>Focus on fixing bugs to unlock reliability achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Address security vulnerabilities for security badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <span>Improve test coverage to earn coverage achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  <span>Clean up code smells for maintainability rewards</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}