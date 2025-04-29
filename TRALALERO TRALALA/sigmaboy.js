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

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
