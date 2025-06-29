from fastapi import FastAPI
from yahooquery import Ticker
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{ticker}")
def get_stock_price(ticker: str):
    try:
        stock = Ticker(f"{ticker}.NS")  # Fetch NSE stock data
        data = stock.history(period="1d")

        if data.empty:
            return {"error": "Stock not found"}

        price = data['close'].iloc[-1]
        return {"ticker": ticker, "price": price}
    
    except Exception as e:
        return {"error": str(e)}

# Run the API using: uvicorn backend.main:app --reload
