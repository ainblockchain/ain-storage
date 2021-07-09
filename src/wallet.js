const ainUtil = require('@ainblockchain/ain-util')

/**
 * Derive an account(address,public key) from a private key
 * @param {String} privateKey 
 * @return {Strings} address, private_key, public_key 
 */
function fromPrivateKey(privateKey) {
    let buf_privateKey = Buffer.from(privateKey)
    let publicKey = ainUtil.privateToPublic(buf_privateKey)
    return {
        address : ainUtil.toChecksumAddress(ainUtil.bufferToHex(ainUtil.pubToAddress(publicKey))),
        privateKey : buf_privateKey.toString('hex'),
        publicKey : publicKey.toString('hex')
    }
}

/**
 * Sign a string data with the private key
 * @param {any} data 
 * @return {String} signature
 */
function sign(data) {
    return ainUtil.ecSignMessage(data, Buffer.from(this.privateKey, 'hex'))
}
/**
 * Verify if the signature is valid and was signed by the address
 * @param {any} data 
 * @param {String} signature 
 * @return {boolean} valid or not
 */
function verifySignature(data, signature) {
    return ainUtil.ecVerifySig(data, signature, this.address)
}
/**
 * Set private key for this module with address and public key derived from it
 * @param {String} privateKey 
 */
function setKey(privateKey) {
    let {rAddress, rPrivateKey, rPublicKey} = fromPrivateKey(privateKey)
    this.address = rAddress
    this.privateKey = rPrivateKey
    this.publicKey = rPublicKey
    console.log(rAddress)
}

module.exports = { 
    setKey , sign, verifySignature,
}