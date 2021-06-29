//import axios from 'axios';
const axios = require('axios');

module.exports = {
    getGitUser(user) {
      return axios
       .get(`https://api.github.com/users/${user}`)
       .then((result) => result.data)
       .catch((err) => console.err(err));
      }
   };


