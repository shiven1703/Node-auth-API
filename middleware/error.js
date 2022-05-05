const globalErrorHandler = (err, req, res, next) => {
  // handling JSON parse error
  if (err instanceof SyntaxError) {
    if (err.message.includes('JSON')) {
      return res.status(400).json({
        error: 'Invalid JSON received',
      })
    }
  }
  // unexpected errors
  console.log(err)
  res.status(500).json({
    error: 'Something went wrong...please try again',
  })
}

module.exports = globalErrorHandler
