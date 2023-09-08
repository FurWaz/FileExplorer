import type express from 'express';
import * as sanitizer from '../tools/sanitizer';

class PaginationParameters {
    public offset: number;
    public limit: number;
    public total: number;

    constructor (offset: number, limit: number, total: number = 0) {
        this.offset = offset;
        this.limit = limit;
        this.total = total;
    }
}

export function getPaginationParameters (req: express.Request, res: express.Response): PaginationParameters {
    const offset = sanitizer.sanitizeNumberField(req.query.offset ?? 0, req, res);
    const limit = sanitizer.sanitizeNumberField(req.query.limit ?? 10, req, res);

    return new PaginationParameters(
        Math.max(offset ?? 0, 0),
        Math.max(Math.min(limit ?? 10, 20), 0)
    );
}

export function createPaginationResult (data: any[], paginationParameters: PaginationParameters): any {
    return {
        items: data,
        pagination: {
            offset: paginationParameters.offset,
            limit: paginationParameters.limit,
            total: paginationParameters.total
        }
    };
}
