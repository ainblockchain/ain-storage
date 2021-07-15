const fs = require('fs')
const path = require('path')

module.exports = config => {

  let storagePath = config.path;
  let normalizedPath = path.normalize(`${storagePath}/`)

  return {
    /** 
     * copy data into a file on local
     * @param file          byte array to be saved in a file
     * @param options.path      relative path for the file to storagePath 
     * @param options.filename    name of a file to be saved
     */
    upload(file, options) {
      console.log(options)

      const localpath = path.normalize(`${options.path}/`)
      const filename = options.filename
      
      fs.writeFileSync(`${normalizedPath}${localpath}${filename}`, file, (err)=>{
        if (err) throw err
        console.log('Uploaded.')
      })
    },

    /** 
     * copy data into a file on local
     * @param storagePath     file path to be read
     * @param options.destPath  local path to be downloaded/saved
     */
    download(storagePath, options) {
    const data = fs.readFileSync(`${normalizedPath}${storagePath}`)
      const destPath = options.destPath

      fs.writeFileSync(`${normalizedPath}${destPath}`, data, (err)=>{
        if (err) throw err
        console.log('Downloaded.')
      })
    }
  };
}