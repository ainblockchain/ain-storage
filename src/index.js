const adapter_interface = require('./adapter_interface')
const wallet = require('./wallet')
const assertParam = require('./utils/assert-param')

module.exports = config => {
  assertParam(config, 'adapter')
  const adapterClient = adapter_interface.create(config.adapter)
  
  return {
    uploadFile(file, options) {
      apdaterClient.upload(file, options)
    },

    downloadFile(path, options) {
      apdaterClient.download(path, options).then(data => {
      })
    },

    setKey(privateKey) {
      wallet.setKey(privateKey)
    }
  };
}