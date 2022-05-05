const globalErrorHandler = (err, req, res, next) => {
  if (err.name === 'InvalidPayload') {
    return res.status(400).json({
      error: err.message,
    })
  } else if (err.name === 'DBValidationError') {
    return res.status(409).json({
      error: err.message,
    })
  } else if (err.name === 'InvalidUser') {
    return res.status(401).json({
      error: err.message,
    })
  } else if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: 'Invalid JSON received',
    })
  } else if (err.name === 'JwtError') {
    return res.status(401).json({
      error: err.message,
    })
  } else if (err.name === 'MissingHeader') {
    return res.status(400).json({
      error: err.message,
    })
  } else {
    // unexpected errors
    console.log(err)
    return res.status(500).json({
      error: 'Something went wrong...please try again',
    })
  }
}

module.exports = globalErrorHandler
