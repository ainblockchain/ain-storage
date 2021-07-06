const adapter_interface = require('./adapter_interface')
const wallet = require('./wallet')

module.exports = config => {
  const defaults = {
    adapter : {
      provider : 'local',
      path : process.cwd(),
    }
  }

  config = Object.assign({}, defaults, config);
  const adapter_client = adapter_interface.create(config.adapter)

  return {
    
    uploadFile(file, options)
      apdater_client.upload(file, options).then()
    },
    downloadFile(path, options) {
      adapter_client.download(path, options).then( data => {

      })
    },
    setKey(privateKey) {
      wallet.setKey(privateKey)
    }
  }
}


