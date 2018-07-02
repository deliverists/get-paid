const { handler } = require('./index')
const testHandler = require('test-lambda-edge-handler')

describe('viewer request redirects handler', () => {
  it('host get-paid.co.uk and url a/b redirects to https://get-paid.com/a/b', () => {
    testHandler(handler)
      .withUri('a/b')
      .andHost('get-paid.co.uk')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://get-paid.com/a/b')
        expect(request.status).toEqual('301')
      })
  })

  it('host get-paid.co.uk and url /a/b redirects to https://get-paid.com/a/b', () => {
    testHandler(handler)
      .withUri('/a/b')
      .andHost('get-paid.co.uk')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://get-paid.com/a/b')
        expect(request.status).toEqual('301')
      })
  })

  it('host get-paid.co.uk and url / redirects to https://get-paid.com', () => {
    testHandler(handler)
      .withUri('/')
      .andHost('get-paid.co.uk')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://get-paid.com')
        expect(request.status).toEqual('301')
      })
  })

  it('host get-paid.co.uk and url "" redirects to https://get-paid.com', () => {
    testHandler(handler)
      .withUri('')
      .andHost('get-paid.co.uk')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://get-paid.com')
        expect(request.status).toEqual('301')
      })
  })

  it('host a23dj9ffdja.cloudfront.net and url a/b redirects to https://get-paid.com/a/b', () => {
    testHandler(handler)
      .withUri('a/b')
      .andHost('a23dj9ffdja.cloudfront.net')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://get-paid.com/a/b')
        expect(request.status).toEqual('301')
      })
  })

  it('host www.get-paid.com and url a/b redirects to https://get-paid.com/a/b', () => {
    testHandler(handler)
      .withUri('a/b')
      .andHost('www.get-paid.com')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://get-paid.com/a/b')
        expect(request.status).toEqual('301')
      })
  })

  it('host get-paid.com and url a/b does not redirect', () => {
    testHandler(handler)
      .withUri('a/b')
      .andHost('get-paid.com')
      .andAssert(request => {
        expect(request.uri).toEqual('a/b')
        expect(request.status).not.toEqual('301')
      })
  })
})
