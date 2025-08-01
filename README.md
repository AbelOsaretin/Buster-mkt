# Buster-mkt: Onchain Prediction Market Platform

> Buster-mkt is a decentralized prediction market built with Next.js, viem, wagmi, and Satori. Users can create, trade, and resolve prediction markets onchain, with a focus on transparency, analytics, and Farcaster mini-app integration.

## Features

- Onchain prediction markets (create, trade, resolve)
- ERC20 token-based betting
- User stats and leaderboards
- Satori-powered shareable stats images
- Farcaster mini-app and frame support
- Secure claim/faucet integration (see Security Notes)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure environment:**

   - Copy `.env.example` to `.env.local` and set your environment variables (e.g., `NEXT_PUBLIC_ALCHEMY_RPC_URL`, contract addresses, etc).

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `src/app/` — Next.js app directory (API routes, pages, layout)
- `src/components/` — UI and logic components
- `src/constants/` — Contract addresses and ABIs
- `src/lib/` — Analytics, subgraph, and utility functions
- `public/` — Static assets and fonts

## Smart Contracts

- Main market contract: Handles market creation, trading, and resolution
- ERC20 token contract: Used for betting and rewards
- Faucet/claim contract: (Recommended) For distributing tokens to new users

> **Note:** If the faucet is drained or exploited, deploy a new claim contract and update the frontend integration.

## Security Notes

- Only claim tokens from trusted faucet contracts.
- Each user/address can claim once (or per cooldown period, if enabled).
- Use anti-bot and Sybil resistance measures for public faucets.

## Deployment

Deploy easily on [Vercel](https://vercel.com/new) or your preferred platform. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss major changes.

## License

MIT
