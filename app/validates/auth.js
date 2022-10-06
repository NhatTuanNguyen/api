const util = require('util');
const notify = require(__path_configs+'notify');

const options = {
    username: {min: 5, max: 80},
    password: {min: 4, max: 20},
    enum: ['user']
}

module.exports = {
    validator: (req) =>{
        // User name
        req.checkBody('username', util.format(notify.ERROR_LENGTH,options.username.min,options.username.max))
            .isLength(options.username.min, options.username.max);

        // email
        req.checkBody('email', notify.ERROR_EMAIL)
            .matches (/^\w+([\. -] ?\w+)*@\w+([\. -] ?\w+)*(\.\w{2,3})+$/);

        // Role
        req.checkBody('role', notify.ERROR_ROLE)
            .isIn(options.enum)

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