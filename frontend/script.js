let stockChart;
let stockData = [];

async function fetchStockPrice() {
    const ticker = document.getElementById("tickerInput").value.toUpperCase();
    if (!ticker) {
        alert("Please enter a stock ticker!");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/stock/${ticker}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById("stockPrice").innerText = "Error: " + data.error;
            return;
        }

        document.getElementById("stockPrice").innerText = `Stock Price: ₹${data.price.toFixed(2)}`;
        updateChart(ticker, data.price);
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

function updateChart(ticker, price) {
    const timestamp = new Date().toLocaleTimeString();
    stockData.push({ time: timestamp, price: price });

    if (stockData.length > 10) stockData.shift(); // Keep last 10 records

    const ctx = document.getElementById("stockChart").getContext("2d");

    // Destroy previous chart instance before creating a new one
    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: stockData.map(data => data.time),
            datasets: [{
                label: `Stock Price of ${ticker}`,
                data: stockData.map(data => data.price),
                borderColor: "#007bff",
                borderWidth: 2,
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top"
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time",
                        font: {
                            size: 12,
                            weight: "bold"
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Stock Price (₹)",
                        font: {
                            size: 12,
                            weight: "bold"
                        }
                    },
                    beginAtZero: false
                }
            }
        }
    });
}
