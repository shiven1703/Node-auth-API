const globalErrorHandler = (err, req, res, next) => {
  // handling JSON parse error
  if (err instanceof SyntaxError) {
    if (err.message.includes('JSON')) {
      return res.status(400).json({
        error: 'Bad Request',
        msg: 'Invalid JSON received',
      })
    }
  }
  // unexpected errors
  res.status(500).json({
    msg: 'Something went wrong...please try again',
  })
}

module.exports = globalErrorHandler
