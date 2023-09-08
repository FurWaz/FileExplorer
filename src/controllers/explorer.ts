import type express from 'express';
import { Log, ErrLog, ResLog } from '../tools/log';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();

interface ExplorerElement {
    name: string
    type: 'file' | 'folder'
}

const ROOT_FOLDER = env.FOLDER as string ?? '/home';

function getFullPath(req: express.Request): string {
    const path = decodeURIComponent(req.path);
    return ROOT_FOLDER + (path.startsWith('/') ? '' : '/') + (path.endsWith('/') ? path.slice(0, -1) : path);
}

async function getElement (path: string): Promise<ExplorerElement> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err !== undefined && err !== null) reject(new Error('Element not found'));
            else {
                resolve({
                    name: path.split('/').pop() as string,
                    type: stats.isDirectory() ? 'folder' : 'file'
                })
            }
        });
    });
}

async function listFolder (path: string): Promise<ExplorerElement[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err !== undefined && err !== null) reject(new Error('Error while reading folder'));
            else {
                const promises: Array<Promise<ExplorerElement>> = [];
                files.forEach((file) => {
                    promises.push(getElement(path + '/' + file));
                });
                Promise.all(promises).then((elements) => {
                    resolve(elements);
                }).catch(reject);
            }
        });
    });
}

export async function listElement (req: express.Request, res: express.Response) {
    const path = getFullPath(req);
    getElement(path).then((element) => {
        if (element.type === 'file') {
            new ResLog('', element, Log.CODE.OK).sendTo(res);
        } else {
            listFolder(path).then((elements) => {
                new ResLog('', {
                    name: getFullPath(req).split('/').pop(),
                    type: 'folder',
                    elements
                }, Log.CODE.OK).sendTo(res);
            }).catch((err) => {
                console.error(err);
                new ErrLog('Error: Cannot list folder', ErrLog.CODE.NOT_FOUND).sendTo(res);
            });
        }
    }).catch(err => {
        console.error(err);
        new ErrLog('Error: Cannot get element', ErrLog.CODE.NOT_FOUND).sendTo(res);
    });
}

export async function createElement (req: express.Request, res: express.Response) {
    const userId = res.locals.token.id;
    if (userId === null) {
        new ErrLog('', ErrLog.CODE.NOT_FOUND).sendTo(res);
        return;
    }

    new ResLog('', {}, Log.CODE.OK).sendTo(res);
}

export async function renameElement (req: express.Request, res: express.Response) {
    const userId = res.locals.token.id;
    if (userId === null) {
        new ErrLog('', ErrLog.CODE.NOT_FOUND).sendTo(res);
        return;
    }

    new ResLog('', {}, Log.CODE.OK).sendTo(res);
}

export async function deleteElement (req: express.Request, res: express.Response) {
    const userId = res.locals.token.id;
    if (userId === null) {
        new ErrLog('', ErrLog.CODE.NOT_FOUND).sendTo(res);
        return;
    }

    new ResLog('', {}, Log.CODE.OK).sendTo(res);
}
