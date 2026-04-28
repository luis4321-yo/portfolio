# Portfolio Website

A modern portfolio website built with React, Vite, and Tailwind CSS.

## Features

- Animated particle network background
- Interactive project cards with hover effects
- Responsive design for all devices
- Modern, minimalist aesthetic
- Smooth scrolling navigation

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The site will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## File Structure

```
portfolio/
├── src/
│   ├── portfolio.jsx       # Main portfolio component
│   ├── App.jsx             # App wrapper
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles with Tailwind
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies and scripts
└── .eslintrc.cjs           # ESLint configuration
```

## Customization

### Edit Portfolio Content

Open `src/portfolio.jsx` and update:
- `Your Name` - Replace with your actual name
- `projects` array - Add your own projects with descriptions
- Social links in the footer - Add your GitHub, LinkedIn, etc.

### Styling

- Tailwind CSS classes are used for styling
- Edit `src/index.css` for global styles
- Edit `tailwind.config.js` to customize the theme

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing (optional)
- **Framer Motion** - Animation library (optional)
- **React Icons** - Icon library (optional)

## License

MIT
