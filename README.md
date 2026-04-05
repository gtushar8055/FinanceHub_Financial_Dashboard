# FinanceHub - Personal Finance Dashboard

A modern, interactive personal finance dashboard built with React that provides real-time analytics, visual data representation, and an intuitive calendar interface for managing transactions.

![React](https://img.shields.io/badge/React-19.2.4-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4) ![Vite](https://img.shields.io/badge/Vite-8.0-646CFF)

---

## 📋 Table of Contents

- [Overview of Approach](#overview-of-approach)
- [Setup Instructions](#setup-instructions)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

---

## 🎯 Overview of Approach

### Design Philosophy

This dashboard was built with a focus on **user experience**, **performance**, and **visual clarity**. The approach emphasizes:

1. **Component-Based Architecture**
   - Modular React components for maintainability
   - Context API for centralized state management
   - Custom hooks for reusable logic

2. **Performance Optimization**
   - Memoized calculations to prevent unnecessary re-renders
   - Debounced search for smooth filtering
   - Lazy evaluation of complex statistics
   - Efficient date grouping algorithms

3. **Visual Hierarchy**
   - Color-coded indicators (green for income, red for expenses)
   - Interactive charts using Recharts library
   - Smooth animations for better user feedback
   - Responsive design adapting to all screen sizes

4. **Data Management Strategy**
   - LocalStorage for data persistence
   - Immutable state updates for predictability
   - Computed properties for derived data
   - Export functionality (CSV/JSON) for backups

5. **User Interaction Design**
   - Dual view modes (List and Calendar)
   - Keyboard shortcuts for power users
   - Real-time search and filtering
   - Inline editing with confirmation dialogs

### Key Design Decisions

**State Management**: React Context API was chosen over Redux for simplicity and adequate state needs. All financial data, user preferences, and UI state are managed centrally.

**Styling Approach**: Tailwind CSS provides utility-first styling with a warm amber color scheme for a professional, trustworthy feel. Dark mode support enhances usability in different environments.

**Calendar Implementation**: Custom-built calendar component with date-based transaction grouping. Clicking a date displays a floating popup near the selected date for better UX than traditional modals.

**Data Visualization**: Recharts library selected for its React-native approach and extensive chart options. Pie charts show category breakdowns, area charts display trends over time.

---

## 🚀 Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version 16.x or higher)
- **npm** (version 7.x or higher) or **yarn**

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Finance_Dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will open at `http://localhost:5173`

4. **Build for production**

   ```bash
   npm run build
   ```

   Production files will be generated in the `dist` folder.

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Environment Setup

No environment variables are required for basic functionality. The app uses LocalStorage for data persistence.

**Optional**: Create a `.env` file if you plan to integrate with a backend API:

```env
VITE_API_URL=your_api_endpoint
```

### Deployment

The project is optimized for deployment on Vercel, Netlify, or any static hosting service:

**Vercel Deployment:**

```bash
npm install -g vercel
vercel --prod
```

**Build Settings:**

- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite (auto-detected)

---

## ✨ Features

### 1. Interactive Calendar View

**Description**: A monthly calendar interface showing all transactions with visual indicators.

**How it works**:

- Each date displays colored dots (green = income, red = expense)
- Click any date to see a floating popup with transaction details
- Navigate between months with smooth slide animations
- Automatically opens to the most recent month with data
- Monthly summary cards show total income, expenses, and net balance

**Technical Implementation**:

- Date grouping algorithm maps transactions to calendar dates
- Floating popup positioned dynamically relative to clicked date
- Memoized calendar generation for performance
- Local timezone handling ensures accurate date matching

### 2. Real-Time Balance Tracking

**Description**: Animated balance display with live income/expense comparison.

**How it works**:

- Main balance counter animates on value changes
- Income and expense cards show totals with category icons
- Mini sparkline charts visualize recent trends
- Color-coded indicators (green positive, red negative)

**Technical Implementation**:

- Custom `AnimatedCounter` component with easing functions
- `useTransactionStats` hook computes aggregated data
- Memoized calculations prevent unnecessary updates

### 3. Dual View Modes

**Description**: Toggle between List view and Calendar view for different perspectives.

**How it works**:

- **List View**: Grid of transaction cards with search and filters
- **Calendar View**: Monthly calendar with date-based transaction grouping
- View mode persists during session
- Smooth transitions between views

**Technical Implementation**:

- Conditional rendering based on `viewMode` state
- Shared transaction data across both views
- Independent filter states for each view

### 4. Advanced Search & Filtering

**Description**: Real-time search with multi-category filtering.

**How it works**:

- Search by transaction description or category
- Filter by one or multiple categories
- Instant results with debounced search (300ms delay)
- Clear visual feedback for active filters

**Technical Implementation**:

- `useDebounce` hook prevents excessive filtering
- Combined filter logic using `useMemo` for efficiency
- Filter chips with toggle functionality

### 5. Transaction Management (Admin Mode)

**Description**: Full CRUD operations on transactions with role-based access.

**How it works**:

- Add new transactions with validation
- Edit existing transactions inline
- Delete with double-confirmation
- Admin/Viewer role toggle for demos

**Technical Implementation**:

- Modal-based forms with controlled inputs
- Optimistic UI updates
- LocalStorage synchronization after each change

### 6. Visual Analytics Dashboard

**Description**: Charts and graphs showing spending patterns and trends.

**How it works**:

- **Pie Chart**: Category-wise expense breakdown with percentages
- **Area Chart**: Monthly income vs expense trends
- **Bar Chart**: Category spending comparison
- Interactive tooltips with formatted values (INR currency)

**Technical Implementation**:

- Recharts library for React-native charts
- Data transformation from transaction array to chart-ready format
- Responsive chart containers adapting to screen size

### 7. Smart Insights Panel

**Description**: AI-powered spending analysis and recommendations.

**How it works**:

- Identifies highest spending category
- Calculates average monthly expenses
- Computes savings rate percentage
- Provides actionable recommendations

**Technical Implementation**:

- Statistical calculations on transaction data
- Conditional insight generation based on spending patterns
- Slide-out drawer with keyboard shortcut (`Ctrl+I`)

### 8. Keyboard Shortcuts

**Description**: Power user features for faster navigation.

**How it works**:

- `Ctrl+K` / `Cmd+K`: Open command palette
- `Ctrl+I` / `Cmd+I`: Toggle insights drawer
- `Escape`: Close modals and panels

**Technical Implementation**:

- Custom `useKeyboardShortcuts` hook
- Event listener management with cleanup
- Cross-platform modifier key detection (Ctrl/Cmd)

### 9. Data Export

**Description**: Export transaction data for backups or analysis.

**How it works**:

- Export to CSV format (Excel-compatible)
- Export to JSON format (developer-friendly)
- Includes all transaction fields
- Timestamped filenames

**Technical Implementation**:

- Blob creation for file downloads
- Dynamic `<a>` element for triggering download
- CSV formatting with proper escaping

### 10. Dark Mode Support

**Description**: Toggle between light and dark themes.

**How it works**:

- One-click theme switching
- Preference saved to LocalStorage
- All components styled for both themes
- Smooth color transitions

**Technical Implementation**:

- Tailwind's dark mode with class strategy
- Context-based theme state
- CSS transitions for color changes

### 11. Responsive Design

**Description**: Optimized layout for all device sizes.

**How it works**:

- Mobile-first design approach
- Breakpoints: mobile (< 640px), tablet (640px+), desktop (1024px+)
- Touch-friendly interactive elements
- Hamburger menu on mobile (if sidebar implemented)

**Technical Implementation**:

- Tailwind responsive utilities (`sm:`, `md:`, `lg:`)
- Flexible grid layouts
- Media query-based component adjustments

---

## 📁 Project Structure

```
Finance_Dashboard/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── ActivityFeed.jsx           # Transaction list with dual view modes
│   │   ├── TransactionCalendar.jsx    # Interactive calendar component
│   │   ├── HeroBalance.jsx            # Main balance display with animation
│   │   ├── CategoryBreakdown.jsx      # Pie chart of expenses
│   │   ├── InsightsDrawer.jsx         # Slide-out analytics panel
│   │   ├── CommandBar.jsx             # Top navigation bar
│   │   ├── CommandPalette.jsx         # Keyboard shortcut interface
│   │   ├── TransactionModal.jsx       # Add/Edit transaction form
│   │   └── StickyMiniBar.jsx          # Floating balance indicator
│   ├── context/
│   │   └── FinanceContext.jsx         # Global state management
│   ├── hooks/
│   │   ├── useDebounce.js             # Search debouncing
│   │   ├── useTransactionStats.js     # Financial calculations
│   │   ├── useKeyboardShortcuts.js    # Keyboard event handling
│   │   ├── useScrollPosition.js       # Scroll tracking
│   │   └── useLocalStorage.js         # LocalStorage wrapper
│   ├── data/
│   │   └── mockData.js                # Sample transaction data
│   ├── App.jsx                        # Root component
│   ├── main.jsx                       # Application entry point
│   └── index.css                      # Global styles and Tailwind imports
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json                        # Vercel deployment configuration
└── README.md
```

### Key Files Explained

- **FinanceContext.jsx**: Manages all application state including transactions, user preferences, and modal states. Provides helper functions for CRUD operations.

- **useTransactionStats.js**: Custom hook that computes monthly data, category breakdowns, and financial statistics. Memoized for performance.

- **TransactionCalendar.jsx**: Complex component handling calendar rendering, date calculations, and transaction grouping. Includes popup modal logic.

- **ActivityFeed.jsx**: Manages both list and calendar view modes. Includes search, filter, and transaction card rendering.

- **mockData.js**: Sample transactions spanning multiple months for demonstration. Replace with API integration in production.

---

## 🛠️ Technologies Used

### Core Technologies

- **React 19.2.4** - Component-based UI library
- **Vite 8.0** - Fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework

### Libraries

- **Recharts 3.8** - Charting library for data visualization
- **Lucide React 1.7** - Icon library with 1000+ icons

### Development Tools

- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing with Autoprefixer

### State Management

- **React Context API** - Global state management
- **LocalStorage** - Data persistence

### Deployment

- **Vercel** - Hosting and continuous deployment
- **Git** - Version control

---

## 🎨 Design System

### Color Palette

- **Primary**: Amber tones (#92400e, #d97706, #fbbf24)
- **Success**: Green (#15803d, #22c55e)
- **Danger**: Red (#dc2626, #ef4444)
- **Neutral**: Zinc/Gray shades
- **Dark Mode**: Inverted with zinc-900 backgrounds

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Spacing & Layout

- Consistent 2px borders throughout
- 8px base spacing unit
- Rounded corners (8px-16px)
- Card-based layouts with shadows

---

## 🔄 Data Flow

1. **User Interaction** → Component triggers action
2. **Context Method** → Update function called (addTransaction, editTransaction, etc.)
3. **State Update** → React Context state modified
4. **LocalStorage Sync** → Changes persisted to browser storage
5. **Re-render** → Components consuming context re-render with new data
6. **Statistics Recalculation** → Memoized hooks recompute if dependencies changed

---

## 📊 Performance Optimizations

- **Memoization**: `useMemo` for expensive calculations
- **Debouncing**: Search input delayed by 300ms
- **Code Splitting**: Dynamic imports for large components (if needed)
- **Image Optimization**: SVG icons for small file sizes
- **CSS Purging**: Tailwind removes unused styles in production
- **Lazy Loading**: Components loaded on-demand

---

## 🔒 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 👨‍💻 Author

Made by - Tushar Gupta

---

## 🚀 Future Enhancements

Potential features for future versions:

- Backend API integration
- Multi-user support with authentication
- Budget goals and alerts
- Recurring transaction automation
- Receipt image uploads
- Bank account synchronization
- Mobile app (React Native)
- Advanced analytics with ML predictions

---

**Ready to manage your finances? Get started now!** 💰
