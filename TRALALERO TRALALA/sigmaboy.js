import https from 'https';

const requestOptions = {
    hostname: 'api.tiingo.com',
    path: '/tiingo/daily/aapl/prices?startDate=2025-04-07&token=e01c49e26e07e4120b0b603d1919cb3f29cc27a0',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = https.request(requestOptions, (res) => {
    let data = '';

    // A chunk of data has been received.
    res.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received.
    res.on('end', () => {
        console.log(data); // Here is the response body
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

// End the request
req.end();
