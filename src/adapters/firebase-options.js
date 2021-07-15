const filter = require('filter-object')
const Firebase = require('./firebase')
const assertParam = require('../utils/assert-param')
const path = require('path')
 
module.exports = (defaultOptions, options)=>{
  const opts = Object.assign({}, defaultOptions, options)

  const firebaseKeys = [  // from firebase sdk
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket', 
    'messagingSenderId',
    'appId',
    'measurementId' ,
  ]

  // storage Reference Path
  if (opts.validate !== false) {
    assertParam(opts, 'path')
    opts.path = path.normalize(opts.path)
  }

  const contextKeys = ['appName'].concat(firebaseKeys)
  const context = Object.assign({ }, filter(opts, contextKeys))

  return Object.assign({}, {context});
}