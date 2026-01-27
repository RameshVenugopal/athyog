# Ath Yog Wellness Foundation

A modern, responsive website for Ath Yog Wellness Foundation - a premier yoga and wellness center in Pune, India, offering holistic yoga classes, workshops, and therapy sessions for practitioners of all ages and skill levels.

## 🌟 Overview

Ath Yog Wellness Foundation has been transforming lives through authentic yoga practices for over 20 years. Our website serves as a digital gateway for wellness seekers to discover and book our comprehensive range of yoga programs, from beginner-friendly classes to advanced therapy sessions.

## 🎯 Key Features

### Core Functionality

- **Responsive Design**: Mobile-first approach with seamless experience across all devices
- **Program Catalog**: 10+ specialized yoga programs with filtering and detailed information
- **Dynamic Events**: Real-time event loading from Google Sheets integration
- **Booking System**: WhatsApp-based booking for easy customer engagement
- **SEO Optimized**: Structured data, meta tags, and comprehensive sitemap
- **PWA Ready**: Web App Manifest for installable experience

### Programs Offered

- **Slim Smart Sadhana** - Weight management program (₹2,999/month)
- **Pranayama Workshop** - Breathing techniques (₹999/workshop)
- **Regular Fitness Class** - Balanced weekly practice (₹2,000/month)
- **Yog Nidra** - Deep relaxation sessions (₹999/session)
- **Kids Yoga** - Fun yoga for children (₹1,500/month)
- **Gentle Yoga for Seniors** - Senior-friendly practice (₹1,800/month)
- **Dynamic Yoga for Youth** - Energetic sessions for teenagers (₹2,200/month)
- **Advanced Asana Practice** - Complex poses and sequences (₹3,500/month)
- **Yoga Therapy** - Personalized therapeutic sessions (₹4,000/month)
- **Yoga for PCOS** - Specialized wellness program (₹3,000/month)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with CSS Variables, Flexbox, Grid
- **Fonts**: Inter font family from Google Fonts
- **Icons**: Inline SVG icons
- **Analytics**: Google Analytics 4
- **Maps**: Google Maps Embed API
- **Communication**: WhatsApp Business API integration

## 📁 Project Structure

```
ath-yog-site/
├── index.html                 # Main homepage
├── corporate-profile.html     # Redirects to new corporate profile
├── corporate-profile-design-one.html # New Corporate Profile Page
├── slim-smart-sadhana.html    # Detailed program page
├── privacy-policy.html        # Privacy policy page
├── terms-of-service.html      # Terms of service page
├── sitemap.xml               # SEO sitemap
├── robots.txt                # Search engine crawling rules
├── site.webmanifest          # PWA manifest
├── assets/
│   ├── styles.css            # Main stylesheet
│   ├── styles.min.css        # Minified CSS for production
│   ├── images/               # Static images (logos, photos, icons)
│   │   ├── logo.png
│   │   ├── hero.jpg
│   │   ├── about.jpg
│   │   └── [other images...]
│   └── video/                 # Background videos
│       ├── guru.mp4
│       └── yoga-background.mp4
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- Local web server (optional, for testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RameshVenugopal/athyog.git
   cd athyog
   ```

2. **Open in browser**

   - Simply open `index.html` in your web browser
   - For local development, use a local server:

     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve .

     # Using PHP
     php -S localhost:8000
     ```

3. **View the website**
   - Navigate to `http://localhost:8000` (or your chosen port)

## 🎨 Design System

### Color Palette (Vibrant & Playful)

- **Primary**: `#ff6b6b` (Coral Red) - Used for primary actions and highlights
- **Accent**: `#4ecdc4` (Teal) - Used for secondary actions and gradients
- **Navy**: `#2c3e50` (Deep Blue) - Used for text and strong contrasts and borders
- **Cream**: `#fffaf0` (Warm White) - Main background color
- **Lavender**: `#e0d7ff` (Soft Purple) - Used for decorative elements
- **Mint**: `#d7fff1` (Soft Green) - Used for decorative elements

### Typography

- **Headings**: Fredoka (Rounded, friendly font)
- **Body**: Quicksand (Clean, modern sans-serif)

### Components

- **Cards**: "Glassmorphism" inspired with gradients, rounded corners, and hover lift effects
- **Buttons**: Rounded, pill-shaped with shadow and scale effects on hover
- **Navigation**: Sticky header with blur effect
- **Dynamic Elements**: Smooth scrolling, fade-in animations on scroll

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1200px

## 🔍 SEO Features

### Technical SEO

- Semantic HTML5 structure
- Open Graph and Twitter Card meta tags
- Structured data (JSON-LD) for local business
- XML sitemap with priority levels
- Robots.txt configuration

### Content SEO

- Comprehensive meta descriptions
- Alt text for all images
- Internal linking structure
- Mobile-friendly design
- Fast loading performance

## 📊 Analytics & Tracking

### Google Analytics 4

- Page view tracking
- Event tracking for CTAs
- Conversion funnel analysis
- User behavior insights

### Custom Events

- Program filtering interactions
- WhatsApp booking clicks
- Form submissions
- Video engagement

## 🔧 Development Guidelines

### Code Style

- **HTML**: Semantic, accessible markup
- **CSS**: BEM-like naming, CSS variables for theming
- **JavaScript**: Vanilla ES6+, modular functions
- **Performance**: Optimized images, lazy loading, minification

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios maintained
- Skip links for navigation

## 🚀 Deployment

### Production Build

```bash
# Minify CSS (if using build tools)
# The project includes pre-minified styles.min.css

# Optimize images
# Use tools like ImageOptim or TinyPNG for production images

# Deploy to hosting provider
# Options: Netlify, Vercel, GitHub Pages, traditional hosting
```

### Hosting Requirements

- HTTPS support (required for PWA)
- Static file serving
- Custom domain support
- CDN for global performance

## 📈 Performance Metrics

### Core Web Vitals Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Current Performance

- **Page Size**: ~500KB (optimized)
- **Requests**: ~20 (efficient loading)
- **Mobile Score**: 95+ (Lighthouse)

## 🤝 Contributing

### Content Updates

1. Update HTML content in respective files
2. Test responsive design across devices
3. Validate HTML accessibility
4. Update sitemap.xml if new pages added

### Development Workflow

1. Create feature branch
2. Make changes with proper commit messages
3. Test across browsers and devices
4. Submit pull request with description

## 📞 Support & Contact

- **Website**: [https://athyog.in](https://athyog.in)
- **Email**: info@athyog.in
- **Phone**: +91 93700 19475
- **WhatsApp**: [https://wa.link/a0lxj5](https://wa.link/a0lxj5)
- **Address**: Kamaldeep Bunglow, Erandwane, Pune, Maharashtra, India

## 📜 License

© 2025 Ath Yog Wellness Foundation. All rights reserved.

## 🙏 Acknowledgments

- **Founder**: Yog Guru Ashwini Patil
- **Design Inspiration**: Modern wellness website trends
- **Technology**: Open source web standards
- **Community**: Yoga practitioners and wellness seekers

---

_Built with ❤️ for the yoga and wellness community in Pune_
