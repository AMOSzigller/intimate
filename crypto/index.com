<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>אינטימיים - קריפטו</title>
    <style>
        :root {
            --bg-color: #121212;
            --card-bg-color: #1e1e1e;
            --text-color: #e0e0e0;
            --highlight-color: #1a73e8;
            --button-bg-color: #333333;
            --button-hover-color: #474747;
            --disabled-color: #555555;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            color: var(--text-color);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        h1 {
            color: var(--text-color);
            margin-top: 20px;
            font-size: 2.2em;
        }

        .last-updated {
            color: var(--disabled-color);
            font-size: 14px;
            margin-bottom: 20px;
        }

        .crypto-list {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            max-width: 1200px;
            width: 100%;
        }

        .crypto-card {
            background-color: var(--card-bg-color);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            padding: 20px;
            width: 100%;
            max-width: 250px;
            transition: transform 0.2s;
            color: var(--text-color);
            text-align: center;
        }

        .crypto-card:hover {
            transform: scale(1.05);
            border: 1px solid var(--highlight-color);
        }

        .crypto-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .crypto-info img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
        }

        .crypto-name {
            font-size: 18px;
            font-weight: bold;
            color: var(--text-color);
        }

        .price {
            font-size: 24px;
            font-weight: bold;
            color: var(--text-color);
            margin-top: 10px;
        }

        .price-ils {
            font-size: 20px;
            color: var(--disabled-color);
            margin-top: 5px;
        }

        .change {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
        }

        .change.positive {
            color: #4CAF50;
        }

        .change.negative {
            color: #F44336;
        }

        .change-period {
            font-size: 12px;
            color: #888;
            margin-top: 2px;
        }
    </style>
</head>
<body>

    <h1>אינטימיים - קריפטו</h1>
    <div class="last-updated" id="lastUpdated">עדכון אחרון: טוען...</div>

    <div id="cryptoList" class="crypto-list"></div>

    <script>
        const cryptos = [
            { id: 'bitcoin', name: 'Bitcoin', img: 'nadav.png' },
            { id: 'ethereum', name: 'Ethereum', img: 'shuki.png' },
            { id: 'solana', name: 'Solana', img: 'yunger.png' },
            { id: 'dogecoin', name: 'Dogecoin', img: 'dog.png' },
            { id: 'pepe', name: 'PEPE', img: 'amit.png', decimalPlaces: 7 }
        ];

        async function fetchCryptoData() {
            const ids = cryptos.map(c => c.id).join(',');
            const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`;
            const response = await fetch(url);
            const data = await response.json();

            const lastUpdated = new Date().toLocaleString('he-IL');
            document.getElementById('lastUpdated').textContent = `עדכון אחרון: ${lastUpdated}`;

            document.getElementById('cryptoList').innerHTML = '';

            for (const crypto of cryptos) {
                const cryptoData = data.find(c => c.id === crypto.id);
                if (!cryptoData) continue;

                const priceUSD = `$${cryptoData.current_price.toFixed(crypto.decimalPlaces || 2)}`;
                const priceILS = `₪${(cryptoData.current_price * 3.3).toFixed(crypto.decimalPlaces || 2)}`;
                const change24h = cryptoData.price_change_percentage_24h != null ? cryptoData.price_change_percentage_24h.toFixed(2) : 'N/A';
                const changeClass = change24h !== 'N/A' && change24h >= 0 ? 'positive' : 'negative';
                const changeIcon = change24h !== 'N/A' && change24h >= 0 ? '▲' : '▼';

                const card = document.createElement('div');
                card.className = 'crypto-card';

                card.innerHTML = `
                    <div class="crypto-info">
                        ${crypto.img ? `<img src="${crypto.img}" alt="${crypto.name} Image">` : ''}
                        <span class="crypto-name">${crypto.name}</span>
                    </div>
                    <div class="price">${priceUSD}</div>
                    <div class="price-ils">${priceILS}</div>
                    <div class="change ${changeClass}">
                        ${change24h !== 'N/A' ? `${changeIcon} ${Math.abs(change24h)}%` : 'N/A'}
                    </div>
                    <div class="change-period">(24h)</div>
                `;

                document.getElementById('cryptoList').appendChild(card);
            }
        }

        fetchCryptoData();
        setInterval(fetchCryptoData, 60000);
    </script>
</body>
</html>
