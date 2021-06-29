/*
import axios, {AxiosInstance} from 'axios';
import {get} from 'lodash';
*/
const axios = require('axios');
const {get} = require('lodash');
const JSON_RPC_ENDPOINT = 'json-rpc';

class Provider {

    #endpoint;
    #apiEndpoint;
    #httpClient;

    constructor (endpoint) {
        let url = new URL(endpoint);
        if (url && url.origin !== 'null') {
            this.#endpoint = url.origin;
            this.#apiEndpoint = [this.#endpoint, JSON_RPC_ENDPOINT].join('/');
        } else {
            throw Error('Invalid endpoint received.');
        }
        this.#httpClient = axios.create();
    }

    async send (rpcMethod, params){
        const data = {
            jsonrpc : "2.0",
            method : rpcMethod,
            params : Object.assign(params || {},{ protoVer : 0.7}),
            id :0
        };

        const response = await this.#httpClient.post(this.#apiEndpoint, data);
        const result = get(response, 'data.result.result', null);
        const code = get(response, 'data.result.code');

        return code !== undefined ? get(response, 'data.result') : result;
    }

    getEndpoint() {
        return this.#endpoint;
    }

}

module.exports = Provider;