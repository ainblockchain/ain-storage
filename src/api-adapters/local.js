const fs = require('fs')
const { util } = require('chai');
const path = require('path')

const reqlib = require('app-root-path').require
const rootPath = require('app-root-path')

const dataOwnersFilePath = `${rootPath}/src/api-adapters/data/data_owners.txt`
const workersFilePath = `${rootPath}/src/api-adapters/data/workers.txt`
const workerSelectorsFilePath = `${rootPath}/src/api-adapters/data/worker_selectors.txt`

module.exports = (config) => {
  const dataOwners = fs.readFileSync(dataOwnersFilePath).toString().split("\n")
  const workers = fs.readFileSync(workersFilePath).toString().split("\n")
  const workerSelectors = fs.readFileSync(workerSelectorsFilePath).toString().split("\n")

  return {
    // Data owner
    setDataOwner: (g1PublicKey) => {
      if(dataOwners.indexOf(g1PublicKey) == -1) {
        dataOwners.push(g1PublicKey)
        fs.appendFileSync(dataOwnersFilePath, `${g1PublicKey}\n`);
        return true
      }
      return false
    },
    getDataOwner: (g1PublicKey) => {      
      if(dataOwners.indexOf(g1PublicKey) != -1) {
        return g1PublicKey
      }

      return null
    },
    getDataOwners: () => {
      return dataOwners
    },

    // Worker
    setWorker: (g2PublicKey) => {
      if(workers.indexOf(g2PublicKey) == -1) {
        workers.push(g2PublicKey)
        fs.appendFileSync(workersFilePath, `${g2PublicKey}\n`);
        return true
      }
      return false
    },
    getWorker: (g2PublicKey) => {
      if(workers.indexOf(g2PublicKey) != -1) {
        return g2PublicKey
      }

      return null
    },
    getWorkers: () => {
      return workers
    },

    // Worker selector
    setWorkerSelector: (g2PublicKey) => {
      if(workerSelectors.indexOf(g2PublicKey) == -1) {
        workerSelectors.push(g2PublicKey)
        fs.appendFileSync(workerSelectorsFilePath, `${g2PublicKey}\n`);
        return true
      }
      return false
    },
    getWorkerSelector: (g2PublicKey) => {
      if(workerSelectors.indexOf(g2PublicKey) != -1) {
        return g2PublicKey
      }

      return null
    },
    getWorkerSelectors: () => {
      return workerSelectors
    }
  };
}