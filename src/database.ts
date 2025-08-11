import { drizzle } from 'drizzle-orm/node-postgres'
import {and, eq} from "drizzle-orm"

export const db = drizzle(process.env.DATABASE_URI!)