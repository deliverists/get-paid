const { STATUS_CODES } = require('http')

module.exports = uri => ({
  status: '301',
  statusDescription: STATUS_CODES['301'],
  headers: {
    'cache-control': [{ key: 'Cache-Control', value: 'public, max-age=10' }],
    location: [{ key: 'Location', value: uri }]
  }
})
