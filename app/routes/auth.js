var express = require('express');
var router = express.Router();
var asyncHandler = require(__path_middleware + 'async');
var systemConfig = require(__path_configs + 'system');
var { protect } = require(__path_middleware + 'auth');
var errorResponse = require(__path_utils+'error-response');

const controllerName = 'auth';
const mainModel = require(__path_models + controllerName);
const mainValidator = require(__path_validates + controllerName);
const resetPasswordValidator = require(__path_validates + 'reset-password');

router.post('/register', asyncHandler(async (req, res, next) => {
    let err = await validateReq(req, next)
    if (!err) {
        const token = await mainModel.create(req.body);
        if (token) {
            saveCookieResponse(res, 201, token);
        }
    }
}));

router.post('/login', asyncHandler(async (req, res, next) => {
    const token = await mainModel.login(req.body, res);
    if (token) {
        saveCookieResponse(res, 201, token);
    }
}));

router.post('/logout', protect, asyncHandler(async (req, res, next) => {
    res.status(200)
        .cookie('token', 'none', {
            expirers: new Date(
                Date.now() +10*1000
            ),
            httpOnly: true,
        })
        .json({
            success: true,
        });
}));

router.get('/me', protect, asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
}));

router.post('/forget-password', asyncHandler(async (req, res, next) => {
    const result = await mainModel.forgetPassword(req.body);
    if (!result) {
        res.status(401).json({
            success: true,
            message: 'Email không tồn tại'
        });
    }
    res.status(200).json({
        success: true,
        message: result,
    })
}));

router.post('/reset-password/:resetToken', asyncHandler(async (req, res, next) => {
    let err = await validateReq(req, next, resetPasswordValidator)
    if (!err) {
        const result = await mainModel.resetPassword({ resetToken: req.params.resetToken, password: req.body.password });
        if (!result) {
            res.status(401).json({
                success: true,
                message: 'Không tồn tại token'
            });
        }
        res.status(200).json({
            success: true,
            user: result,
        })
    }
}));

module.exports = router;

const validateReq = async (req, next, validate = mainValidator) => {
    let messageError = await validate.validator(req);
    if (Object.keys(messageError).length > 0) {
        next(new errorResponse(400, messageError));
        return true;
    }
    return false;
}

const saveCookieResponse = (res, statusCode, token) => {
    const options = {
        expirers: new Date(
            Date.now() + systemConfig.COOKIE_EXP * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}