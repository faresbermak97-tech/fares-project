# Fares Bermak - Remote Virtual Assistant & Data Entry Services

A professional website showcasing remote virtual assistance and data entry services offered by Fares Bermak. Built with Next.js, TypeScript, and Tailwind CSS, the site features modern animations, responsive design, and optimized performance.

## Features

- **Modern UI/UX**: Clean, professional design with smooth animations and transitions
- **Responsive Layout**: Fully responsive design that works seamlessly on all devices
- **Service Showcase**: Detailed presentation of virtual assistance and data entry services
- **Interactive Elements**: Dynamic components with engaging user interactions
- **Optimized Performance**: Code splitting, lazy loading, and optimized assets for fast loading
- **Contact Form**: Integrated contact functionality for client inquiries

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: shadcn/ui components
- **Animations**: GSAP (GreenSock Animation Platform) with ScrollTrigger
- **Form Handling**: Custom form implementation with nodemailer
- **Testing**: Jest with React Testing Library
- **Code Quality**: ESLint, Biome for formatting and linting

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fares-project.git
cd fares-project
```

2. Install dependencies:

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install

# Or using bun
bun install
```

3. Run the development server:

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev

# Or using bun
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Project Structure

```
fares-project/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   │   ├── sections/      # Page sections
│   │   ├── shared/        # Shared components
│   │   └── modals/        # Modal components
│   └── utils/             # Utility functions
├── biome.json             # Biome configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json           # Project dependencies and scripts
```

## Available Scripts

- `dev` - Start the development server
- `build` - Build the production application
- `start` - Start the production server
- `lint` - Run ESLint to check for code issues
- `format` - Format code using Biome
- `test` - Run tests
- `test:watch` - Run tests in watch mode
- `test:coverage` - Run tests with coverage report

## Deployment

This project is configured for deployment on Netlify (see `netlify.toml`). It can also be deployed on Vercel or any other platform that supports Next.js applications.

### Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

```
NEXT_PUBLIC_GA_ID=your-google-analytics-id
EMAIL_HOST=your-email-host
EMAIL_PORT=your-email-port
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-password
EMAIL_FROM=your-email-from
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For inquiries about the virtual assistant and data entry services, please use the contact form on the website or reach out through the provided contact information.

© 2023 Fares Bermak. All rights reserved.