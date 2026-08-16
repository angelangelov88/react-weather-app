# React Weather App

A weather app built with React 19, TypeScript, and Vite. Search for any city and get the current temperature, feels like, and weather condition with a dynamic background based on temperature.

## Tech Stack

- **React 19** with TypeScript
- **Vite** — build tool and dev server
- **ESLint** + **Prettier** — linting and formatting
- **Vercel** — deployment

## Getting Started

Requires [pnpm](https://pnpm.io/) installed globally:

```bash
npm install -g pnpm
```

Install dependencies and start the dev server:

```bash
pnpm install
pnpm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Copy `.env example` to `.env` and fill in your values:

```
VITE_API_KEY=your_openweathermap_api_key
VITE_BASE=https://api.openweathermap.org
```

Get a free API key at [openweathermap.org](https://openweathermap.org/api).

## Scripts

| Command | Description |
|---|---|
| `pnpm start` | Start dev server |
| `pnpm build` | Production build (outputs to `dist/`) |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Run Prettier |

## Deployment

Deployed to [Vercel](https://vercel.com). Set the output directory to `dist` in Vercel project settings.
