<div align="center">
  <img src="src/assets/know-logo.png" alt="Know Logo" width="200" height="auto" />

  # Welcome to Know 🎨

  <img src="src/assets/hero1.png" alt="Know Platform Welcome" width="600" height="auto" />

  ### *Connecting Artists with Art Lovers Worldwide*

  [![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📖 About Know

**Know** is a modern, full-featured art marketplace platform that bridges the gap between talented artists and passionate art collectors. Our platform provides a seamless experience for artists to showcase and sell their work while offering buyers a curated selection of unique artpieces from around the world.

### ✨ Key Features

- 🎨 **Artist Profiles** - Comprehensive portfolios for artists to showcase their work
- 🛒 **Buyer Experience** - Intuitive browsing and purchasing experience
- 🔍 **Explore & Discover** - Advanced search and filtering capabilities
- 🎯 **Personalization** - Tailored recommendations based on user preferences
- 💳 **Secure Payments** - Integrated payment processing with multiple options
- 📦 **Shipping Management** - Streamlined logistics for artwork delivery
- 🔐 **Authentication** - Secure user registration and login system
- 📧 **Mail Integration** - Automated communications and newsletters

---

## 🏗️ Architecture

### Frontend Architecture Overview

```
know_frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (root)/            # Main application routes
│   │   ├── artist-profile/    # Artist profile pages
│   │   ├── buyer-profile/     # Buyer profile pages
│   │   ├── explore/           # Discovery and search
│   │   ├── personalize/       # Personalization features
│   │   ├── publish/           # Content publishing
│   │   └── upload/            # File upload functionality
│   │
│   ├── features/              # Feature-based modules
│   │   ├── asset/            # Asset management
│   │   ├── auth/             # Authentication logic
│   │   ├── explore/          # Search and discovery
│   │   ├── payments/         # Payment processing
│   │   ├── profile/          # User profiles
│   │   └── shipping/         # Logistics management
│   │
│   ├── shared/               # Shared components and utilities
│   ├── lib/                  # Third-party library configurations
│   ├── utils/                # Utility functions
│   ├── config/               # Application configuration
│   ├── constants/            # Application constants
│   └── assets/               # Static assets and images
│
├── public/                   # Public static files
└── components.json           # shadcn/ui configuration
```

### Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15.2.4 with App Router |
| **Frontend** | React 19, TypeScript 5 |
| **Styling** | TailwindCSS 4.1.3, DaisyUI, Framer Motion |
| **State Management** | Redux Toolkit, Zustand, React Query |
| **Forms** | React Hook Form, Formik, Yup/Zod validation |
| **UI Components** | Radix UI, Lucide Icons, Tabler Icons |
| **Development** | ESLint, Prettier, Commitizen |

### Key Design Patterns

- **Feature-Based Architecture** - Organized by business features rather than technical layers
- **Component Composition** - Reusable UI components with proper separation of concerns
- **Custom Hooks** - Encapsulated business logic and state management
- **Route Groups** - Organized routing with Next.js App Router
- **Type Safety** - Full TypeScript integration with strict type checking

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/know_frontend.git
   cd know_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your configuration:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
   # Add other environment variables as needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |

### Production Deployment

#### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

#### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Authentication
NEXT_PUBLIC_AUTH_SECRET=your-auth-secret

# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_your_stripe_key

# Database (if applicable)
DATABASE_URL=your_database_connection_string

# Email Service
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

### Customization

- **Themes**: Modify `tailwind.config.ts` for custom styling
- **Components**: Update `components.json` for shadcn/ui configuration
- **Fonts**: Add custom fonts in `src/app/fonts/`
- **Assets**: Place images and static files in `src/assets/` or `public/`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

### Code Style

We use Prettier and ESLint for code formatting and linting. Run the following before committing:

```bash
npm run lint
npx prettier --write .
```
---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/know_frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/know_frontend/discussions)
- **Email**: support@know-platform.com

---

<div align="center">
  <p>Made with ❤️ by the Know Team</p>

  <img src="src/assets/trusted.jpeg" alt="Trusted Platform" width="400" height="auto" />

  ### *Building the Future of Art Commerce*
</div>
