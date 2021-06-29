// require is not defined..
const { expect } = require('chai');
const response = require('./mock-response');
const { getGitUser } = require('../src/index');
const nock = require('nock');
/*
import {expect} from 'chai';
import response from './mock-response';
import {getGitUser} from '../src/index';
import nock from 'nock';
*/

describe('Very First Test Case', () => {

  beforeEach(() => {
   nock('https://api.github.com')
   .get('/users/premalk')
   .reply(200, response);
  });

  it('It should give true', () => {
   return getGitUser('premalk')
    .then(response => {
      expect (typeof response).to.equal('object');
      expect (response.name).to.equal('Premal Katigar');
      expect (response.location).to.equal('Pune');
    });
  });
});