import type express from 'express';
import properties from '../properties.json';
import { Log, ErrLog } from './log';

/**
 * Check if the pseudo is in a valid format
 * If the pseudo is not valid, send an error message to the client
 * @param pseudo pseudo to check
 * @param req Express request
 * @param res Express response
 * @returns true if the pseudo is valid, false otherwise
 */
function checkPseudoField (pseudo: any, req: express.Request, res: express.Response): boolean {
    if (pseudo === undefined || pseudo === '') {
        new ErrLog(res.locals.lang.error.pseudo.required, Log.CODE.BAD_REQUEST, 'pseudo').sendTo(res);
        return false;
    }
    if (typeof pseudo !== 'string') {
        new ErrLog(res.locals.lang.error.pseudo.type, Log.CODE.BAD_REQUEST, 'pseudo').sendTo(res);
        return false;
    }
    if (pseudo.length < 2 || pseudo.length > 64) {
        new ErrLog(res.locals.lang.error.pseudo.length, Log.CODE.EXPECTATION_FAILED, 'pseudo').sendTo(res);
        return false;
    }
    return true;
}

/**
 * Check if the id is in a valid format
 * If the id is not valid, send an error message to the client
 * @param id Id to check
 * @param req Express request
 * @param res Express response
 * @returns true if the id is valid, false otherwise
 */
function checkIdField (id: any, req: express.Request, res: express.Response): boolean {
    if (id === undefined || id === '') {
        new ErrLog(res.locals.lang.error.id.required, Log.CODE.BAD_REQUEST, 'id').sendTo(res);
        return false;
    }
    if (typeof id !== 'number') {
        new ErrLog(res.locals.lang.error.id.type, Log.CODE.BAD_REQUEST, 'id').sendTo(res);
        return false;
    }

    return true;
}

/**
 * Check if the password is in a valid format
 * If the password is not valid, send an error message to the client
 * @param password Password to check
 * @param req Express request
 * @param res Express response
 * @returns true if the password is valid, false otherwise
 */
function checkPasswordField (password: any, req: express.Request, res: express.Response): boolean {
    if (password === undefined || password === '') {
        new ErrLog(res.locals.lang.error.password.required, Log.CODE.BAD_REQUEST, 'password').sendTo(res);
        return false;
    }
    if (typeof password !== 'string') {
        new ErrLog(res.locals.lang.error.password.type, Log.CODE.BAD_REQUEST, 'password').sendTo(res);
        return false;
    }
    if (password.length < properties.password.min) {
        new ErrLog(res.locals.lang.error.password.length, Log.CODE.EXPECTATION_FAILED, 'password').sendTo(res);
        return false;
    }
    const upper = password.match(/[A-Z]/g);
    if (upper === null || upper.length < properties.password.upper) {
        new ErrLog(res.locals.lang.error.password.upper, Log.CODE.EXPECTATION_FAILED, 'password').sendTo(res);
        return false;
    }
    const lower = password.match(/[a-z]/g);
    if (lower === null || lower.length < properties.password.lower) {
        new ErrLog(res.locals.lang.error.password.lower, Log.CODE.EXPECTATION_FAILED, 'password').sendTo(res);
        return false;
    }
    const number = password.match(/[0-9]/g);
    if (number === null || number.length < properties.password.number) {
        new ErrLog(res.locals.lang.error.password.number, Log.CODE.EXPECTATION_FAILED, 'password').sendTo(res);
        return false;
    }
    const special = password.match(/[^A-Za-z0-9]/g);
    if (special === null || special.length < properties.password.special) {
        new ErrLog(res.locals.lang.error.password.special, Log.CODE.EXPECTATION_FAILED, 'password').sendTo(res);
        return false;
    }
    return true;
}

/**
 * Check if the level is in a valid format
 * If the level is not valid, send an error message to the client
 * @param level Level to sanitize
 * @param req Express request
 * @param res Express response
 * @returns true if the level is valid, false otherwise
 */
function checkRoleField (level: any, req: express.Request, res: express.Response): boolean {
    if (level === undefined || level === '') {
        new ErrLog(res.locals.lang.error.level.required, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    if (typeof level !== 'number') {
        new ErrLog(res.locals.lang.error.level.type, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    if (res.locals.user.level <= level) {
        new ErrLog(res.locals.lang.error.level.tooHigh, Log.CODE.EXPECTATION_FAILED).sendTo(res);
        return false;
    }
    return true;
}

/**
 * Check if a boolean field is valid
 * If the boolean is not valid, send an error message to the client
 * @param value Value to sanitize
 * @param req Express request
 * @param res Express response
 * @returns true if the value is valid, false otherwise
 */
function checkBooleanField (value: any, req: express.Request, res: express.Response): boolean {
    if (value === undefined || value === '') {
        new ErrLog(res.locals.lang.error.boolean.required, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    if (typeof value !== 'boolean') {
        new ErrLog(res.locals.lang.error.boolean.type, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    return true;
}

/**
 * Check if a date is in a valid format
 * If the date is not valid, send an error message to the client
 * @param date Date to check
 * @param req Express request
 * @param res Express response
 * @returns true if the date is valid, false otherwise
 */
function checkDateField (date: any, req: express.Request, res: express.Response): boolean {
    if (date === undefined || date === '') {
        new ErrLog(res.locals.lang.error.date.required, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    if (isNaN(new Date(date).getTime())) {
        new ErrLog(res.locals.lang.error.date.invalid, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    return true;
}

/**
 * Check if a phone number is in a valid format
 * If the phone is not valid, send an error message to the client
 * @param phone Phone to check
 * @param req Express request
 * @param res Express response
 * @returns true if the phone is valid, false otherwise
 */
function checkPhoneField (phone: any, req: express.Request, res: express.Response): boolean {
    if (phone === undefined || phone === '') {
        new ErrLog(res.locals.lang.error.phone.required, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    if (typeof phone !== 'string') {
        new ErrLog(res.locals.lang.error.phone.type, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    const num = phone.replace(/(\.|\s|-)/g, '').trim();
    if (num.match(/^((00[0-9]{2})?0[0-9][0-9]{8}|\+[0-9]{11,12})$/) === null) {
        new ErrLog(res.locals.lang.error.phone.invalid, Log.CODE.EXPECTATION_FAILED).sendTo(res);
        return false;
    }
    return true;
}

/**
 * Checks the id of a user is in a valid format
 * @param id id to check
 * @param req Express request
 * @param res Express response
 * @returns true if the id is valid, false otherwise
 */
function checkNumberField (nbr: any, req: express.Request, res: express.Response): boolean {
    if (nbr === undefined || nbr === '' || nbr === null) {
        new ErrLog(res.locals.lang.error.number.required, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }

    if (typeof nbr !== 'number') {
        new ErrLog(res.locals.lang.error.number.type, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }

    if (isNaN(Number(nbr))) {
        new ErrLog(res.locals.lang.error.number.type, Log.CODE.EXPECTATION_FAILED).sendTo(res);
        return false;
    }

    return true;
}

/**
 * Check if a string field is valid
 * If the string is not valid, send an error message to the client
 * @param value Value to sanitize
 * @param req Express request
 * @param res Express response
 * @returns true if the value is valid, false otherwise
 */
function checkStringField (value: any, req: express.Request, res: express.Response): boolean {
    if (value === undefined || value === '' || value === null) {
        new ErrLog(res.locals.lang.error.string.required, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    if (typeof value !== 'string') {
        new ErrLog(res.locals.lang.error.string.type, Log.CODE.BAD_REQUEST).sendTo(res);
        return false;
    }
    return true;
}

/**
 * Check if a string field is valid
 * If the string is not valid, send an error message to the client
 * @param value Value to sanitize
 * @param req Express request
 * @param res Express response
 * @returns true if the value is valid, false otherwise
 */
function checkNameField (value: any, req: express.Request, res: express.Response): boolean {
    if (!checkStringField(value, req, res)) return false;
    if (value.match(/^[a-zA-ZÀ-ÿ- ]+$/) === null) {
        new ErrLog(res.locals.lang.error.name.invalid, Log.CODE.EXPECTATION_FAILED).sendTo(res);
        return false;
    }
    return true;
}

export {
    checkPseudoField,
    checkIdField,
    checkPasswordField,
    checkRoleField,
    checkBooleanField,
    checkDateField,
    checkPhoneField,
    checkNumberField,
    checkStringField,
    checkNameField
};
