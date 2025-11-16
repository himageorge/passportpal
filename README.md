# Passport Pal 🌍✈️

**Your smart and reliable travel buddy for navigating visa requirements worldwide.**

Passport Pal is a web application that helps travelers quickly discover visa requirements for destinations based on their citizenship. Built with a simple interface and powered by the RapidAPI Visa Requirements API.

---

## Features

✨ **Smart Visa Lookup** - Select your citizenship and instantly see all possible travel destinations
🎨 **Color-Coded Requirements** - Visual indicators for visa requirements:
- 🟢 Green: Visa free / Freedom of movement
- 🔵 Blue: Visa on arrival / eVisa
- 🟡 Yellow: eTA / Visa waiver / Registration required
- 🔴 Red: Full visa required

📋 **Detailed Information** - Click any destination to view:
- Primary and secondary visa rules
- Duration of stay allowed
- Passport validity requirements
- Mandatory registration details

---

## Tech Stack

### Frontend
- **HTML5**
- **CSS3** 
- **JavaScript** 

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework

### API
- [RapidAPI Visa Requirements API](https://rapidapi.com/Travel-Buddy/api/visa-requirement) - Visa data provider

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
cd passport-pal/backend
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

VS Code Live Server extension
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
## Known Issues

1. **Territory Codes**: Some destinations may show as codes (e.g., "AW") instead of names if they're not in the destinations list
2. **Self-Country Bug**: API sometimes includes home country in red category (filtered in frontend)

---

## Future Enhancements

### Phase 1: Core Features
- [ ] Implement departure date filtering

### Phase 2: User Management & Documents
- [ ] **User Authentication System**

- [ ] **Document Checklist Feature**
  - Interactive checklist showing required documents
  - Mark documents as "Completed" 
  - Document expiry date tracking and reminders

- [ ] **User Document Dashboard**
  - Personal document vault to store:
    - Passport scans/photos
    - Visa copies
    - Travel insurance documents
    - Vaccination certificates
    - ID photos
  - Document expiry notifications
  - Quick access when planning trips

- [ ] **Trip Planning Integration**
  - Save planned destinations
  - Track document status per destination

- [ ] **Smart Recommendations**
  - AI-powered document suggestions based on destination
  - Country-specific document requirements
  - Processing time estimates for visas
  - Cost estimates for visa applications

### Phase 3: Enhanced UX
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Email notifications for document expiry
- [ ] Mobile app (React Native)

---

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- [RapidAPI](https://rapidapi.com/) for the Visa Requirements API
- [Travel Buddy API](https://travel-buddy.ai/api/) for visa data

---

## Contact

For questions or support, please open an issue on GitHub or contact [your-email@example.com]

---

**Made with ❤️ by [Your Name]**
