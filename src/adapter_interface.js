const assertParam = require('./utils/assert-param')

module.exports.create = config=>{
  assertParam(config.adapter, 'provider')
  let provider = config.adapter.provider
  return require(`./adapters/${provider}.js`);
}