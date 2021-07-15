const {expect} = require('chai')
const adapter = require('../src/adapters/local')
const {execSync} = require('child_process')
const fs = require('fs')

describe('local adapter', ()=>{
  describe('uploading a file', ()=>{
    beforeEach(()=>{
      execSync(`rm -rf ${__dirname}/local`)
      execSync(`mkdir ${__dirname}/local`)
      execSync(`echo 'testfile' > ${__dirname}/local/test.txt`)    // make a temporary file
    })

    afterEach(()=>{
      execSync(`rm -rf ${__dirname}/local`)
    })

    it('upload should sucessfully upload a file', async()=>{
      const config = {provider:'local', path:`${__dirname}/local`}
      const client = adapter(config)

      const textFile = fs.readFileSync(`${__dirname}/local/test.txt`)
      const options = {
        path: '.',
        filename: 'test_upload.txt'
      } 
      client.upload(textFile, options )

      const testfile = fs.readFileSync(`${__dirname}/local/test_upload.txt`, 'utf8')
      expect(testfile).to.equal('testfile\n')
    })

    it('download should successfully download a file', ()=>{
      const config = {provider:'local', path:`${__dirname}/local`}
      const client = adapter(config)

      const options = {
        destPath: 'test_download.txt'
      }
      client.download('test.txt', options)
      
      const testfile = fs.readFileSync(`${__dirname}/local/test_download.txt`, 'utf8')
      expect(testfile).to.equal('testfile\n')
    })
  })
})