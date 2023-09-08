import type express from 'express';
import properties from '../properties.json';
import { Log, ErrLog } from '../tools/log';

module.exports = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.locals.user === undefined) {
        console.error('User is undefined in admin middleware');
        new ErrLog(res.locals.lang.error.generic.internalError, Log.CODE.INTERNAL_SERVER_ERROR).sendTo(res);
        return;
    }

    if (res.locals.user.level < properties.role.admin) {
        new ErrLog(res.locals.lang.error.generic.notEnoughPerms, Log.CODE.FORBIDDEN).sendTo(res);
        return;
    }

    next();
};
