const adapter = require('../src/adapters/firebase')
const {execSync} = require('child_process')
const fs = require('fs')
const { expect } = require('chai')
const axios = require('axios')
const nock = require('nock')

//== Temporary variables and functions for testing ==//
const response = require('./private/mock-response')
const test_dispatchType = "SET_PROGRESS"

function test_dispatch(messages) {
    console.log(messages)
}

function sendSignedTx(snapshot) {
    console.log('sendSignedTx..')
    return axios
        .get(`https://api.ainetwork.ai/storage/sendSignedTx`)
        .then((result) => result.data)
        .catch((err) => console.log(err))
}
//===//

describe('firebase adapter', () => {

    beforeEach (() => {
        nock('https://api.ainetwork.ai')
        .get('/storage/sendSignedTx')
        .reply(200, response )
    })

    describe('http mocking test', () => {
        it('It should work properly', () => {
            return sendSignedTx('premalk')
            .then(response => {
                expect(typeof response).to.equal('object')
                expect(response.login).to.equal('premalk')
            })
        })
    })
    
    describe('uploading a file', () => {
        
        beforeEach(() => {
            execSync(`rm -rf ${__dirname}/firebase`)
            execSync(`mkdir ${__dirname}/firebase`)
            execSync(`echo 'testfile' > ${__dirname}/firebase/test.txt`)
        })

        afterEach(() => {
            execSync(`rm -rf ${__dirname}/firebase`)
        })

        it('upload should sucessfully upload a file', () => {

            const config = require('./private/firebase_config')
            const client = adapter(config)
            const textFile = fs.readFileSync(`${__dirname}/firebase/test.txt`)
            // path
            // dispatch, dispatchType, afterUpload, fileName
            const options = {
                path : "temp",
                fileName : "text5.txt", 
                dispatch : test_dispatch,
                dispatchType : test_dispatchType,
                afterUploaded : sendSignedTx,
            }
            client.upload(textFile, options)
        })

        it('download should successfully download a file', async () => {
            const config = require('./private/firebase_config')
            const client = adapter(config)

            const options = {
                destPath : './down_text5.txt',
            }
            await client.download('temp/text5.txt', options)
            console.log('download success')
        })

        
    })
    
})