# TimeWise Calendar Bot

A Calendar app with an AI bot that helps manage your calendar and schedule through simple commands.

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js
- PostgreSQL
- npm

## 🚀 Getting Started

### Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database
3. Locate the `TimeWiseDB_backup.sql` file in the root directory
4. Restore the database using:

```bash
psql your_database_name < TimeWiseDB_backup.sql
```

### Environment Setup

1. Create a `.env.local` file in the root directory
2. Add the following environment variables (Use port 5433 if 5432 doesn't work):

```plaintext
# Add your environment variables here
# Database configuration
DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=5432

# Discord configuration
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id
```

### Installation

1. Clone the repository
```bash
https://github.com/5sansiva/CS-3354.git
```

2. Install dependencies
```bash
npm install
```

## 🔧 Running the Application

The application needs to be run in two parts:

1. Start the Discord bot:
```bash
npm run bot
```

2. In a separate terminal, start the development server:
```bash
npm run dev
```

## 🤖 Using the Discord Bot

1. Join our Discord server: [TimeWise Server](https://discord.gg/UzsSZZYpXj)
2. Navigate to the `#testing` channel
3. Use the bot with the following syntax:
```
!calendar {command}
```

##
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

