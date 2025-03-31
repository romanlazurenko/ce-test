# City Explorer

A Vue.js application that allows users to explore cities worldwide through an interactive interface, providing weather information, map location, and photo galleries.

## Features

- City search with autocomplete using Google Places API
- Real-time weather information from OpenWeather API
- Interactive maps with Google Maps API
- City photo galleries using Unsplash API
- Fully responsive design
- Modern UI with Tailwind CSS and PrimeVue components

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (v14 or higher)
- npm or yarn
- API Keys for:
  - Google Maps (with Places API enabled)
  - OpenWeather API
  - Unsplash API

## Setup

1. Clone the repository:
```bash
git clone <https://github.com/romanlazurenko/ce-test>
cd ce-test
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Architecture

### Technology Stack

- **Vue.js 3**: Frontend framework with Composition API
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **PrimeVue**: UI component library
- **Vite**: Build tool and development server

### Project Structure

```
src/
├── components/         # Vue components
├── services/          # API service layers
├── utils/            # Utility functions
├── config/           # Configuration files
├── types/            # TypeScript type definitions
└── style/            # Global styles
```

### Service Layer Architecture

The application uses a service-oriented architecture with three main services:

1. **WeatherService**
   - Handles OpenWeather API interactions
   - Provides weather data with TypeScript interfaces
   - Implements error handling for API responses

2. **MapsService**
   - Manages Google Maps functionality
   - Handles geolocation and geocoding
   - Provides map configuration and markers

3. **GalleryService**
   - Manages Unsplash API interactions
   - Handles photo fetching and formatting
   - Implements error handling for API responses

### Design Decisions and Trade-offs

1. **City Name Handling**
   - Implemented consistent city name parsing across services
   - Trade-off: Using first part of city name for better API compatibility
   - Handles multilingual city names by prioritizing Latin script

2. **API Integration**
   - Centralized API key management in environment variables
   - Service layer abstraction for better maintainability
   - Trade-off: Additional code complexity for better organization

3. **UI Components**
   - Used PrimeVue for complex components (Carousel, AutoComplete)
   - Custom styling with Tailwind CSS for flexibility
   - Trade-off: Larger bundle size for better UI components

4. **Responsive Design**
   - Mobile-first approach
   - Optimized image loading and display
   - Trade-off: Complex CSS for better mobile experience
