const adapter = require('../src/adapters/firebase')
const {execSync} = require('child_process')
const fs = require('fs')

describe('firebase adapter', () => {
    describe('uploading a file', () => {
        
        beforeEach(() => {
            execSync(`rm -rf ${__dirname}/firebase`)
            execSync(`mkdir ${__dirname}/firebase`)
            execSync(`echo 'testfile' > ${__dirname}/firebase/test.txt`)
        })

        afterEach(() => {
            execSync(`rm -rf ${__dirname}/firebase`)
        })
        

        it('upload should sucessfully upload a file', async() => {

            const config = require('./private/firebase_config')
            const client = adapter(config)
            const options = {
                textFile : fs.readFileSync(`${__dirname}/firebase/test.txt`),
            }
            client.upload('.', 'test4.txt', options)

        })
    })
})