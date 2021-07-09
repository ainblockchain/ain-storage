const filter = require('filter-object')
const Firebase = require('./firebase')
const assertParam = require('../utils/assert-param')
 
module.exports = (defaultOptions, options) =>  {
    const opts = Object.assign({}, defaultOptions, options)

    const firebaseKeys = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket', 
        'messagingSenderId',
        'appId',
        'measurementId' ,
        'appName',      // is it necessary?!
    ]

    const firebaseOpts = filter(opts, firebaseKeys)
    const firebaseAdapter = opts.firebase || module.exports.FirebaseAdapter(firebaseOpts)

    // storage Reference Path
    if (opts.validate !== false) {
        assertParam(opts, 'path')
    }

    // file?!..
}
module.exports.FirebaseAdapter = FirebaseAdapter