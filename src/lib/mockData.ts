// Mock SonarQube data service
export interface Project {
  id: string
  name: string
  key: string
  description: string
  qualityGateStatus: 'OK' | 'WARN' | 'ERROR'
  metrics: {
    reliability_rating: number
    security_rating: number
    sqale_rating: number
    coverage: number
    duplicated_lines_density: number
    ncloc: number
    bugs: number
    vulnerabilities: number
    code_smells: number
    technical_debt: number
  }
  lastAnalysisDate: string
}

export interface Developer {
  id: string
  name: string
  email: string
  avatar: string
  stats: {
    totalCommits: number
    issuesFixed: number
    codeSmellsFixed: number
    bugsFixed: number
    vulnerabilitiesFixed: number
    coverageImprovement: number
  }
  achievements: Achievement[]
  score: number
  rank: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earnedDate: string
  category: 'reliability' | 'security' | 'maintainability' | 'coverage' | 'general'
}

export interface Team {
  id: string
  name: string
  members: Developer[]
  projects: Project[]
  totalScore: number
  rank: number
}

// Mock data
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'SonarQuest Frontend',
    key: 'sonarquest-frontend',
    description: 'React-based frontend for SonarQuest gamification platform',
    qualityGateStatus: 'OK',
    metrics: {
      reliability_rating: 1,
      security_rating: 1,
      sqale_rating: 1,
      coverage: 87.5,
      duplicated_lines_density: 3.2,
      ncloc: 12500,
      bugs: 2,
      vulnerabilities: 0,
      code_smells: 15,
      technical_debt: 120
    },
    lastAnalysisDate: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'SonarQuest API',
    key: 'sonarquest-api',
    description: 'Backend API for SonarQuest gamification system',
    qualityGateStatus: 'WARN',
    metrics: {
      reliability_rating: 2,
      security_rating: 1,
      sqale_rating: 2,
      coverage: 72.8,
      duplicated_lines_density: 5.1,
      ncloc: 8900,
      bugs: 5,
      vulnerabilities: 1,
      code_smells: 28,
      technical_debt: 245
    },
    lastAnalysisDate: '2025-01-14T16:45:00Z'
  },
  {
    id: '3',
    name: 'Data Analytics Service',
    key: 'data-analytics',
    description: 'Microservice for processing and analyzing code metrics',
    qualityGateStatus: 'ERROR',
    metrics: {
      reliability_rating: 3,
      security_rating: 2,
      sqale_rating: 3,
      coverage: 45.2,
      duplicated_lines_density: 12.8,
      ncloc: 6300,
      bugs: 12,
      vulnerabilities: 3,
      code_smells: 45,
      technical_debt: 380
    },
    lastAnalysisDate: '2025-01-13T09:20:00Z'
  }
]

export const mockAchievements: Achievement[] = [
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Fixed 10+ bugs in a single month',
    icon: '🐛',
    earnedDate: '2025-01-10T00:00:00Z',
    category: 'reliability'
  },
  {
    id: 'security-champion',
    name: 'Security Champion',
    description: 'Resolved 5+ security vulnerabilities',
    icon: '🔒',
    earnedDate: '2025-01-05T00:00:00Z',
    category: 'security'
  },
  {
    id: 'code-cleaner',
    name: 'Code Cleaner',
    description: 'Fixed 25+ code smells',
    icon: '✨',
    earnedDate: '2024-12-28T00:00:00Z',
    category: 'maintainability'
  },
  {
    id: 'coverage-hero',
    name: 'Coverage Hero',
    description: 'Improved test coverage by 15%+',
    icon: '🎯',
    earnedDate: '2024-12-20T00:00:00Z',
    category: 'coverage'
  }
]

export const mockDevelopers: Developer[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    avatar: '👨‍💻',
    stats: {
      totalCommits: 127,
      issuesFixed: 45,
      codeSmellsFixed: 32,
      bugsFixed: 18,
      vulnerabilitiesFixed: 5,
      coverageImprovement: 12.3
    },
    achievements: mockAchievements.slice(0, 3),
    score: 2850,
    rank: 1
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: '👩‍💻',
    stats: {
      totalCommits: 98,
      issuesFixed: 38,
      codeSmellsFixed: 28,
      bugsFixed: 15,
      vulnerabilitiesFixed: 8,
      coverageImprovement: 18.7
    },
    achievements: [mockAchievements[1], mockAchievements[3]],
    score: 2720,
    rank: 2
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@company.com',
    avatar: '🧑‍💻',
    stats: {
      totalCommits: 85,
      issuesFixed: 29,
      codeSmellsFixed: 22,
      bugsFixed: 12,
      vulnerabilitiesFixed: 3,
      coverageImprovement: 8.4
    },
    achievements: [mockAchievements[0], mockAchievements[2]],
    score: 2180,
    rank: 3
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@company.com',
    avatar: '👩‍🔬',
    stats: {
      totalCommits: 76,
      issuesFixed: 25,
      codeSmellsFixed: 19,
      bugsFixed: 9,
      vulnerabilitiesFixed: 2,
      coverageImprovement: 6.1
    },
    achievements: [mockAchievements[2]],
    score: 1940,
    rank: 4
  }
]

export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Frontend Wizards',
    members: mockDevelopers.slice(0, 2),
    projects: [mockProjects[0]],
    totalScore: 5570,
    rank: 1
  },
  {
    id: '2',
    name: 'Backend Heroes',
    members: mockDevelopers.slice(2, 4),
    projects: [mockProjects[1], mockProjects[2]],
    totalScore: 4120,
    rank: 2
  }
]

// Helper functions
export const getRatingColor = (rating: number) => {
  switch (rating) {
    case 1:
      return 'text-green-600'
    case 2:
      return 'text-yellow-600'
    case 3:
      return 'text-orange-600'
    case 4:
    case 5:
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export const getRatingLabel = (rating: number) => {
  switch (rating) {
    case 1:
      return 'A'
    case 2:
      return 'B'
    case 3:
      return 'C'
    case 4:
      return 'D'
    case 5:
      return 'E'
    default:
      return 'N/A'
  }
}

export const getQualityGateColor = (status: string) => {
  switch (status) {
    case 'OK':
      return 'text-green-600 bg-green-50'
    case 'WARN':
      return 'text-yellow-600 bg-yellow-50'
    case 'ERROR':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export const calculateScore = (stats: Developer['stats']): number => {
  return (
    stats.bugsFixed * 50 +
    stats.vulnerabilitiesFixed * 100 +
    stats.codeSmellsFixed * 25 +
    stats.coverageImprovement * 20 +
    stats.totalCommits * 5
  )
}