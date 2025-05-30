from datetime import datetime, timedelta

# Original data (you can replace this with your actual data)
data = {
    "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": "TSLA",
        "3. Last Refreshed": "2025-05-19",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
        "2025-05-19": {
            "1. open": "336.3000",
            "2. high": "343.0000",
            "3. low": "333.3700",
            "4. close": "342.0900",
            "5. volume": "88869853"
        },
        "2025-05-16": {
            "1. open": "346.2400",
            "2. high": "351.6200",
            "3. low": "342.3300",
            "4. close": "349.9800",
            "5. volume": "95895665"
        },
        "2025-05-15": {
            "1. open": "340.3400",
            "2. high": "346.1393",
            "3. low": "334.7153",
            "4. close": "342.8200",
            "5. volume": "97882596"
        },
        "2025-05-14": {
            "1. open": "342.5000",
            "2. high": "350.0000",
            "3. low": "337.0000",
            "4. close": "347.6800",
            "5. volume": "136997264"
        },
        "2025-05-13": {
            "1. open": "320.0000",
            "2. high": "337.5894",
            "3. low": "316.8000",
            "4. close": "334.0700",
            "5. volume": "136992574"
        },
        "2025-05-12": {
            "1. open": "321.9900",
            "2. high": "322.2100",
            "3. low": "311.5000",
            "4. close": "318.3800",
            "5. volume": "112826661"
        },
        "2025-05-09": {
            "1. open": "290.2100",
            "2. high": "307.0400",
            "3. low": "290.0000",
            "4. close": "298.2600",
            "5. volume": "132387835"
        },
        "2025-05-08": {
            "1. open": "279.6300",
            "2. high": "289.8000",
            "3. low": "279.4100",
            "4. close": "284.8200",
            "5. volume": "97539448"
        },
        "2025-05-07": {
            "1. open": "276.8800",
            "2. high": "277.9200",
            "3. low": "271.0000",
            "4. close": "276.2200",
            "5. volume": "71882408"
        },
        "2025-05-06": {
            "1. open": "273.1050",
            "2. high": "277.7300",
            "3. low": "271.3500",
            "4. close": "275.3500",
            "5. volume": "76715792"
        }
    }
}

# Target date to start
target_date = datetime.strptime("2025-05-21", "%Y-%m-%d")

# Function to adjust the dates
def adjust_dates(data, target_date):
    time_series = data["Time Series (Daily)"]
    
    # Get the earliest date from the available data
    earliest_date = min(time_series.keys())
    
    # Calculate the date difference from the earliest date to the target date
    earliest_date_obj = datetime.strptime(earliest_date, "%Y-%m-%d")
    date_difference = (target_date - earliest_date_obj).days
    
    # Create a new dictionary to store the adjusted data
    adjusted_data = {}

    # Adjust each date and update the data
    for date_str, price_data in time_series.items():
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        
        # Calculate new date after shifting
        new_date_obj = date_obj + timedelta(days=date_difference)
        new_date_str = new_date_obj.strftime("%Y-%m-%d")
        
        # Update the dictionary with the new date and the corresponding data
        adjusted_data[new_date_str] = price_data
    
    # Replace the original time series with the adjusted one
    data["Time Series (Daily)"] = adjusted_data
    return data

# Adjust the dates and print the new data
adjusted_data = adjust_dates(data, target_date)

# Output the adjusted data
for date, values in adjusted_data["Time Series (Daily)"].items():
    print(f"{date}: {values}")
