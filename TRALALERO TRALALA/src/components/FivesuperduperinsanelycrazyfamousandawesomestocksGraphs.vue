<template>
  <div></div>
</template>

<script setup lang="ts">
async function fetchData() {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'FB', 'TSM', 'V', 'JNJ']
  const apiKey = 'B6S0LQO8ZSN31GKX'
  const baseUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=15min'

  try {
    const responses = await Promise.all(
      symbols.map((symbol) => fetch(`${baseUrl}&symbol=${symbol}&apikey=${apiKey}`)),
    )
    responses.forEach((response) => {
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    })
    const data = await Promise.all(responses.map((res) => res.json()))
    return data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
</script>

<style scoped></style>
