var createError   = require('http-errors');
var express       = require('express');
var cors = require('cors');
var morgan = require('morgan');
var colors = require('colors');
const validator = require('express-validator');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');


var app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(validator());
app.use(cookieParser());

const pathConfig        = require('./path');
global.__base           = __dirname + '/';
global.__path_app       = __base + pathConfig.folder_app + '/';

global.__path_schemas   = __path_app + pathConfig.folder_schemas + '/';
global.__path_models    = __path_app + pathConfig.folder_models + '/';
global.__path_routers   = __path_app + pathConfig.folder_routers + '/';
global.__path_configs   = __path_app + pathConfig.folder_configs + '/';
global.__path_middleware   = __path_app + pathConfig.folder_middleware + '/';
global.__path_validates  = __path_app + pathConfig.folder_validates+ '/';
global.__path_data  = __path_app + pathConfig.folder_data+ '/';
global.__path_utils  = __path_app + pathConfig.folder_utils+ '/';



const systemConfig    = require(__path_configs + 'system');
var errorHandler = require(__path_middleware + 'error');
const databaseConfig  = require(__path_configs + 'database');

// Local variable
app.locals.systemConfig = systemConfig;
// connect mongodb
main().catch(err => console.log('err'));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/api');
  // await mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.t6pff.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`);
  console.log('connect success'.yellow);
}


// Setup router
app.use('/api/v1/', require(__path_routers));
app.use(errorHandler)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.end('Error App');
// });

module.exports = app;

