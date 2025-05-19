const api_keys = import.meta.env.VITE_API_KEYS

async function handleFetch(parameters : String) {
    let t = true
    let n = 0

    while (t && n < api_keys.length) {
        try {
            const response = await fetch(`https://www.alphavantage.co/query?${parameters}apikey=${api_keys[n]}`);
            const rawData = await response.json(); // function=TIME_SERIES_INTRADAY&symbol=IBM&interval=15min&month=2009-01&outputsize=full&
            return rawData
        }
        catch {
            console.log("Next Key")
            n++
        }
    }
}