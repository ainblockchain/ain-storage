/*
//import axios from 'axios';
const axios = require('axios');

module.exports = {
    getGitUser(user) {
      return axios
       .get(`https://api.github.com/users/${user}`)
       .then((result) => result.data)
       .catch((err) => console.err(err));
      }
   };
*/
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
    uploadFile(path, filename, options) {
      apdater_client.upload(path, file, access).then()
    },
    downloadFile(name, options) {
      adapter_client.download(path).then( data => {

      })
    },
    setKey(privateKey) {
      wallet.setKey(privateKey)
    }
  }
}


