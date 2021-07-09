const fs = require('fs')
const https = require('https')
const firebase = require('firebase/app')
require('firebase/storage')
global.XMLHttpRequest = require("xhr2");
const path = require('path')

const assertParam = require('../utils/assert-param')

module.exports = config => {

    const firebaseConfig = {
        apiKey : config.apiKey,
        authDomain : config.authDomain,
        databaseURL : config.databaseURL,
        projectId : config.projectId,
        storageBucket : config.storageBucket,
        messagingSenderId : config.messagingSenderId,
        appId : config.appId,
        measurementId : config.measurementId,
    }
    const appName = config.appName

    let firebaseClient = {};
    if (!firebase.apps.find(el => el.name_ == appName)) {
        firebaseClient = firebase.initializeApp(firebaseConfig, appName)
        console.log(`${appName} Firebase initialized.`)
    } else {
        firebaseClient = firebase.app(appName)
    }

    return {
        /*
        *  @param file                      File or blob object to be uploaded
        *  @param options.path              relative path for a file to be uploaded
        *  @param options.fileName          file name to be set 
        *  @param options.dispatch          function to dispatch events during this process 
        *  @param options.dispatchType      type defining progress of uploading a file
        *  @param options.afterUploaded     async function to execute 
        */
        upload (file, options) {
            assertParam(options, "fileName")  // unless there's no file.filename
            
            const {
                dispatch,
                dispatchType,
                afterUploaded,
                fileName
            } = options
            

            /*
            const textFile = options.textFile
            const dispatch = options.dispatch
            const dispatchType = options.dispatchType
            const afterUploaded = options.afterUploaded
            const fileName = options.fileName
            */

            const relativePath = path.normalize(`${options.path}/`)

            const ref = firebaseClient.storage().ref(`${relativePath}${fileName}`)
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
                        await afterUploaded(snapshot).then(
                            console.log('Upload process is done.')
                        )
                    })
                } catch (e) {
                    console.error(e)
                }
            }
/*
try {
    return await uploadTask.then(async (snapshot) => {
        const timestamp = Date.now();
        const txBody = buildTrainRequestTxBody(address, trainId, fileName, timestamp, modelType, ainizeUid, ainizeMail, epochs);
        const { signedTx } = signTx(txBody, privateKey);
        const { result, ...rest } = await gpt2Firebase.functions()
            .httpsCallable('sendSignedTransaction')(signedTx);
    });
} catch (e) {
    console.error(e)
}
*/ 

        },


        /* download file on Firebase storage.
        *  @param storagePath           Firebase storage path.
        *  @param options.destPath      local path to be downloaded.
        */
        async download (storagePath, options) {

            const destPath = options.destPath

            const url = await firebaseClient.storage().ref(storagePath).getDownloadURL()
            const file = fs.createWriteStream(destPath)

            return new Promise ((resolve, reject) => {
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
    }
}