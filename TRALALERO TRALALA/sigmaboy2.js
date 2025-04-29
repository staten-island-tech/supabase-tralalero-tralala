const axios = require('axios');

const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=B6S0LQO8ZSN31GKX';

axios.get(url)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
