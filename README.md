# GG

GG is a scavenger hunt-style mobile PWA where players (hunters) can explore a map, collect G boxes, and compete on the leaderboard. The app integrates authentication, real-time location tracking, and WebSockets for a seamless multiplayer experience.

## Features
- **Authentication**: Twitter OAuth via NextAuth.js
- **Game Mechanics**: Collect G boxes, claim rewards, and climb the leaderboard
- **Live Tracking**: Uses WebSockets to track players in real-time
- **Leaderboard**: Displays player rankings based on collected points
- **PWA Support**: Installable on mobile devices with offline capabilities

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Backend**: Serverless API with [SST](https://sst.dev/)
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Twitter provider
- **Real-time Updates**: WebSockets for chat and location tracking
- **Mapping**: [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/) for in-game navigation
- **Error Monitoring**: [Sentry](https://sentry.io/)

## Installation & Setup

### 1. Clone the repository
```sh
git clone https://github.com/mirage-ar/gg.git
cd gg
```

### 2. Install dependencies
```sh
yarn install  # or npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
DATABASE_URL=your_postgresql_database_url
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Run the Development Server
```sh
yarn dev  # or npm run dev
```
The app will be available at `http://localhost:3000`.

## Project Structure
```
/gg
├── app/                  # Next.js app router
│   ├── api/              # API routes (authentication, user data, etc.)
│   ├── chat/             # In-game chat feature
│   ├── claim/            # Claim rewards page
│   ├── gameover/         # Post-game results
│   ├── leaderboard/      # Player ranking
│   ├── profile/          # User profile page
│   ├── layout.tsx        # Global layout
│   ├── manifest.webmanifest # PWA config
│   └── page.tsx          # Main game page
├── components/           # Reusable UI components
│   ├── chat/             # Chat UI
│   ├── game/             # Game timer, logic
│   ├── leaderboard/      # Leaderboard display
│   ├── map/              # Mapbox integration
│   ├── navigation/       # Navigation bars
│   ├── onboarding/       # New user onboarding
│   ├── profile/          # User profile display
│   └── timer/            # Timer component
├── hooks/                # Custom React hooks
├── prisma/               # Database schema & migrations
├── state/                # Context API for app state management
├── types/                # TypeScript type definitions
├── utils/                # Utility functions (constants, geohashing, etc.)
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Deployment
### 1. Build the Application
```sh
yarn build  # or npm run build
```

### 2. Deploy to Vercel
```sh
vercel deploy
```

### 3. Deploy with SST (Serverless Stack)
Ensure AWS credentials are set up and deploy using:
```sh
npx sst deploy
```

## License
This project is licensed under the MIT License.

