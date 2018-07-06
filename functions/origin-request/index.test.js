const { handler } = require('./index')
const testHandler = require('lib/test-lambda-edge-handler')

describe('origin request handler', () => {
  ;[
    { uri: 'something.js', expected: 'something.js' },
    { uri: 'something', expected: 'something.html' },
    { uri: 'over/the/rainbow.png', expected: 'over/the/rainbow.png' },
    { uri: 'over/the/rainbow', expected: 'over/the/rainbow.html' }
  ].forEach(testData => {
    it('adds .html when no file extension, adds nothing when extension present', () => {
      testHandler(handler)
        .withUri(testData.uri)
        .andAssert(request => expect(request.uri).toEqual(testData.expected))
    })
  })

  it('url is empty then add /index.html', () => {
    testHandler(handler)
      .withUri('')
      .andAssert(request => expect(request.uri).toEqual('/index.html'))
  })

  it('url is / then add index.html', () => {
    testHandler(handler)
      .withUri('/')
      .andAssert(request => expect(request.uri).toEqual('/index.html'))
  })

  it('url is index.html then redirect to "/"', () => {
    testHandler(handler)
      .withUri('index.html')
      .andAssert(request => {
        expect(request.status).toEqual('301')
        expect(request.headers.location[0].value).toEqual('/')
      })
  })

  it('url is /index.html then redirect to "/"', () => {
    testHandler(handler)
      .withUri('/index.html')
      .andAssert(request => {
        expect(request.status).toEqual('301')
        expect(request.headers.location[0].value).toEqual('/')
      })
  })

  it('url ends in /index.html redirects to url without index', () => {
    testHandler(handler)
      .withUri('a/url/index.html')
      .andAssert(request => {
        expect(request.status).toEqual('301')
        expect(request.headers.location[0].value).toEqual('a/url')
      })
  })

  it('url ends in /x.html redirects to url without extension', () => {
    testHandler(handler)
      .withUri('a/url/x.html')
      .andAssert(request => {
        expect(request.status).toEqual('301')
        expect(request.headers.location[0].value).toEqual('a/url/x')
      })
  })

  it('trailing slash redirects to no trailing slash', () => {
    testHandler(handler)
      .withUri('a/url/')
      .andAssert(request => {
        expect(request.status).toEqual('301')
        expect(request.headers.location[0].value).toEqual('a/url')
      })
  })

  it('any capital letters redirect to lowercase version of url', () => {
    testHandler(handler)
      .withUri('a/Url')
      .andAssert(request => {
        expect(request.status).toEqual('301')
        expect(request.headers.location[0].value).toEqual('a/url')
      })
  })

  it('both trailing slashes and uppercase are dealt with', () => {
    testHandler(handler)
      .withUri('a/Url/')
      .andAssert(request => {
        expect(request.status).toEqual('301')
        expect(request.headers.location[0].value).toEqual('a/url')
      })
  })

  it('301 redirects set the cache header to 10 seconds publicly', () => {
    testHandler(handler)
      .withUri('a/url/')
      .andAssert(request => {
        expect(request.headers['cache-control'][0].value).toEqual(
          'public, max-age=10'
        )
      })
  })
})
