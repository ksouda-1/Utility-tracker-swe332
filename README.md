# 💡 Aware

> Take control of what you consume — gas, water, and electricity, all in one place.

**Aware** is a web application that pulls real-time consumption data for gas, water, and electricity, giving individuals and companies clear visibility into their resource usage. By making consumption data accessible and easy to understand, Aware helps users make smarter, more sustainable decisions.

---
Members

Ahmed Ksouda | 230513531
Youssef Sidky | 230513025
Mahmoud Abumustafa | 230513575
Faris Abdelrahman | 230513535
Abdelbasset Gassara | 230513458 


---

## 🌍 Why Aware?

Most people and organizations have no idea how much energy and water they actually use — until the bill arrives. Aware changes that by surfacing live consumption data in a clean, intuitive interface so you can:

- Monitor usage trends over time
- Spot unusual spikes before they become costly
- Make informed decisions toward reducing your footprint

---

## ✨ Features

- 📊 **Real-time data** — Live consumption metrics via API integration
- 💧 **Multi-utility tracking** — Gas, water, and electricity in one dashboard
- 🏠 **For individuals & businesses** — Scalable for personal or organizational use
- 📈 **Usage trends** — Historical data visualization
- 🗄️ **Persistent storage** — SQL-backed data layer for reliable record-keeping

---

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | HTML, CSS, JavaScript   |
| Database   | SQL                     |
| Data       | External Consumption API |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- A local server (e.g. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code, or any HTTP server)
- Access credentials for the consumption data API
- A running SQL database instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aware.git
   cd aware
   ```

2. **Configure your API credentials**

   Create a `config.js` file in the root directory (or update the existing one):
   ```js
   const CONFIG = {
     API_BASE_URL: "https://your-api-endpoint.com",
     API_KEY: "your_api_key_here",
   };
   ```

3. **Set up the database**

   Run the provided SQL schema to initialize your database:
   ```bash
   psql -U your_user -d your_database -f schema.sql
   ```
   *(Adjust the command based on your SQL engine — MySQL, PostgreSQL, SQLite, etc.)*

4. **Launch the app**

   Open `index.html` with a local server or simply open it in your browser.

---

## 📁 Project Structure

```
aware/
├── index.html          # Main entry point
├── css/
│   └── styles.css      # App styles
├── js/
│   ├── main.js         # Core application logic
│   ├── api.js          # API integration & data fetching
│   └── charts.js       # Data visualization
├── sql/
│   └── schema.sql      # Database schema
├── assets/             # Icons, images
└── README.md
```

---

## 🔌 API Integration

Aware connects to a consumption data API to retrieve real-time and historical readings. All API calls are handled in `js/api.js`.

Make sure your API key and endpoint are correctly set in `config.js` before running the app. Refer to your API provider's documentation for available endpoints and rate limits.

---

## 🗺️ Roadmap

- [ ] User authentication & personalized dashboards
- [ ] Alerts & notifications for consumption thresholds
- [ ] Export reports (PDF / CSV)
- [ ] Carbon footprint calculator
- [ ] Mobile-responsive design improvements
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code is clean and well-commented before submitting.

---

## 👤 Author

Built with purpose by the **Aware** team.  
Have feedback or ideas? Open an issue or reach out directly.

---

*Aware — because knowing is the first step to changing.*
