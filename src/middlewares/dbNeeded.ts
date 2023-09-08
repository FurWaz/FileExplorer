import type express from 'express';
import { prisma } from '../app';
import { Log, ErrLog } from '../tools/log';

module.exports = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    prisma.$queryRaw`SELECT 1`
        .then(() => { next(); })
        .catch(() => {
            prisma.$connect()
                .then(() => { next(); })
                .catch((err: any) => {
                    console.error(err);
                    new ErrLog(
                        'Error: Cannot connect to database',
                        Log.CODE.INTERNAL_SERVER_ERROR
                    ).sendTo(res);
                });
        });
};
