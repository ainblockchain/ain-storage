const fs = require('fs')
const https = require('https')
const firebase = require('firebase/app')
require('firebase/storage')
global.XMLHttpRequest = require("xhr2")
const path = require('path')

const assertParam = require('../utils/assert-param')
const resolve = require('./firebase-options');
const { apiKey } = require('../../test/private/firebase_config');

module.exports = config => {
  const {context} = resolve(Object.assign(config, {validate:false}))
  let appName = context.appName
  if (appName == undefined) appName = context.appId

  let firebaseClient = {};
  if (!firebase.apps.find(el => el.name_ == appName)) {
    firebaseClient = firebase.initializeApp(context, appName)
    console.log(`${appName} Firebase initialized.`)
  } else {
    firebaseClient = firebase.app(appName)
  }

  return {
    /** 
     * upload file on Firebase storage.
     * @param file            File or blob object to be uploaded
     * @param options.path        relative path for a file to be uploaded
     * @param options.fileName      file name to be set 
     * @param options.dispatch      function to dispatch events during this process 
     * @param options.dispatchType    type defining progress of uploading a file
     * @param options.afterUploaded   async function to execute  when uploading is done
     */
    upload(file, options) {
      assertParam(options, "fileName")  // unless there's no file.filename
      
      const {
        dispatch,
        dispatchType,
        afterUploaded,
        fileName
      } = options

      const relativePath = path.normalize(`${options.path}/`)
      const ref = firebaseClient.storage().ref(`${relativePath}${fileName}`)

      if (options.doEncrypt) {
        const { encryptionInfo } = options
        file = await encrypter.encrypt(file, encryptionInfo.secretKey, encryptionInfo.g1PublicKey)
      }

      const uploadTask = ref.put(file)

      if (dispatch !== undefined && dispatchType !== undefined)
        uploadTask.on('state_changed', (snapshot) => {
          let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          dispatch({
            type : dispatchType,
            data: {
              progress
            }
          })
        })
      
      if (afterUploaded !== undefined) {
        try {
          return uploadTask.then(async (snapshot) => {
            await afterUploaded(snapshot)
            .then(
              console.log('Upload process is done.')
            )
          })
        } catch (e) {
          console.error(e)
        }
      }
    },

    /** 
     * download file on Firebase storage.
     * @param storagePath       Firebase storage path.
     * @param options.destPath    local path to be downloaded.
     */
    async download(storagePath, options) {
      const destPath = options.destPath
      const url = await firebaseClient.storage().ref(storagePath).getDownloadURL()
      const file = fs.createWriteStream(destPath)
      return new Promise((resolve, reject) => {
        const request =  https.get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error('Failed to request'))
          }
          response.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve('')
          })
          file.on('error', (err) => {
            fs.unlink(destPath, () => {})
          })
        })
        request.on('error', (err) => {
          fs.unlink(destPath, () => {})
          reject(err)
        })
      })
    }
  };
}