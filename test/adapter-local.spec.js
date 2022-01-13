const fs = require('fs')
const { expect } = require('chai')
const { execSync } = require('child_process')

const rootPath = require('app-root-path')
const reqlib = rootPath.require

const adapter = reqlib('/src/adapters/local')

const wallet = reqlib('/src/wallet')
const { encryptionManager } = reqlib('/src/encryption-manager')

describe('local adapter', () => {
  const dataOwnerPrivateKey = "12345678901234567890123456789012"
  const workerPrivateKey = "00856789012345678901234567890123"
  const workerSelectorPrivateKey = "12300856789012345678901234567890"

  const srcFileDiractoryPath = `${rootPath}/test/data/src`
  const dstFileDiractoryPath = `${rootPath}/test/data/dst`

  const srcFileName = "test.txt"
  const dstFileName = "uploaed_test.txt"
  const downloadFileName = "download_test.txt"

  const srcEncryptedFileName = "enc_test.txt"
  const dstEncryptedFileName = "enc_uploaed_test.txt"
  const downloadEncryptedFileName = "enc_download_test.txt"

  let client = {}

  let dataOwnerWallet = {}
  let workerSelectorWallet = {}
  let workerWallet = {}
  
  let reEncryptionKey = null
  let encryptedReEncryptionKey = null
  let decryptedReEncryptionKey = null

  before(async () => {
    encryptionManager.init({g: 'a', h: 'b'})
    dataOwnerWallet = await wallet.setPreKey(dataOwnerPrivateKey)
    workerSelectorWallet = await wallet.setPreKey(workerSelectorPrivateKey)
    workerWallet = await wallet.setPreKey(workerPrivateKey)

    execSync(`rm -rf ${srcFileDiractoryPath}`)
    execSync(`rm -rf ${dstFileDiractoryPath}`)

    execSync(`mkdir -p ${srcFileDiractoryPath}`)
    execSync(`mkdir -p ${dstFileDiractoryPath}`)

    execSync(`echo 'testfile' > ${srcFileDiractoryPath}/${srcFileName}`)
    execSync(`echo 'testfile' > ${srcFileDiractoryPath}/${srcEncryptedFileName}`)

    client = adapter({provider:'local', path: dstFileDiractoryPath})
  })

  after(() => {
    // execSync(`rm -rf ${rootPath}/test/data`)
  })

  describe('Uploading and downloading a normal file', () => {
    it('Upload a file ', async () => {
      const textFile = fs.readFileSync(`${srcFileDiractoryPath}/${srcFileName}`)
      const options = {
        path: '.',
        filename: dstFileName
      } 
      await client.upload(textFile, options)

      const testfile = fs.readFileSync(`${dstFileDiractoryPath}/${dstFileName}`, 'utf8')
      expect(testfile).to.equal('testfile\n')
    })

    it('Downlad a file', async () => {
      const downloadPath = `${srcFileDiractoryPath}/${downloadFileName}`
      const options = {
        destPath: downloadPath
      }

      const srcPath = `./${dstFileName}`
      await client.download(srcPath, options)
      
      const testfile = fs.readFileSync(`${downloadPath}`, 'utf8')
      expect(testfile).to.equal('testfile\n')
    })
  })

  describe('Uploading and downloading a encrypted file', () => {
    it('Upload an encrypted file', async () => {
      const textFile = fs.readFileSync(`${srcFileDiractoryPath}/${srcEncryptedFileName}`)

      const secretKey = encryptionManager.encrypter.generateSecretKey()

      const options = {
        path: '.',
        filename: dstEncryptedFileName,
        doEncrypt: true,
        encryptionInfo: {
          secretKey: secretKey,
          publicKey: dataOwnerWallet.g1PublicKey
        }
      } 
      await client.upload(textFile, options)
    })

    it('Downlad the encrypted file', async () => {
      const downloadPath = `${srcFileDiractoryPath}/${downloadEncryptedFileName}`
      const reEncryptionKey = await encryptionManager.encrypter.generateReEncryptionKey(dataOwnerWallet.privateKey, workerWallet.g2PublicKey)
      const options = {
        destPath: downloadPath,
        isEncrypted: true,
        decryptionInfo: {
          privateKey: workerWallet.privateKey,
          reEncryptionKey: reEncryptionKey
        }
      }

      const srcPath = `./${dstEncryptedFileName}`
      await client.download(srcPath, options)
      
      const testfile = fs.readFileSync(`${downloadPath}`, 'utf8')
      expect(testfile).to.equal('testfile\n')
    })
  })

  describe('Uploading and downloading a encrypted file with worker selector', () => {
    it('Upload an encrypted file', async () => {
      const textFile = fs.readFileSync(`${srcFileDiractoryPath}/${srcEncryptedFileName}`)

      const secretKey = encryptionManager.encrypter.generateSecretKey()

      const options = {
        path: '.',
        filename: dstEncryptedFileName,
        doEncrypt: true,
        encryptionInfo: {
          secretKey: secretKey,
          publicKey: dataOwnerWallet.g1PublicKey
        }
      } 
      await client.upload(textFile, options)
    })

    it('Generate re-encryption key and encrypt the key', async () => {
      reEncryptionKey = await encryptionManager.encrypter.generateReEncryptionKey(dataOwnerWallet.privateKey, workerWallet.g2PublicKey)
      encryptedReEncryptionKey = await encryptionManager.encrypter.encryptReEncryptionKey(workerSelectorWallet.g3PublicKey, reEncryptionKey)
    })

    it('Decrypt the encrypted re-encryption key', async () => {
      decryptedReEncryptionKey = await encryptionManager.decrypter.decryptReEncryptionKey(workerSelectorWallet.privateKey, encryptedReEncryptionKey)
    })

    it('Downlad the encrypted file', async () => {
      const downloadPath = `${srcFileDiractoryPath}/${downloadEncryptedFileName}`
      
      const options = {
        destPath: downloadPath,
        isEncrypted: true,
        decryptionInfo: {
          privateKey: workerWallet.privateKey,
          reEncryptionKey: decryptedReEncryptionKey
        }
      }

      const srcPath = `./${dstEncryptedFileName}`
      await client.download(srcPath, options)
      
      const testfile = fs.readFileSync(`${downloadPath}`, 'utf8')
      expect(testfile).to.equal('testfile\n')
    })
  })
})