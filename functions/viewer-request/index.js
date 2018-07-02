const redirect = require('redirect')

const canonicalHost = 'get-paid.com'
const scheme = 'https://'

const setCanonicalHost = (host, uri) => {
  const separator = !uri || uri === '/' || uri.startsWith('/') ? '' : '/'
  const uriPart = uri === '/' ? '' : uri
  return host !== canonicalHost ? `${scheme}${canonicalHost}${separator}${uriPart}` : uri
}

exports.handler = (event, context, callback) => {
  const { request, request: { uri } } = event.Records[0].cf
  const host = request.headers.host[0].value

  const newUri = setCanonicalHost(host, uri)

  if (newUri !== uri) callback(null, redirect(newUri))
  else callback(null, request)
}
