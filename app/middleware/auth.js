var asyncHandler = require(__path_middleware + 'async');
var systemConfig = require(__path_configs + 'system');
const userModel = require(__path_models + 'users');
var errorResponse = require(__path_utils + 'error-response');
var jwt = require('jsonwebtoken');

// Login authentication
exports.protect =asyncHandler(async function(req, res, next){
  let token='';
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
  } else if(req.cookies.token) {
    token = req.cookies.token;
  }
  if(!token) return next(new errorResponse(401,'Vui lòng đăng nhập tài khoản'))
  
  try {
    // decode
    const decoded = jwt.verify(token,systemConfig.JWT_SECRET);
    req.user = await userModel.listItems({id: decoded.id},'one');
    next();
  } catch (err) {
    // console.log(err);
    next(new errorResponse(401,'Vui lòng đăng nhập tài khoản'));
  }
})

// Access authorization
exports.authorize = function(...roles){
  return function(req, res, next){
    if(!roles.includes(req.user.role)){
      return next(new errorResponse(401,'Bạn không có quyền truy cập'));
    }
    next();
  }
}