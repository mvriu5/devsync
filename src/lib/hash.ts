"use server"

import argon2 from "argon2"

export async function hash(password: string) {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        timeCost: 3,
        memoryCost: 1 << 17, // ~131072 KiB (128 MiB)
        parallelism: 1,
    })
}

export async function verify(storedHash: string, password: string) {
    return await argon2.verify(storedHash, password);
}
