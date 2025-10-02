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

For a comprehensive architecture overview including diagrams, data flow, and design patterns, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Button, Card, etc.)
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── Leaderboard.tsx  # Individual and team leaderboards
│   ├── Projects.tsx     # Project monitoring and management
│   ├── Achievements.tsx # Achievement tracking and badges
│   ├── Header.tsx       # Navigation header
│   ├── SonarQubeConnectionModal.tsx  # Connection management
│   ├── CloudflareHelper.tsx          # Cloudflare bypass helper
│   └── CloudflareStatus.tsx          # Connection status display
├── lib/
│   ├── dataService.ts           # Central data management with caching
│   ├── configService.ts         # Configuration management
│   ├── sonarqubeService.ts      # Server-side SonarQube API
│   ├── sonarqubeClientService.ts # Client-side SonarQube API
│   ├── sonarqubeProxy.ts        # Server function proxy
│   ├── proxyService.ts          # Proxy configuration support
│   ├── cloudflareDetector.ts    # Cloudflare detection
│   ├── cloudflareBypass.ts      # Cloudflare bypass strategies
│   ├── mockData.ts              # Sample SonarQube data and types
│   ├── utils.ts                 # Utility functions
│   └── hooks/
│       └── useSonarQubeConnection.ts # Connection state hook
├── routes/              # TanStack Router pages
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Dashboard page
│   ├── leaderboard.tsx  # Leaderboard page
│   ├── projects.tsx     # Projects page
│   └── achievements.tsx # Achievements page
├── router.tsx           # Router configuration
├── routeTree.gen.ts     # Generated route tree
└── styles.css           # Global styles and Tailwind imports
```

## SonarQube Integration 🔗

SonarQuest uses environment variables for configuration, making setup simple and secure. The application automatically connects to SonarQube on startup when properly configured.

### Features
- ✅ **Environment-based Configuration**: Simple .env file setup
- ✅ **Automatic Connection**: Connects on startup with valid credentials
- ✅ **Intelligent Cloudflare Detection**: Detects and adapts to Cloudflare protection
- ✅ **Intelligent Bypass Strategies**: Multiple automatic bypass methods
- ✅ **CORS-free connections**: Server-side proxy bypasses browser restrictions
- ✅ **Organization support**: Works with SonarCloud and multi-org setups

### Quick Setup

#### 1. Create Environment File

Copy the example environment file and fill in your SonarQube details:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your SonarQube details
```

#### 2. Configure Your SonarQube Connection

Edit the `.env` file:

```bash
# Required: Your SonarQube server URL
VITE_SONARQUBE_URL=https://your-sonarqube-instance.com

# Required: SonarQube user token (generate in SonarQube: Account > Security > Tokens)
VITE_SONARQUBE_TOKEN=your_sonarqube_token_here

# Optional: Organization key (for SonarCloud or multi-organization setups)
# VITE_SONARQUBE_ORGANIZATION=your_organization_key

# Optional: Enable real data mode (set to 'false' to use mock data)
VITE_USE_REAL_SONARQUBE=true
```

#### 3. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The application will automatically connect to your SonarQube instance on startup!

### Docker Setup

#### Using Docker Compose (Recommended)

1. **Create your .env file** as described above

2. **Build and run**:
   ```bash
   docker-compose up -d
   ```

The docker-compose.yml is configured to automatically use your .env file.

#### Using Docker Build

Build with environment variables:

```bash
docker build \
  --build-arg VITE_SONARQUBE_URL=https://your-sonarqube-instance.com \
  --build-arg VITE_SONARQUBE_TOKEN=your_token_here \
  --build-arg VITE_USE_REAL_SONARQUBE=true \
  -t sonarquest .

docker run -p 3000:3000 sonarquest
```

### Configuration Management

When environment variables are configured:
- ✅ The application connects automatically on startup
- ✅ Configuration is read-only through the UI
- ✅ Changes must be made to the .env file
- ✅ Application restart is required for changes to take effect

This ensures consistent configuration across deployments and prevents accidental changes.

### Cloudflare Protection Handling

The application automatically handles different levels of Cloudflare protection:

- **🟢 No Protection**: Direct connection works normally
- **🟡 Basic Protection**: Automatic header enhancement and retry logic
- **🟠 Under Attack Mode**: Enhanced bypass strategies with delays
- **🔴 Challenge Mode**: Manual intervention may be required

**Automatic Strategies Applied:**
- Realistic browser headers and user-agent rotation
- Smart request timing and delays
- Automatic retry logic with exponential backoff
- Connection status monitoring and recommendations

### Troubleshooting Connection Issues

The app provides intelligent error messages and recommendations:

| **Error** | **Likely Cause** | **Automatic Solution** | **Manual Options** |
|-----------|-----------------|----------------------|-------------------|
| 403 Forbidden | Cloudflare protection | Enhanced headers, retry logic | VPN, IP whitelisting |
| 503 Service Unavailable | Under Attack mode | Increased delays, backoff | Contact admin, wait |
| 429 Rate Limited | Too many requests | Automatic delays | Reduce frequency |
| Network Error | Connectivity issue | Retry with timeout | Check URL, network |

For detailed troubleshooting, see: [CLOUDFLARE_BYPASS.md](./CLOUDFLARE_BYPASS.md)

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
