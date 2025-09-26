# SonarQuest 🎮🎖️

A modern gamification application that transforms SonarQube code quality metrics into an engaging leaderboard and achievement system. Built with TanStack Start, TypeScript, and Tailwind CSS.

<img width="3456" height="1936" alt="image" src="https://github.com/user-attachments/assets/3f148a62-1db9-454f-8ece-8bda37f39abb" />


## Features ✨

### 🎯 Dashboard
- **Project Overview**: Monitor code quality metrics across all your projects
- **Developer Leaderboard**: Track top contributors based on code quality improvements
- **Team Rankings**: Compare team performance and collaboration
- **Real-time Metrics**: Display SonarQube quality gates, coverage, and issue counts

### 🏆 Leaderboard
- **Individual Rankings**: Detailed developer statistics and achievements
- **Team Competition**: Team-based scoring and collaboration metrics
- **Monthly Challenges**: Gamified goals to encourage continuous improvement

### 📊 Projects
- **Quality Gate Status**: Visual indicators for project health (OK/WARN/ERROR)
- **Code Coverage**: Progress bars showing test coverage percentages
- **Issue Tracking**: Bugs, vulnerabilities, and code smells breakdown
- **Technical Debt**: Monitoring and visualization of technical debt

### 🎖️ Achievements
- **Badge System**: Unlock achievements for reliability, security, maintainability
- **Progress Tracking**: Monitor progress toward upcoming achievements
- **Recent Activity**: Timeline of recently earned badges
- **Category-based**: Organized by reliability, security, coverage, and maintainability

## Tech Stack 🛠️

- **Framework**: [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **UI Components**: Custom shadcn/ui inspired components
- **Icons**: Unicode emojis and symbols for gamification elements
- **Build Tool**: Vite for fast development and building

## Getting Started 🚀

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:oceonlabs/sonarQuest.git
   cd sonarQuest
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure 📁

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Button, Card, etc.)
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── Leaderboard.tsx  # Individual and team leaderboards
│   ├── Projects.tsx     # Project monitoring and management
│   ├── Achievements.tsx # Achievement tracking and badges
│   └── Header.tsx       # Navigation header
├── lib/
│   ├── mockData.ts      # Sample SonarQube data and types
│   └── utils.ts         # Utility functions
├── routes/              # TanStack Router pages
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Dashboard page
│   ├── leaderboard.tsx  # Leaderboard page
│   ├── projects.tsx     # Projects page
│   └── achievements.tsx # Achievements page
└── styles.css           # Global styles and Tailwind imports
```

## SonarQube Integration 🔗

Currently, the application uses mock data to demonstrate functionality. To integrate with a real SonarQube instance:

1. **Set up SonarQube Web API access**
   - Configure authentication tokens
   - Set up CORS if needed for browser requests

2. **Replace mock data service**
   - Update `src/lib/mockData.ts` with actual API calls
   - Implement data fetching hooks or services

3. **Environment Configuration**
   - Add SonarQube server URL to environment variables
   - Configure authentication credentials

### Example API Integration

```typescript
// Example of how to integrate with SonarQube API
const SONAR_BASE_URL = process.env.VITE_SONAR_URL || 'http://localhost:9000';
const SONAR_TOKEN = process.env.VITE_SONAR_TOKEN;

export async function fetchProjects() {
  const response = await fetch(`${SONAR_BASE_URL}/api/projects/search`, {
    headers: {
      'Authorization': `Bearer ${SONAR_TOKEN}`
    }
  });
  return response.json();
}
```

## Gamification Elements 🎮

### Scoring System
- **Bug Fixes**: 50 points each
- **Security Vulnerabilities**: 100 points each
- **Code Smells**: 25 points each  
- **Coverage Improvement**: 20 points per percentage point
- **Commits**: 5 points each

### Achievement Categories
- **🔧 Reliability**: Bug fixes and stability improvements
- **🛡️ Security**: Vulnerability resolution and security enhancements
- **🧹 Maintainability**: Code smell cleanup and refactoring
- **📊 Coverage**: Test coverage improvements
- **⭐ General**: Overall contribution and participation

## Development 👨‍💻

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Customization 🎨

### Theming
The application uses Tailwind CSS for styling. You can customize colors and themes by modifying `src/styles.css`.

### Adding New Achievements
1. Update the achievement types in `src/lib/mockData.ts`
2. Add achievement logic to scoring functions
3. Update the UI components to display new achievement types

### Metrics Configuration
Customize the scoring system by modifying the `calculateScore` function in `src/lib/mockData.ts`.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- [TanStack](https://tanstack.com/) for the excellent React framework
- [SonarQube](https://www.sonarqube.org/) for code quality analysis
- [Tailwind CSS](https://tailwindcss.com/) for beautiful, responsive styling
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives

---

**SonarQuest** - Making code quality fun, one commit at a time! 🚀
