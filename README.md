# SiteScan

SiteScan is a web app that lets you quickly analyze and summarize any website. It fetches key details like **About**, **Terms of Service**, **Privacy Policy**, **Data Collected**, and **Lighthouse scores** (Performance, Accessibility, SEO, Best Practices) into an easy-to-read overview.

**Live Demo:** [https://sitescan-rho.vercel.app]

## Features

* 🌐 Summarize websites with a clean UI
* 📊 Visualize Lighthouse scores with progress charts
* 📑 Display important sections: About, Terms, Policies, and Data collected
* 🛡️ Simple rate limiting to prevent abuse (max 3 scans per user/day)
* 🎨 Built with modern UI components (Next.js, TailwindCSS, Shadcn)
* 💾 MongoDB + Prisma for data storage

## Tech Stack

* [Next.js 1r (App Router)](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Prisma](https://www.prisma.io/) + [MongoDB](https://www.mongodb.com/)
* [react-circular-progressbar](https://www.npmjs.com/package/react-circular-progressbar) for score visuals

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sitescan.git
cd sitescan
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL="your-mongodb-connection-string"
```

### 4. Run database migrations

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Folder Structure

```
components/         # UI components (SummaryCard, LighthouseOverview, etc.)
app/                # Next.js App Router pages and routes
lib/                # Prisma client and utilities
prisma/             # Prisma schema
```

