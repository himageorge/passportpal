# Passport Pal 🌍✈️

**Your smart and reliable travel buddy for navigating visa requirements worldwide.**

Passport Pal is a web application that helps travelers quickly discover visa requirements for destinations based on their citizenship. Built with a simple interface and powered by the RapidAPI Visa Requirements API.

---

## Features

✨ **Smart Visa Lookup** - Select your citizenship and instantly see all possible travel destinations
🎨 **Color-Coded Requirements** - Visual indicators for visa requirements:
- 🟢 Green: Visa free 
- 🔵 Blue: Visa on arrival / eVisa
- 🟡 Yellow: eTA / Visa waiver / Registration required
- 🔴 Red: Visa required

📋 **Detailed Information** - Click any destination to view:
- Primary and secondary visa rules
- Duration of stay allowed
- Passport validity requirements
- Mandatory registration details

---

## Tech Stack

### Frontend
- **HTML** 
- **CSS3** 
- **Vanilla JavaScript** 
### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Axios** - HTTP client for API requests
- **CORS** - Cross-origin resource sharing

### API
- [RapidAPI Visa Requirements API](https://rapidapi.com/Travel-Buddy/api/visa-requirement) - Visa data provider

---


---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- RapidAPI account with Visa Requirements API subscription

### Backend Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd passport-pal/
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
touch .env
```

4. **Add your API credentials to `.env`**
```env
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=visa-requirement.p.rapidapi.com
PORT=3001
```

5. **Start the server**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:3001`

### Frontend Setup

**Open with a local server**

Frontend will run on `http://localhost:5500` (or your preferred port)

---

## API Endpoints

### `GET /api/passports`
Fetches list of all countries that issue passports
- **Response**: Array of countries with ISO codes and names

### `GET /api/destinations`
Fetches list of all travel destinations
- **Response**: Array of destinations with ISO codes and names

### `POST /api/visa/map`
Gets visa requirements map for a specific passport
- **Body**: `{ passport: "US" }`
- **Response**: Object with color-coded destination lists

### `POST /api/visa/check`
Gets detailed visa requirements for specific passport-destination pair
- **Body**: `{ passport: "US", destination: "FR" }`
- **Response**: Detailed visa rules, duration, validity requirements

---

## Usage

1. **Select Your Citizenship** - Choose your passport from the dropdown
2. **Optional: Select Departure Date** - (Feature coming soon)
3. **Click "Find Destinations"** - View all possible travel destinations
4. **Browse Results** - Destinations are color-coded by visa requirement
5. **Click for Details** - Click any destination to see detailed visa information

---


## Future Enhancements

- [ ] Implement departure date filtering
- [ ] Add destination search/filter functionality
- [ ] Cache API responses to reduce rate limiting
- [ ] Add country flags to results
- [ ] Export results to PDF
- [ ] Mobile-responsive modal positioning
- [ ] Dark mode support
- [ ] Multi-language support

---

## License

This project is licensed under the MIT Licen
