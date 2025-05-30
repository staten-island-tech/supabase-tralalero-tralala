

export async function handleFetch(parameters: string) {
    const api_keys = import.meta.env.VITE_API_KEYS.split(',');

    let t = true;
    let n = 0;

    while (t && n < api_keys.length) {
        
        console.log("Key: " + n);
        console.log("API Key: " + api_keys[n]);
        const response = await fetch(`https://www.alphavantage.co/query?${parameters}&apikey=${api_keys[n]}`);
        const rawData = await response.json();
        console.log(rawData);
        if (rawData["Information"]) n++;
        else return rawData;
    }
}
