const util = require('util');
const notify = require(__path_configs+'notify');

const options = {
    name: {min: 5, max: 80},
    title: {min: 10, max: 100},
}

module.exports = {
    validator: (req) =>{
        // Name
        req.checkBody('name', util.format(notify.ERROR_LENGTH,options.name.min,options.name.max))
            .isLength(options.name.min, options.name.max);
        // title
        req.checkBody('title', util.format(notify.ERROR_LENGTH,options.title.min,options.title.max))
            .isLength(options.title.min, options.title.max);

        let message = {};
        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        errors.map((val,index) =>{
            message[val.param] = val.msg;
        });
        return message;
    }
}