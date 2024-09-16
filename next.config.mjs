import dotenv from "dotenv";
import { resolve } from "path";

// Determine the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: resolve(process.cwd(), envFile) });

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
