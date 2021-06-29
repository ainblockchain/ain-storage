//import Provider from './provider';
const Provider = require('./provider');

class Ain_Storage {

    #provider;
    /**
    * @param {string} providerUrl
    * @constructor
    */
    constructor(providedUrl) {
        this.#provider = new Provider(providedUrl);
    }

    /**
    * Sets a new provider
    * @param {string} providerUrl
    */
    setProvider(providedUrl) {
        this.#provider = new Provider(providedUrl);
    }

    /**
    * Upload a file with access policy
    * @param {string} path - a path containing a file in a cloud
    * @param {string} file - a file to be uploaded
    * @param {list} access - a list of IDs to be granted permission (ex. public keys for Workers)
    */
    uploadFile(path, file, ...access) {

    }

    /**
     * Download a file
     * @param {string} path a path containing a file in a cloud
     */
    downloadFile(path) {

    }

    /**
     * Set up a private key for later use of ain-storage
     * @param {string} keyPath a path containing a private key
     */
    setKey(keyPath) {

    }

}

module.exports = {Ain_Storage};