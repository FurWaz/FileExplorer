import jwt from 'jsonwebtoken';
import type express from 'express';
import { ErrLog, Log } from '../tools/log';
import fetch from 'node-fetch';

const API_URL = 'https://main.apis.furwaz.fr';

module.exports = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authToken = req.headers.authorization;
    if (authToken === undefined) {
        new ErrLog('Error: Token is missing', Log.CODE.UNAUTHORIZED).sendTo(res);
        return;
    }

    fetch(API_URL + '/auth/verify?token=' + authToken).then(async (response) => {
        const json = await response.json();
        if (json.data === undefined || json.data === null) {
            new ErrLog('Error: Token is invalid', Log.CODE.FORBIDDEN).sendTo(res);
            return;
        }
        const decoded = json.data as object;
        if (decoded === undefined) {
            new ErrLog('Error: Token is invalid', Log.CODE.FORBIDDEN).sendTo(res);
            return;
        }

        res.locals.token = decoded;
        next();
    }).catch(err => {
        console.error(err);
        new ErrLog('Error: FurWaz API Call Error', Log.CODE.INTERNAL_SERVER_ERROR).sendTo(res);
    });
};
