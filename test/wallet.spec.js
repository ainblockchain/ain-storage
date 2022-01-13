const wallet = require('../src/wallet')
const ainUtil = require('@ainblockchain/ain-util')
const { expect } = require('chai')

describe('wallet', () => {
  let account1, account2
  describe('sign and verify data', () => {

    beforeEach(() => {
      account1 = ainUtil.createAccount('qwer')
      account2 = ainUtil.createAccount('asdf')
    })

    it('A signature should be successfully verified.', async () => {
      await wallet.setKey(account1.private_key)
      const testdata = Buffer.from('0x1234567890')
      expect(wallet.verifySignature(testdata, wallet.sign(testdata)), true)
    })
  })
})