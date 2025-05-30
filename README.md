# TokenReady - Community-Driven Launchpad

TokenReady is a modern, community-driven launchpad platform built with Next.js 14, Material-UI, and Appwrite. It enables projects to get vetted by believers and build momentum through conviction-based investing.

## 🚀 Features

### For Founders
- **Launch Checklist**: Step-by-step launch guide based on proven playbooks
- **Community Vetting**: Get reviewed and rated by BOB believers
- **Launch Coordination**: Schedule launches and coordinate with BelieverApp

### For Community
- **Project Discovery**: Explore vetted projects across multiple categories
- **Simulated Investments**: Use virtual BOB points to back projects you believe in
- **Reviews & Ratings**: Submit detailed reviews and earn BOB points
- **Staking Rewards**: Stake $BOB tokens to earn yield from invested projects

### Platform Features
- **Real-time Dashboard**: Live staking metrics and project performance
- **Leaderboards**: Track top reviewers and believers by performance
- **Signal System**: Top projects get the BOB Signal for maximum visibility
- **Mobile Responsive**: Optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Material-UI (MUI)
- **Backend**: Appwrite (Database, Authentication, Storage)
- **Styling**: Material-UI Theme with custom dark mode
- **Forms**: React Hook Form with validation
- **State Management**: React Hooks + Custom hooks
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
belief-board/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Home page
│   │   ├── explore/           # Project exploration
│   │   ├── submit/            # Project submission
│   │   └── project/[id]/      # Project details
│   ├── components/            # Reusable components
│   │   ├── common/            # Layout, Header, Footer
│   │   ├── home/              # Home page sections
│   │   ├── projects/          # Project-related components
│   │   └── staking/           # Staking components
│   ├── lib/                   # Configuration and types
│   │   ├── appwrite.ts        # Appwrite configuration
│   │   ├── theme.ts           # MUI theme configuration
│   │   └── types.ts           # TypeScript types
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Appwrite account and project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/belief-board.git
cd belief-board
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID=your_projects_collection_id
NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=your_reviews_collection_id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
```

4. **Appwrite Setup**
   - Create a new Appwrite project
   - Create a database with the following collections:
     - **Projects**: name, ticker, description, website, twitter, github, category, status, believers, reviews, bobScore, etc.
     - **Reviews**: projectId, userId, rating, comment, investment, createdAt
     - **Users**: email, name, wallet, totalStaked, bobPoints, reviewsCount

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎨 Customization

### Theme Customization
The Material-UI theme is configured in `src/lib/theme.ts`. You can customize:
- Colors (primary, secondary, background)
- Typography (fonts, sizes, weights)
- Component styles (buttons, cards, forms)

### Adding New Features
1. Create components in the appropriate directory
2. Add new pages in the `src/app/` directory
3. Define types in `src/lib/types.ts`
4. Create custom hooks in `src/hooks/`

## 🔮 Future Enhancements

### Blockchain Integration
- Smart contract integration for staking
- Web3 wallet connection (MetaMask, WalletConnect)
- On-chain governance and voting
- Token distribution and rewards

### Advanced Features
- Creator dashboard for project supporters
- Telegram bot alerts for project updates
- Advanced analytics and metrics
- Multi-language support

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by BelieverApp and VaderAI platforms
- Built with modern web technologies
- Community-driven development approach

---

**Built with ❤️ for the Web3 community**