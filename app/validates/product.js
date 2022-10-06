const util = require('util');
const notify = require(__path_configs+'notify');

const options = {
    name: {min: 5, max: 80},
    description: {min: 10, max: 500},
}

module.exports = {
    validator: (req) =>{
        // Name
        req.checkBody('name', util.format(notify.ERROR_LENGTH,options.name.min,options.name.max))
            .isLength(options.name.min, options.name.max);
        // Description
        req.checkBody('description', util.format(notify.ERROR_LENGTH,options.description.min,options.description.max))
            .isLength(options.description.min, options.description.max);

        let message = {};
        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        errors.map((val,index) =>{
            message[val.param] = val.msg;
        });
        return message;
    }
}