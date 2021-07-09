const assertParam = require('./utils/assert-param')

module.exports.create = config => {
    assertParam(config, 'provider')
    let provider = config.provider
    return require(`./adapters/${provider}.js`)
}
/*
module.exports.resolveOptions = config => {
    assertParam(config, 'provider')
    let provider = config.provider
    return require(`./adapters/${provider}-options.js`)
}
*/