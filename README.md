# 🌍 TravelLora - Your Ultimate Travel Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-4.3.9-646CFF?logo=vite)](https://vitejs.dev/)

TravelLora is a modern, responsive travel planning and booking platform that helps users discover, plan, and book their dream vacations. With an intuitive interface and powerful features, TravelLora makes travel planning a breeze.


## ✨ Features

- **🌍 Explore Destinations** - Discover amazing places to visit with detailed information
- **🏨 Hotel Booking** - Find and book accommodations that suit your needs
- **🗺️ Interactive Maps** - Explore locations with integrated maps
- **📅 Travel Planning** - Create and manage your travel itineraries
- **🔖 Save Favorites** - Bookmark places and hotels for future reference
- **👤 User Profiles** - Manage your bookings and preferences
- **🔐 Secure Authentication** - Protected routes and secure user data

## 🚀 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Routing**: React Router v7
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Mock API**: JSON Server

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or Yarn
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/travellora.git
   cd travellora
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   # Start the Vite dev server
   npm run dev
   
   # In a new terminal, start the JSON server (mock API)
   npm run server
   ```

4. **Open in browser**
   The app should be running at [http://localhost:5173](http://localhost:5173)
   
   The mock API will be available at [http://localhost:3002](http://localhost:3002)

## 🏗️ Project Structure

```
src/
├── assets/          # Images, fonts, and other static assets
├── components/      # Reusable UI components
├── context/         # React context providers
├── pages/           # Page components
├── services/        # API services and utilities
├── App.jsx          # Main application component
└── main.jsx         # Application entry point
```

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run server` - Start the JSON server (mock API)
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

The application uses a mock JSON server with the following endpoints:

- `GET /places` - Get all travel destinations
- `GET /places/:id` - Get a specific destination
- `GET /hotels` - Get all hotels
- `GET /hotels/:id` - Get a specific hotel
- `GET /bookings` - Get all bookings (protected)
- `POST /bookings` - Create a new booking (protected)
- `GET /users` - Get user data (protected)



## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React Router](https://reactrouter.com/) - Declarative routing for React
- [JSON Server](https://github.com/typicode/json-server) - Get a full fake REST API

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Output Screenshots
   <img width="1800" height="987" alt="Screenshot 2026-01-20 142806" src="https://github.com/user-attachments/assets/4e427831-5403-404f-94f6-c50df88bc056" />
   <img width="1800" height="970" alt="image" src="https://github.com/user-attachments/assets/111565bd-426d-4b44-9523-81e30ae394b8" />
   <img width="1665" height="977" alt="image" src="https://github.com/user-attachments/assets/0bc0eb59-91a5-4195-a3f4-831ae1d52601" />
   <img width="1683" height="368" alt="image" src="https://github.com/user-attachments/assets/0ef7510b-bdbb-47eb-8c19-19de871bbb03" />
   <img width="1660" height="758" alt="image" src="https://github.com/user-attachments/assets/d7e8e0e4-47df-4258-a8a9-cc15ab9847a8" />
   <img width="1451" height="775" alt="image" src="https://github.com/user-attachments/assets/f2d36d03-309d-4adc-9fc1-020383df4e17" />


