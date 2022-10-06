var errorResponse = require(__path_utils + 'error-response');
var notify = require(__path_configs + 'notify');

function errorHandler (err, req, res, next) {
  let error = err;
  console.log(error.name);

  if(error.name === 'CastError') {
    let message = notify.CAST_ERROR;
    error = new errorResponse(404, message);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'SEVERE ERROR',
  })
}

module.exports = errorHandler;