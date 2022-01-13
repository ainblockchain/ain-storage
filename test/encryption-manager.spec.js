const fs = require('fs')
const { expect } = require('chai')
const reqlib = require('app-root-path').require
const { execSync } = require('child_process')
const rootPath = require('app-root-path')
const wallet = reqlib('/src/wallet')
const { encryptionManager } = reqlib('/src/encryption-manager')

describe('Encryption manager', () => {
  const dataOwnerPrivateKey = "12345678901234567890123456789012"
  const workerPrivateKey = "00856789012345678901234567890123"
  const workerSelectorPrivateKey = "12300856789012345678901234567890"
  
  const secretKey = "12031a36802a25c76a26696c1cb41d6b"
  let dataOwnerWallet = {}
  let workerSelectorWallet = {}
  let workerWallet = {}
  let encryptedFileObject = {}

  const fileDiractoryPath = `${rootPath}/test/data`
  const fileName = `test.txt`

  let encryptedSecretKey = null
  let reEncryptionKey = null
  let reEncryptedSecretKey = null
  let decryptedSecretKey = null

  before(async () => {
    encryptionManager.init({g: 'a', h: 'b'})
    dataOwnerWallet = await wallet.setPreKey(dataOwnerPrivateKey)
    workerSelectorWallet = await wallet.setPreKey(workerSelectorPrivateKey)
    workerWallet = await wallet.setPreKey(workerPrivateKey)

    execSync(`rm -rf ${fileDiractoryPath}`)
    execSync(`mkdir -p ${fileDiractoryPath}`)

    execSync(`echo 'testfile' > ${fileDiractoryPath}/${fileName}`)
  })

  it('Check to set and get data owner public key', async () => {
    encryptionManager.apiManager.setDataOwner(dataOwnerWallet.g1PublicKey)
    const checkDataOwnerPublicKey = encryptionManager.apiManager.getDataOwner(dataOwnerWallet.g1PublicKey)

    expect(checkDataOwnerPublicKey).to.equal(dataOwnerWallet.g1PublicKey)
    
    const checkDataOwnerPublicKeys = encryptionManager.apiManager.getDataOwners()

    expect(checkDataOwnerPublicKeys.indexOf(checkDataOwnerPublicKey)).to.not.equal(-1)
  })

  it('Check to set and get worker public key', async () => {
    encryptionManager.apiManager.setWorker(workerWallet.g2PublicKey)
    const checkWorkerPublicKey = encryptionManager.apiManager.getWorker(workerWallet.g2PublicKey)

    expect(checkWorkerPublicKey).to.equal(workerWallet.g2PublicKey)

    const checkWorkerPublicKeys = encryptionManager.apiManager.getWorkers()

    expect(checkWorkerPublicKeys.indexOf(checkWorkerPublicKey)).to.not.equal(-1)
  })

  it('Check to set and get worker selector public key', async () => {
    encryptionManager.apiManager.setWorkerSelector(workerSelectorWallet.g3PublicKey)
    const checkWorkerSelectorPublicKey = encryptionManager.apiManager.getWorkerSelector(workerSelectorWallet.g3PublicKey)

    expect(checkWorkerSelectorPublicKey).to.equal(workerSelectorWallet.g3PublicKey)

    const checkWorkerSelectorPublicKeys = encryptionManager.apiManager.getWorkerSelectors()

    expect(checkWorkerSelectorPublicKeys.indexOf(checkWorkerSelectorPublicKey)).to.not.equal(-1)
  })

  it('Check to generate valid secret key', async () => {
    const checkSecretKey = encryptionManager.encrypter.generateSecretKey()

    expect(checkSecretKey.startsWith('0')).to.equal(false)
    expect(checkSecretKey.length == 32).to.equal(true)
  })

  it('Check encrypt & decrypt a file', async () => {
    const testfile = fs.readFileSync(`${fileDiractoryPath}/${fileName}`, 'utf8')
    const encryptedFile = await encryptionManager.encrypter.encrypt(testfile, secretKey)
    encryptedFileObject = JSON.parse(encryptedFile)

    const result = encryptionManager.decrypter.decrypt(encryptedFileObject, secretKey)
    expect(result).to.equal('testfile\n')
  })

  it('Check encrypt & decrypt a secret key', async () => {
    encryptedSecretKey = await encryptionManager.encrypter.encryptSecretKey(secretKey, dataOwnerWallet.g1PublicKey)
    reEncryptionKey = await encryptionManager.encrypter.generateReEncryptionKey(dataOwnerWallet.privateKey, workerWallet.g2PublicKey)
    reEncryptedSecretKey = await encryptionManager.encrypter.reEncryptSecretKey(encryptedSecretKey, reEncryptionKey)
    decryptedSecretKey = await encryptionManager.decrypter.decryptSecretKey(workerWallet.privateKey, reEncryptedSecretKey)
    
    expect(decryptedSecretKey).to.equal(secretKey)
  })

  it('Check encrypt & decrypt a re-encryption key', async () => {
    const encryptedReEncryptionKey = await encryptionManager.encrypter.encryptReEncryptionKey(workerSelectorWallet.g3PublicKey, reEncryptionKey)
    const decryptedReEncryptionKey = await encryptionManager.decrypter.decryptReEncryptionKey(workerSelectorWallet.privateKey, encryptedReEncryptionKey)
    
    expect(decryptedReEncryptionKey).to.equal(reEncryptionKey)
  })

  it('Check full process', async () => {
    const testfile = fs.readFileSync(`${fileDiractoryPath}/${fileName}`, 'utf8')

    // 1. Generate secret key (data owner)
    const secretKey = encryptionManager.encrypter.generateSecretKey()

    // 2. Encrypt a file with the secret key (data owner)
    const encryptedFile = await encryptionManager.encrypter.encrypt(testfile, secretKey)
    encryptedFileObject = JSON.parse(encryptedFile)

    // 3. Encrypt the secret key (data owner)
    const encryptedSecretKey = await encryptionManager.encrypter.encryptSecretKey(secretKey, dataOwnerWallet.g1PublicKey)

    // 4. Generate re-encryption key for a worker (data owner)
    const reEncryptionKey = await encryptionManager.encrypter.generateReEncryptionKey(dataOwnerWallet.privateKey, workerWallet.g2PublicKey)

    // 5. Encrypt the re-encryption key with worker selector public key (data owner)
    const encryptedReEncryptionKey = await encryptionManager.encrypter.encryptReEncryptionKey(workerSelectorWallet.g3PublicKey, reEncryptionKey)

    // ----------------------------------------------------------------
    // 6. Decrypt the encrypted re-encryption key with worker selector private key (worker selector)
    const decryptedReEncryptionKey = await encryptionManager.decrypter.decryptReEncryptionKey(workerSelectorWallet.privateKey, encryptedReEncryptionKey)

    // 7. Re-encrypt the encrypted secret key with decrypted re-encryption key (worker)
    const reEncryptedSecretKey = await encryptionManager.encrypter.reEncryptSecretKey(encryptedSecretKey, decryptedReEncryptionKey)

    // 8. Decrypt the re-encrypted secret key (worker)
    const decryptedSecretKey = await encryptionManager.decrypter.decryptSecretKey(workerWallet.privateKey, reEncryptedSecretKey)

    // 9. Decrypt the secret key (worker)
    const result = encryptionManager.decrypter.decrypt(encryptedFileObject, decryptedSecretKey)

    expect(result).to.equal('testfile\n')
  })
  
  after(() => {
    execSync(`rm -rf ${rootPath}/test/data`)
  })
})