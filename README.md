# X-Hub-Signature tools for Node.js and Express

[![Build Status](https://app.travis-ci.com/compwright/x-hub-signature-middleware.svg?branch=master)](https://app.travis-ci.com/github/compwright/x-hub-signature-middleware)
[![Download Status](https://img.shields.io/npm/dm/x-hub-signature-middleware.svg?style=flat-square)](https://www.npmjs.com/package/x-hub-signature-middleware)
[![Sponsor on GitHub](https://img.shields.io/static/v1?label=Sponsor&message=❤&logo=GitHub&link=https://github.com/sponsors/compwright)](https://github.com/sponsors/compwright)

X-Hub-Signature is a compact way to validate real-time updates, such as webhooks from [Facebook](https://developers.facebook.com/docs/graph-api/webhooks/) and [GitHub](https://developer.github.com/webhooks/securing/).

Requires Node.js 16+

## Getting Started

To install:

```shell
npm install x-hub-signature-middleware --save
```

## Express Middleware

To validate incoming webhooks signed with `X-Hub-Signature`, use the bundled Express middleware.

```javascript
const { xHubSignatureMiddleware } = require('x-hub-signature');
app.use(xHubSignatureMiddleware({
  algorithm: 'sha1',
  secret: 'secret',
  require: true,
  getRawBody: req => req.rawBody
}));
```

**Options:**

* `algorithm` (required) - `sha1` or other desired signing algorithm
* `secret` (required) - signing secret that the webhook was signed with
* `require` (optional) - boolean, whether to require the presence of the `X-Hub-Signature` header. If true, throws an HTTP 400 error if the header is not present. If false, the middleware will pass the request on if the header is not present, and validate the header only if it is present. (default: `true`)
* `getRawBody` (optional) - function that accepts `req` as the first argument and returns the raw body. If you use the bundled body-parser verifier (see below), you don't need to set this option.
* `header` (optional) - the default header is `X-Hub-Signature`. For `sha256`, the header needs to be `X-Hub-Signature-256`.

### Use with body-parser

A very common case is to have [body-parser](https://github.com/expressjs/body-parser) middleware globally defined. This produces complications for the x-hub-signature middleware, since it needs a copy of the raw unparsed body, and `body-parser` by default does not save this on the request.

In this case, you can use the bundled `extractRawBody` verifier function with body-parser. This will set a reference to the buffered raw (unparsed) body to `req.rawBody`:

```javascript
const bodyParser = require('body-parser');
const {xHubSignatureMiddleware, extractRawBody} = require('x-hub-signature-middleware');
app.use(bodyParser.json({
  verify: extractRawBody
}))
app.use(xHubSignatureMiddleware({
  algorithm: 'sha1',
  secret: 'secret',
  require: true
}));
```

## License

MIT License

## Acknowledgements

This project was based on [express-x-hub](https://github.com/alexcurtis/express-x-hub) by Alex Curtis.
