import type express from 'express';
import { cp } from 'fs';

class Log {
    public static readonly CODE = {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAYEMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        NOT_ACCEPTABLE: 406,
        CONFLICT: 409,
        EXPECTATION_FAILED: 417,
        TEAPOT: 418,
        ENHANCE_YOUR_CALM: 420,
        TOO_MANY_REQUESTS: 429,
        TOKEN_EXPIRED: 498,
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501
    }

    protected readonly message: string;
    protected readonly code: number;

    constructor (message: string, code: number) {
        this.message = message;
        this.code = code;
    }

    getCode (): number {
        return this.code;
    }

    getMessage (): string {
        return this.message;
    }

    sendTo (res: express.Response): void {
        res.status(this.code).send(this.message);
    }

    isError (): boolean {
        return this.code >= 400;
    }
}

class ErrLog extends Log {
    protected readonly field: string;
    constructor (message: string, code: number = Log.CODE.BAD_REQUEST, field: string = '') {
        super(message, code);
        this.field = field;
    }

    override sendTo (res: express.Response<any, Record<string, any>>): void {
        const data: any = { message: this.message };
        if (this.field !== '') data.field = this.field;
        res.status(this.code).send(data);
    }
}

class ResLog extends Log {
    protected readonly data: any;
    constructor (message: string, data: any = {}, code: number = Log.CODE.OK) {
        super(message, code);
        this.data = data;
    }

    override sendTo (res: express.Response<any, Record<string, any>>): void {
        res.status(this.code).send({
            data: this.data,
            message: this.message
        });
    }
}

export { Log, ErrLog, ResLog };
