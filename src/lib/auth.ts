import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {db} from "@/database"
import {schema} from "@/db/schema"
import {nextCookies} from "better-auth/next-js"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    trustedOrigins: ["http://localhost:3000"],
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["github", "google", "linear"]
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    socialProviders: {
        github: {
            scope: ["repo", "user:email"],
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            redirectURI: "http://localhost:3000/api/auth/callback/github",
            mapProfileToUser: profile => {
                return {
                    name: profile.login
                }
            }
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 30, // 30 days
        },
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24 * 3, // 1 day (every 1 day the session expiration is updated)
    },
    advanced: {
        useSecureCookies: true,
        defaultCookieAttributes: {
            secure: true
        }
    },
    plugins: [nextCookies()]
})

export type Session = typeof auth.$Infer.Session
