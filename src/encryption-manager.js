const crypto = require('crypto')
const Aes = require('aes-256-gcm')
const PRE = require('./lib/afgh_pre.js')

const eccrypto = require("eccrypto")
const bufferUtil = require('./utils/buffer')
const rootPath = require('app-root-path')
const reqlib = rootPath.require

const apiLocalAdapter = reqlib('/src/api-adapters/local')

const encryptionManager = {
  init: async (config) => {
    // TODO: PRE uses default curve as BLS12_381
    this.preParams = await PRE.init({g: config.g, h: config.h, returnHex: true})
  }
}

encryptionManager.apiManager = apiLocalAdapter()

encryptionManager.encrypter = {
  generateSecretKey: () => {
    let secretKey = ""
    do {
      secretKey = crypto.randomBytes(16).toString('hex')
    } while(secretKey.startsWith('0'))
    
    return secretKey
  },
  encrypt: (file, secretKey) => {
    const encryptedFile = Aes.encrypt(file, secretKey)
    return JSON.stringify(encryptedFile, null, 2)
  },
  encryptSecretKey: (secretKey, g1PublicKey) => {
    return PRE.enc(secretKey, g1PublicKey, this.preParams, {returnHex: true})
  },
  generateReEncryptionKey: (privateKey, g2PublicKey) => {
    return PRE.rekeyGen(privateKey, g2PublicKey, {returnHex: true})
  },
  encryptReEncryptionKey: async (g3PublicKey, reEncryptionKey) => {
    return await eccrypto.encrypt(Buffer.from(g3PublicKey, 'hex'), reEncryptionKey)
  },
  reEncryptSecretKey: (encryptedSecretKey, reEncryptionKey) => {
    return PRE.reEnc(encryptedSecretKey, reEncryptionKey, {returnHex: true})
  }
}

encryptionManager.decrypter = {
  decrypt: (encryptedFileObject, secretKey) => {
    const {ciphertext, iv, tag} = encryptedFileObject
    return Aes.decrypt(ciphertext, iv, tag, secretKey)
    // const decryptionKey = decrypter.decryptReEncryptedKey(privateKey, reEncryptedKey)
  },
  decryptSecretKey: (privateKey, reEncryptedSecretKey) => {
    return PRE.reDec(reEncryptedSecretKey, privateKey)
  },
  decryptReEncryptionKey: async (privateKey, encryptedReEncryptionKey) => {
    let reEncryptionKey = await eccrypto.decrypt(Buffer.from(privateKey, 'hex'), encryptedReEncryptionKey)
    return reEncryptionKey.toString()
  }
}

module.exports.encryptionManager = encryptionManager