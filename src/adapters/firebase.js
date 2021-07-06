const fs = require('fs')
const https = require('https')
const firebase = require('firebase/app')
//const firebase = require('firebase-admin')
require('firebase/storage')

global.XMLHttpRequest = require("xhr2");


module.exports = config => {

    /* == firebase config ==
    apiKey, authDomain, databaseURL ,projectId ,storageBucket ,messagingSenderId ,appId ,measurementId ,
    +
    appName (ex.'GPT2Firebase')
    */
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
/*
    const address = config.address
    const trainId = config.trainId
    const textFile = config.textFile
*/
    const textFie = config.textFile

    let firebaseClient = {};
    if (!firebase.apps.find(el => el.name_ == config.appName)) {
        firebaseClient = firebase.initializeApp(firebaseConfig, config.appName)
        console.log(`${config.appName} Firebase initialized.`)
    } else {
        firebaseClient = firebase.app(config.appName)
    }

    let path = config.path;

    return {
        /*
        *  @param options.dispatch
        *  @param options.dispatchType  
        *  @param options.afterUploaded     async function
        */
        upload (path, filename, options) {
            const textFile = options.textFile
            //const fileName = textFile.name
/*
            const dispatch = options.dispatch
            const dispatchType = options.dispatchType
            const afterUploaded = options.afterUploaded
*/

            // ex. path from gpt2Firebase : trainData/${address}/${trainId}/${fieName}
            /*
            const ref = firebaseClient.storage().ref(`${path}/${fileName}`)
            const uploadTask = ref.put(textFile)
            */
            
            const ref = firebaseClient.storage().ref()
            const childRef = ref.child('text4.txt')

            /*
            childRef.put(textFile).then(function(snapshot) {
                console.log('Uploaded a file!');
              })
            */

            //var bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
            childRef.put(textFile).then(function(snapshot) {
              console.log('Uploaded an array!');
              return
            }); 

            /*
            uploadTask.on('state_changed', (snapshot) => {

                let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                
                dispatch({
                    type : dispatchType,
                    data: {
                        progress
                    }
                })
                
               console.log('Upload is ' + progress + '% done');
            })
            */
            
            
/*
            try {
                return await uploadTask.then(afterUploaded)
            } catch (e) {
                console.error(e)
            }
*/
        },
        /* download file on Firebase storage.
        *  @param storagePath Firebase storage path.
        *  @param options.destPath local path.
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