const httpError = require('http-errors')
const XHubSignature = require('x-hub-signature')

const defaults = {
  require: true,
  algorithm: 'sha1',
  header: 'X-Hub-Signature',
  getRawBody: req => req.rawBody
}

module.exports = function verifyXHubSignature (options) {
  const config = Object.assign({}, defaults, options)
  const x = new XHubSignature(config.algorithm, config.secret)

  if (typeof config.getRawBody !== 'function') {
    throw new Error('x-hub-signature middleware: "getRawBody" must be a function')
  }

  return function (req, res, next) {
    const rawBody = config.getRawBody(req)
    if (!rawBody) {
      return next(httpError(500, 'Missing req.rawBody, see the x-hub-signature readme'))
    }

    const signature = req.header(config.header)

    if (config.require && !signature) {
      return next(httpError(400, `Missing ${config.header} header`))
    }

    if (signature) {
      const body = Buffer.from(rawBody)

      if (!x.verify(signature, body)) {
        return next(httpError(400, `Invalid ${config.header}`))
      }
    }

    next()
  }
}
