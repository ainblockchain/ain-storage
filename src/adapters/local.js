const fs = require('fs')
const path = require('path')

module.exports = config => {

    let storagePath = config.path;
    let normalizedPath = path.normalize(`${storagePath}/`)

    let options = {
        // ContentType : 'image/png'
    }

    return {
        upload (path, filename, options) {
            return new Promise((resolve, reject) => {
                // name, data, options
                let data = fs.createReadStream(`${normalizedPath}${path}/${filename}`);   // supposed 'ReadStream'

                let target
                if (options.target === '') {
                    target = Math.random().toString().substr(2, 8); // temporary Random
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