module.exports.create = config => {
    let provider = config.provider;
    return require(`./adapters/${provider}.js`)
}