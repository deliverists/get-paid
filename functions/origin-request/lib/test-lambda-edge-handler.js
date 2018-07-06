const assert = (handler, uri, host) => assertion => {
  const mockCallback = jest.fn().mockImplementation((something, request) => {
    assertion(request)
  })

  const event = {
    Records: [
      {
        cf: {
          request: {
            uri,
            headers: {
              host: [{ key: 'Host', value: host }]
            }
          }
        }
      }
    ]
  }
  handler(event, {}, mockCallback)

  expect(mockCallback).toHaveBeenCalled()
}

module.exports = handler => ({
  withUri: uri => ({
    andAssert: assert(handler, uri, 'x.com'),
    andHost: host => ({
      andAssert: assert(handler, uri, host)
    })
  })
})
