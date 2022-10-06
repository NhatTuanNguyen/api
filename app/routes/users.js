var express = require('express');
var router = express.Router();
var asyncHandler = require(__path_middleware + 'async');
var errorResponse = require(__path_utils+'error-response');

const controllerName = 'users';
const mainModel = require(__path_models +controllerName);
const mainValidator = require(__path_validates +controllerName);

router.get('/', asyncHandler(async (req, res, next) => {
    const data = await mainModel.listItems(req.query, 'all');
    res.status(200).json({
        success: true,
        count: data.length,
        data: data
    });

}));

router.get('/:id', asyncHandler(async (req, res, next) => {
    var id = req.params.id;
    const data = await mainModel.listItems({ id }, 'one');
    res.status(200).json({
        success: true,
        data: data
    });
}));

router.post('/add', asyncHandler(async (req, res, next) => {
    let err = await validateReq(req, next)
    if (!err) {
        const data = await mainModel.create(req.body);

        res.status(201).json({
            success: true,
            data: data
        });
    }
}));

router.put('/edit/:id', asyncHandler(async (req, res, next) => {
    let err = await validateReq(req, next)

    if (!err) {
        const data = await mainModel.updateItems({ id: req.params.id, 'body': req.body }, 'one');
        res.status(200).json({
            success: true,
            data: data
        });
    }
}));

router.delete('/delete/:id', asyncHandler(async (req, res, next) => {
    var id = req.params.id;
    const data = await mainModel.deleteItems({ id }, 'one');
    res.status(200).json({
        success: true,
        data: data
    });
}));

module.exports = router;

const validateReq = async (req, next) => {
    let messageError = await mainValidator.validator(req);
    if (Object.keys(messageError).length > 0) {
        next(new errorResponse(400, messageError));
        return true;
    }
    return false;
}