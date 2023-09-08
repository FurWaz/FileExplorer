import type { User } from '@prisma/client';
import { prisma } from '../app';
import type { PrivateUser, PublicUser } from './type';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { Log, ResLog } from '../tools/log';

const portalRequests: Record<string, { time: number, user: PrivateUser | null }> = {};

const TOKEN_LIFETIME = 1000 * 60 * 15; // 15 min
const SECRET_KEY = process.env.SECRET_KEY as string;

export function createUserToken (id: number): string {
    const token = jwt.sign(
        { id },
        SECRET_KEY
    );
    return 'Bearer ' + token;
}

export function createUser (token: string): boolean {
    removeUselessPortalTokens();
    if (portalRequests[token] !== undefined) return false;
    portalRequests[token] = {
        time: Date.now(),
        user: null
    };
    return true;
}

export async function registerUser (token: string, user: any): Promise<User> {
    removeUselessPortalTokens();
    if (portalRequests[token] === undefined) {
        console.error('Token not found : ', token);
        throw new Error('Token not specified');
    }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete portalRequests[token];

    const dbUser = await prisma.user.findUnique({ where: { furwazId: user.id } });
    if (dbUser === null) {
        return await prisma.user.create({
            data: {
                furwazId: user.id
            }
        });
    } else {
        return dbUser;
    }
}

export function getUserFromPortalToken (token: string): any {
    removeUselessPortalTokens();
    if (portalRequests[token] === undefined) {
        console.error('Token not found : ', token);
        return null;
    }
    return portalRequests[token].user;
}

export async function getUserFromId (id: number): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
}

function removeUselessPortalTokens () {
    const now = Date.now();
    for (const token in portalRequests) {
        if (portalRequests[token].user === undefined && portalRequests[token].time + TOKEN_LIFETIME < now) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete portalRequests[token];
        }
    }
}

export function makePrivateUser (obj: any): PrivateUser {
    return {
        id: obj.id,
        furwazId: obj.furwazId,
        token: createUserToken(obj.id)
    };
}

export function makePublicUser (obj: any): PublicUser {
    return {
        id: obj.id,
        furwazId: obj.furwazId
    };
}
