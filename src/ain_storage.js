//import Provider from './provider';
const Provider = require('./provider');

class Ain_Storage {

    #provider;

    constructor(providedUrl) {
        this.#provider = new Provider(providedUrl);
    }

    setProvider(providedUrl) {
        this.#provider = new Provider(providedUrl);
    }


    uploadFile(path, file, ...access) {

    }

    downloadFile(path) {

    }

    setKey(keyPath) {

    }

}

module.exports = {Ain_Storage};