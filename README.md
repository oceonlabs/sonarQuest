# SonarQuest 🎮🎖️

A modern gamification application that transforms SonarQube code quality metrics into an engaging leaderboard and achievement system. Built with TanStack Start, TypeScript, and Tailwind CSS.

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

SonarQuest now includes built-in CORS handling for seamless SonarQube integration. The application uses a server-side proxy to bypass browser CORS restrictions, allowing direct connections to any SonarQube instance.

### Features
- ✅ **CORS-free connections**: No browser CORS restrictions
- ✅ **Secure authentication**: Tokens handled server-side
- ✅ **Real-time connection testing**: Test your connection before connecting
- ✅ **Detailed error handling**: Clear error messages for troubleshooting
- ✅ **Organization support**: Works with SonarCloud and multi-org setups

### Quick Setup

1. **Click "Connect SonarQube"** in the application header
2. **Enter your SonarQube details**:
   - Server URL (e.g., `https://your-sonarqube.company.com`)
   - User Token (generate in SonarQube: Account → Security → Tokens)
   - Organization (optional, for SonarCloud or multi-org setups)
3. **Test Connection** to verify the setup
4. **Connect** to start using real data

### Environment Configuration (Optional)

For automatic connection on startup, set these environment variables:

```bash
# Your SonarQube server URL
VITE_SONARQUBE_URL=https://your-sonarqube-instance.com

# SonarQube user token
VITE_SONARQUBE_TOKEN=your_sonarqube_token_here

# Organization key (optional)
VITE_SONARQUBE_ORGANIZATION=your_organization_key

# Enable real data mode
VITE_USE_REAL_SONARQUBE=true
```

### Technical Implementation

The CORS fix is implemented using TanStack Start server functions:
- **Client requests** go to a server-side proxy function
- **Server proxy** makes the actual SonarQube API calls
- **No CORS issues** since server-to-server requests aren't restricted
- **Transparent integration** - no changes needed to existing UI

### Troubleshooting

Common connection issues and solutions:

| Error | Solution |
|-------|----------|
| Network error | Verify SonarQube URL is accessible |
| Authentication failed | Check your user token is valid |
| Access forbidden | Ensure token has sufficient permissions |
| Server not found | Verify the server URL is correct |

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

### Screenshots
<img width="3456" height="1936" alt="image" src="https://github.com/user-attachments/assets/3f148a62-1db9-454f-8ece-8bda37f39abb" />
<img width="3456" height="1934" alt="image" src="https://github.com/user-attachments/assets/61243beb-749b-4da9-815d-65fe052d5bcc" />
<img width="3456" height="1934" alt="image" src="https://github.com/user-attachments/assets/035711fe-b8cd-45ea-a73c-8792ce492ba0" />
<img width="3456" height="1934" alt="image" src="https://github.com/user-attachments/assets/be8e3ef4-a038-4e5c-9a41-6a7ae2f42cd4" />

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- [TanStack](https://tanstack.com/) for the excellent React framework
- [SonarQube](https://www.sonarqube.org/) for code quality analysis
- [Tailwind CSS](https://tailwindcss.com/) for beautiful, responsive styling
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives

---


**SonarQuest** - Making code quality fun, one commit at a time! 🚀
