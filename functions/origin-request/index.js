const path = require('path')
const { pipe } = require('functional')
const redirect = require('redirect')

const rewriteRequestWithExtension = request => {
  const { uri } = request

  if (uri === '' || uri === '/') {
    request.uri = '/index.html'
    return request
  }

  if (!path.extname(uri)) {
    request.uri = `${uri}.html`
  }
  return request
}

const removeIndex = uri => {
  if (uri.endsWith('index.html')) return uri.substring(0, uri.length - 10)
  return uri
}

const removeHtmlExtension = uri => {
  if (uri.endsWith('.html')) return uri.substring(0, uri.length - 5)
  return uri
}

const removeTrailingSlashes = uri => {
  if (uri === '' || uri === '/') return uri
  if (RegExp('.*?/+$').test(uri)) return uri.replace(/(\/+)$/gm, '')
  return uri
}

const toLower = uri => uri.toLowerCase()

const createRedirectUrl = pipe(
  removeIndex,
  removeHtmlExtension,
  removeTrailingSlashes,
  toLower
)

exports.handler = (event, context, callback) => {
  const {
    request,
    request: { uri }
  } = event.Records[0].cf

  let newUri = createRedirectUrl(uri)

  if (newUri !== uri) {
    if (!newUri) newUri = '/'
    callback(null, redirect(newUri))
  } else {
    if (!request.uri) request.uri = '/'
    callback(null, rewriteRequestWithExtension(request))
  }
}
