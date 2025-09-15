const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Try again later.'
  }
  
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  // check for validation error
  if (err.name === "ValidationError") {
    console.log(Object.values(err.errors));
    // parse for message property within errors (default error message INTERNAL_SERVER_ERROR)
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',');
    customError.statusCode = 400;
  }
  //duplicate error when registering a new user
  if (err.code && err.code === 11000) {
    // Object.keys -> array of keys
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please choose another value`;
    customError.statusCode = 400;//bad request
  }

  // cast error
  if (err.name === 'CastError') {
     customError.msg = `No item found with id ${err.value}`;
     customError.statusCode = 404;//not found
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware
