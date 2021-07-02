const {expect} = require('chai')
const adapter = require('../src/adapters/local')
const {execSync} = require('child_process')
const fs = require('fs')

describe('local adapter', () => {
    describe('uploading a file', () => {
        beforeEach(() => {
            execSync(`rm -rf ${__dirname}/testfiles`)
            execSync(`mkdir ${__dirname}/testfiles`)
            execSync(`echo 'testfile' > ${__dirname}/testfiles/test.txt`)      // make a temporary file
        })

        afterEach(() => {
            execSync(`rm -rf ${__dirname}/testfiles`)
        })

        it('upload should sucessfully upload a file', async() => {
            const config = {provider:'local', path:`${__dirname}/testfiles`}
            const client = adapter(config)

            await client.upload('', 'test.txt', {target:'test_copy.txt'})

            const testfile = fs.readFileSync(`${__dirname}/testfiles/test_copy.txt`, 'utf8')
            expect(testfile).to.equal('testfile\n')

        })
    })
})