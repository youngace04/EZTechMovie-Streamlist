EZTechMovie

A comprehensive React-based web application for movie enthusiasts and tech shoppers. EZTechMovie combines a streaming watchlist manager with a subscription-based movie service and an e-commerce cart for EZTech accessories. Built with modern React tools, it offers seamless navigation, local storage persistence, and integration with The Movie Database (TMDB) API.

Features
- StreamList: A personalized watchlist for adding, editing, deleting, and marking movies/shows as completed. Persists data via localStorage with activity logging.
- Movies: Browse popular movies from TMDB with posters, overviews, ratings, and release dates, with lazy-loaded images for performance.
- Subscriptions: Shop for tiered subscriptions (Basic, Gold, Premium, Social Media) and EZTech accessories (T-shirts, Cases). 
- Subscriptions limited to one per type with warnings for duplicates.
- Accessories support multiple quantities.
- Stock tracking and out-of-stock handling.
- Cart: Full shopping cart with quantity adjustments, item removal, subtotal calculations, and persistence. Displays total items in Navbar.
- Navigation: Responsive Navbar with cart item count badge for quick access.
- About: Placeholder for project details (coming soon).



Technologies
- Frontend: React 18+ (with Hooks like useState, useEffect)
- Routing: React Router DOM
- State Management: Custom useLocalStorage hook for cart and list persistence
- API: TMDB API for movie data
- Styling: CSS Modules (Tailwind-inspired for clean, responsive design)
- Icons: React Icons (FaEdit, FaTrash, FaCheck)
- Build Too: Create React App
- Deployment: Vercel/Netlify 

Installation

1. Clone the Repository
    git clone https://github.com/yourusername/eztechmovie.git
   cd eztechmovie
   

2. Install Dependencies
        npm install
  
 
3. Environment Setup
   - Create a .env file in the root:
     REACT_APP_TMDB_API_KEY=tmdb_api_key_here
    
   - Get a free TMDB API key from The Movie Database           (https://www.themoviedb.org/settings/api).

4. Run Locally
     npm start
   
   
   - App runs on http://localhost:3000.

Usage

- Navigate via the top Navbar.
- Add movies to your StreamList on the home page.
- Browse popular movies on the Movies page.
- Shop subscriptions and accessories on the Subscriptions page—add to cart and view totals.
- Manage your cart: Adjust quantities, remove items, and simulate checkout.

Example: Adding to Cart
- Click "Add to Cart" on a subscription item (e.g., Basic Subscription). Only one allowed.
- For accessories like "EZ Tech T-Shirt", add multiple times to increase quantity.
- Cart updates persist across sessions.





