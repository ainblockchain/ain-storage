const fs = require('fs')
const path = require('path')

module.exports = config => {

    let storagePath = config.path;
    let normalizedPath = path.normalize(`${storagePath}/`)

    let options = {
        // ContentType : 'image/png'
    }

    return {
        /*
        *  @param file                  name of a file to be uploaded
        *  @param options.path          relative path for the file to storagePath 
        */
        upload (file, options) {
            const path = path.nomalize(`${options.path}/`)

            return new Promise((resolve, reject) => {
                let data = fs.createReadStream(`${normalizedPath}${path}${filename}`);

                let target
                if (options.target === '') {
                    target = Math.random().toString().substr(2, 8); // temporary Random string
                } else {
                    target = options.target
                }
                const response = {
                    key : target,
                    ContentType : options.ContentType
                }

                const writeStream = fs.createWriteStream(`${normalizedPath}${target}`)
                writeStream.on('error', err => reject(err))
                writeStream.on('finish', () => {
                    resolve(response)
                })
                // file copy
                data.pipe(writeStream)
            })
        },
        /*
        *  @param  name         file name to be read
        */
        download (name, options) {
            return new Promise((resolve, reject) => {
                let stream = fs.createReadStream(`${normalizedPath}${name}`)
                switch(options.type) {
                    case 'buffer' :
                        let data = Buffer.from('')
                        stream.on('data', chunk=>{data = Buffer.concat([data,chunk]) })
                        stream.on('end', () => resolve(data))
                        stream.on('error', err => reject(err))
                        break
                    default :
                        return resolve(stream)
                }
            })
        }
    }
}