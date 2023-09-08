import type express from 'express';
import * as validator from './validator';
import { ErrLog, Log } from './log';

function sanitizeStringField (input: any, req: express.Request, res: express.Response): string | null {
    if (!validator.checkStringField(input, req, res)) return null;
    return input;
}

function sanitizeNumberField (input: any, req: express.Request, res: express.Response): number | null {
    if (input === undefined || input === '' || input === null) {
        new ErrLog(res.locals.error.number.required, Log.CODE.BAD_REQUEST).sendTo(res);
        return null;
    }
    if (typeof input === 'string') input = Number(input);
    if (!validator.checkNumberField(input, req, res)) return null;
    return input;
}

function sanitizeBooleanField (input: any, req: express.Request, res: express.Response): boolean | null {
    if (input === undefined || input === '' || input === null) {
        new ErrLog(res.locals.error.boolean.required, Log.CODE.BAD_REQUEST).sendTo(res);
        return null;
    }
    if (typeof input === 'string') input = Boolean(input);
    if (!validator.checkBooleanField(input, req, res)) return null;
    return input;
}

function sanitizePseudoField (input: any, req: express.Request, res: express.Response): string | null {
    const pseudo = sanitizeStringField(input, req, res);
    if (pseudo === null) return null;
    if (!validator.checkPseudoField(pseudo, req, res)) return null;
    return pseudo;
}

function sanitizeIdField (input: any, req: express.Request, res: express.Response): number | null {
    const id = sanitizeNumberField(input, req, res);
    if (id === null) return null;
    if (!validator.checkIdField(id, req, res)) return null;
    return id;
}

function sanitizePasswordField (input: any, req: express.Request, res: express.Response): string | null {
    const password = sanitizeStringField(input, req, res);
    if (password === null) return null;
    if (!validator.checkPasswordField(password, req, res)) return null;
    return password;
}

function sanitizeRoleField (input: any, req: express.Request, res: express.Response): number | null {
    const role = sanitizeNumberField(input, req, res);
    if (role === null) return null;
    if (!validator.checkRoleField(role, req, res)) return null;
    return role;
}

type CreatorFunction<Type> = (input: any) => Type;
function sanitizeBody<Type> (input: any, creator: CreatorFunction<Type>, req: express.Request, res: express.Response): Type | null {
    const obj = creator(input);
    if (obj === null) {
        new ErrLog(res.locals.error.body.invalid, Log.CODE.BAD_REQUEST).sendTo(res);
        return null;
    }
    for (const key in obj) {
        if (obj[key] === undefined) {
            new ErrLog(res.locals.error.body.required.replace('{value}', key), Log.CODE.BAD_REQUEST).sendTo(res);
            return null;
        }
    }
    return obj;
}

export {
    sanitizeNumberField,
    sanitizeStringField,
    sanitizeBooleanField,
    sanitizePseudoField,
    sanitizeIdField,
    sanitizePasswordField,
    sanitizeRoleField,
    sanitizeBody
}
