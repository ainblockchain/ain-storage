const ainUtil = require('@ainblockchain/ain-util');
const PRE = require('./lib/afgh_pre')
const mcl = require('mcl-wasm')
const eccrypto = require('eccrypto')

// console.log(mcl)
// a = mcl.Fr()
// console.log(a)
// const preInitiatedParams = (async () => {
//   return await PRE.init({g: "a", h: "b", returnHex: true})
// })()

/**
 * Derive an account(address,public key) from a private key
 * @param {String} privateKey 
 * @return {Strings} address, private_key, public_key 
 */
function fromPrivateKey(privateKey) {
  let buf_privateKey = Buffer.from(privateKey)
  let publicKey = ainUtil.privateToPublic(buf_privateKey)
  return {
    address: ainUtil.toChecksumAddress(ainUtil.bufferToHex(ainUtil.pubToAddress(publicKey))),
    privateKey: buf_privateKey.toString('hex'),
    publicKey: publicKey.toString('hex')
  };
}

/**
 * Sign a string data with the private key
 * @param {any} data 
 * @return {String} signature
 */
function sign(data) {
  return ainUtil.ecSignMessage(data, Buffer.from(this.privateKey, 'hex'));
}

/**
 * Verify if the signature is valid and was signed by the address
 * @param {any} data 
 * @param {String} signature 
 * @return {boolean} valid or not
 */
function verifySignature(data, signature) {
  return ainUtil.ecVerifySig(data, signature, this.address);
}

/**
 * Set private key for this module with address and public key derived from it
 * @param {String} privateKey 
 */
async function setKey(privateKey) {
  let {rAddress, rPrivateKey, rPublicKey} = fromPrivateKey(privateKey)
  this.address = rAddress
  this.privateKey = rPrivateKey
  this.publicKey = rPublicKey
}

/**
 * Set pre private key for this module with public key of g1 and g2 derived from it
 * @param {String} privateKey 
 */
 async function setPreKey(privateKey) {
  preInitiatedParams = await PRE.init({g: "a", h: "b", returnHex: true})

  const fr = new mcl.Fr()
  // privateKey = eccrypto.generatePrivate().toString()
  // console.log(privateKey)
  fr.setStr(privateKey, '16')

  const preKey = {
    privateKey: fr.serializeToHexStr()
  }

  preKey.g1PublicKey = PRE.getPkFromG1(preKey.privateKey, preInitiatedParams.g, {returnHex: true})
  preKey.g2PublicKey = PRE.getPkFromG2(preKey.privateKey, preInitiatedParams.h, {returnHex: true})
  preKey.g3PublicKey = eccrypto.getPublic(Buffer.from(preKey.privateKey, 'hex')).toString('hex')

  return preKey
}

module.exports = { 
  setKey, setPreKey, sign, verifySignature,
}
