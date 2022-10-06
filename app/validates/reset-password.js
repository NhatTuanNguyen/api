const util = require('util');
const notify = require(__path_configs+'notify');

const options = {
    password: {min: 4, max: 20},
}

module.exports = {
    validator: (req) =>{
        // password
        req.checkBody('password', util.format(notify.ERROR_LENGTH,options.password.min,options.password.max))
            .isLength(options.password.min, options.password.max);

        let message = {};
        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        errors.map((val,index) =>{
            message[val.param] = val.msg;
        });
        return message;
    }
}