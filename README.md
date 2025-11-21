# JS Car Wash & Detailing Website

A modern, responsive website for JS Car Wash & Detailing services built with React, TypeScript, and Vite. The website features a comprehensive booking system, service information, product catalog, and customer testimonials.

## 🚗 Features

- **Home Page** - Hero section with car wash services overview
- **About Us** - Company information and benefits
- **Services** - Detailed car wash and detailing service information
  - Car Wash Services
  - Car Detailing Services
- **Products** - Product catalog with pricing and descriptions
- **Booking System** - Multi-step booking form with:
  - Branch selection (Australia & Sri Lanka)
  - Service selection (Car Wash & Car Detailing)
  - Vehicle model selection
  - Package selection
  - Extras and products
  - Date and time scheduling
  - Order summary
- **Gallery** - Before and after photos showcase
- **Testimonials** - Customer reviews and feedback
- **FAQ** - Frequently asked questions
- **Contact Us** - Contact information and inquiry form
- **Login/Register** - User authentication system

## 🛠️ Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JS-Car-Wash-Website-Private
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
JS-Car-Wash-Website-Private/
├── public/
│   ├── Gallery/              # Gallery images
│   ├── JS Car Wash Images/   # Service and product images
│   └── Model/                # Vehicle model images
├── src/
│   ├── components/
│   │   └── navbar/           # Navigation bar component
│   ├── pages/
│   │   ├── about/            # About Us page
│   │   ├── booking/          # Booking system pages
│   │   ├── contact/          # Contact Us page
│   │   ├── faq/              # FAQ page
│   │   ├── footer/           # Footer component
│   │   ├── gallery/          # Gallery page
│   │   ├── home/             # Home page
│   │   ├── login/            # Login/Register page
│   │   ├── products/         # Products page
│   │   ├── services/         # Services pages
│   │   └── testimonials/     # Testimonials page
│   ├── styles/               # Global styles
│   ├── App.tsx               # Main App component with routes
│   └── main.tsx              # Application entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🗺️ Routes

- `/` - Home page
- `/about` or `/aboutus` - About Us page
- `/services` - Services overview
- `/carwash` - Car Wash services
- `/cardetailing` - Car Detailing services
- `/products` - Products catalog
- `/booking` - Booking system
- `/gallery` - Photo gallery
- `/testimonial` - Customer testimonials
- `/faq` - Frequently asked questions
- `/contact` - Contact information
- `/login` - Login/Register page
- `/register` - Redirects to login page

## 🎨 Key Features

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Mobile menu with hamburger navigation

### Booking System
- Multi-step form with validation
- Branch selection (Australia & Sri Lanka)
- Service and package selection
- Vehicle model selection (Hatchback, Sedan, Sports, SUV, Wagon, X-Large)
- Calendar date picker
- Time slot selection
- Order summary with total calculation

### Animations
- Smooth page transitions
- Framer Motion animations
- Hover effects
- Loading states

## 🚀 Building for Production

```bash
# Build the project
npm run build

# The build output will be in the 'dist' directory
# Preview the production build
npm run preview
```

## 📝 Dependencies

### Runtime Dependencies
- `react@^19.2.0`
- `react-dom@^19.2.0`
- `react-router-dom@^7.9.6`
- `framer-motion@^12.23.24`

### Dev Dependencies
- `@types/react@^19.2.4`
- `@types/react-dom@^19.2.3`
- `@vitejs/plugin-react@^5.1.1`
- `typescript@~5.9.3`
- `vite@^7.2.2`

## 🎯 Services Offered

### Car Wash Packages
- **JS Express** - Quick exterior wash
- **JS Platinum** - Standard wash with interior cleaning
- **JS Polish** - Premium wash with hand wax polish

### Car Detailing Packages
- **JS Mini Detail** - Basic detailing package
- **JS Exterior Detail** - Exterior-focused detailing
- **JS Interior Detail** - Interior-focused detailing
- **JS Full Detail** - Complete detailing service
- **Paint Protection & Ceramic Coating** - Premium protection package

## 📞 Contact Information

- **Australia Branch**: 66-72 Windsor parade, Dubbo, 2830, NSW
- **Sri Lanka Branch**: Colombo, Sri Lanka

## 📄 License

This project is private and proprietary.

## 👨‍💻 Development

For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

Built with ❤️ for JS Car Wash & Detailing
