module.exports = function extractRawBody (req, res, buf) {
  req.rawBody = buf
}
