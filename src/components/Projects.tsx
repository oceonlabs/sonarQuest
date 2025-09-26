import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { mockProjects, getRatingColor, getRatingLabel, getQualityGateColor } from '../lib/mockData'

export function Projects() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
              <p className="text-gray-500">
                Monitor and improve code quality across all your projects
              </p>
            </div>
            <Button>
              Add Project
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card key={project.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {/* Quality Gate Status Strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                project.qualityGateStatus === 'OK' 
                  ? 'bg-green-500' 
                  : project.qualityGateStatus === 'WARN' 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`} />
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                    <CardDescription className="text-sm mt-1 line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={
                      project.qualityGateStatus === 'OK' 
                        ? 'success' 
                        : project.qualityGateStatus === 'WARN' 
                          ? 'warning' 
                          : 'destructive'
                    }
                    className="ml-2 flex-shrink-0"
                  >
                    {project.qualityGateStatus}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  Last analysis: {new Date(project.lastAnalysisDate).toLocaleDateString()}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="space-y-3">
                  {/* Test Coverage */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Test Coverage</span>
                      <span className={
                        project.metrics.coverage >= 80 
                          ? 'text-green-600' 
                          : project.metrics.coverage >= 60 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }>
                        {project.metrics.coverage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={project.metrics.coverage} 
                      className="h-2"
                    />
                  </div>

                  {/* Duplicate Code */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Duplicated Lines</span>
                      <span className={
                        project.metrics.duplicated_lines_density <= 3 
                          ? 'text-green-600' 
                          : project.metrics.duplicated_lines_density <= 10 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }>
                        {project.metrics.duplicated_lines_density.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(project.metrics.duplicated_lines_density, 20) * 5} 
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Reliability, Security, Maintainability Ratings */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ratings</span>
                  <div className="flex gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRatingColor(project.metrics.reliability_rating)}`}
                    >
                      R: {getRatingLabel(project.metrics.reliability_rating)}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRatingColor(project.metrics.security_rating)}`}
                    >
                      S: {getRatingLabel(project.metrics.security_rating)}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRatingColor(project.metrics.sqale_rating)}`}
                    >
                      M: {getRatingLabel(project.metrics.sqale_rating)}
                    </Badge>
                  </div>
                </div>

                {/* Issues Summary */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {project.metrics.bugs}
                    </div>
                    <div className="text-xs text-gray-500">Bugs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {project.metrics.vulnerabilities}
                    </div>
                    <div className="text-xs text-gray-500">Vulnerabilities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">
                      {project.metrics.code_smells}
                    </div>
                    <div className="text-xs text-gray-500">Code Smells</div>
                  </div>
                </div>

                {/* Technical Debt */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Technical Debt</span>
                  <span className="text-gray-500">
                    {project.metrics.technical_debt}min
                  </span>
                </div>

                {/* Lines of Code */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Lines of Code</span>
                  <span className="text-gray-500">
                    {project.metrics.ncloc.toLocaleString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Fix Issues
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Project Card */}
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-6">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                ➕
              </div>
              <CardTitle className="text-lg mb-2 text-gray-500 group-hover:text-blue-600">
                Add New Project
              </CardTitle>
              <CardDescription className="text-center">
                Connect your SonarQube project to start tracking code quality metrics
              </CardDescription>
              <Button className="mt-4">
                Connect Project
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Project Statistics Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
            <CardDescription>
              Overview of all monitored projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {mockProjects.filter(p => p.qualityGateStatus === 'OK').length}
                </div>
                <div className="text-sm text-gray-500">Passing Quality Gate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {mockProjects.filter(p => p.qualityGateStatus === 'WARN').length}
                </div>
                <div className="text-sm text-gray-500">Warning Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {mockProjects.filter(p => p.qualityGateStatus === 'ERROR').length}
                </div>
                <div className="text-sm text-gray-500">Failed Quality Gate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {mockProjects.reduce((acc, p) => acc + p.metrics.ncloc, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Lines of Code</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}