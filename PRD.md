# Product Requirements Document (PRD)

## Ath Yog Wellness Foundation Website

### Product Overview

**Product Name:** Ath Yog Wellness Foundation Website
**Product Type:** Business Website for Yoga & Wellness Center
**Target Audience:** Yoga practitioners, wellness seekers, families, seniors, youth (ages 5-80+)
**Location:** Pune, India
**Business Model:** Service-based (yoga classes, workshops, therapy sessions)

### Business Objectives

1. **Lead Generation:** Convert website visitors into class/workshop bookings via WhatsApp
2. **Brand Awareness:** Establish Ath Yog as a trusted wellness foundation with 20+ years experience
3. **Community Building:** Create an inclusive environment for practitioners of all levels
4. **Revenue Growth:** Drive enrollment in paid yoga programs and therapy sessions

### Core Features & Functionality

#### 1. Hero Section

- **Video Background:** Autoplaying yoga background video with fallback image
- **Call-to-Action:** Primary CTA "Start your journey" and secondary "Book a class"
- **Value Proposition:** "Holistic Yoga Classes in Pune with 20+ Years Experience"
- **Trust Indicators:** Small batches, certified instructors, mind & body balance

#### 2. Services Catalog

- **Program Types:**

  - Weight Loss (Slim Smart Sadhana) - ₹2,999/month
  - Pranayama Workshop - ₹999/workshop
  - Regular Fitness Class - ₹2,000/month
  - Yog Nidra - ₹999/session
  - Kids Yoga - ₹1,500/month
  - Gentle Yoga for Seniors - ₹1,800/month
  - Dynamic Yoga for Youth - ₹2,200/month
  - Advanced Asana Practice - ₹3,500/month
  - Yoga Therapy - ₹4,000/month
  - Yoga for PCOS - ₹3,000/month

- **Filtering System:** All, Beginners, Kids, Senior Citizen, Youth, Advance, Therapy, Health Related
- **Program Details:** Pricing, duration, features, booking CTAs

#### 3. Events Management

- **Dynamic Events:** Loaded from Google Sheets API
- **Event Types:** Workshops, multi-day events
- **Event Information:** Date, time, location, price, description
- **Registration:** WhatsApp-based booking system

#### 4. About Section

- **Founder Story:** Yog Guru Ashwini Patil, 20+ years experience
- **Milestones:** 20+ years teaching, 5000+ lives transformed, 12+ instructors
- **Philosophy:** Authentic practice, inclusive environment, flexible schedule

#### 5. Social Proof

- **Testimonials:** Customer reviews with avatars and ratings
- **Verified Badges:** Trust indicators for authentic reviews

#### 6. Contact & Booking

- **Contact Methods:** Phone, WhatsApp, Email, Physical Address
- **Contact Form:** Name, phone, email, message fields
- **Location Map:** Embedded Google Maps
- **WhatsApp Integration:** Floating CTA button and booking links

### Technical Requirements

#### Frontend Architecture

- **Framework:** Vanilla HTML/CSS/JavaScript (no frameworks)
- **Responsive Design:** Mobile-first approach with breakpoints
- **Performance:** Optimized images, lazy loading, minified CSS
- **Accessibility:** WCAG compliant with ARIA labels, skip links, semantic HTML

#### SEO & Marketing

- **Structured Data:** LocalBusiness, Organization, FAQ, Breadcrumb schemas
- **Meta Tags:** Open Graph, Twitter Cards, canonical URLs
- **Sitemap:** XML sitemap with priority levels
- **Analytics:** Google Analytics 4 integration

#### PWA Features

- **Web App Manifest:** Installable PWA with icons
- **Offline Capability:** Service worker for caching (not implemented yet)

#### Third-Party Integrations

- **Google Sheets API:** Dynamic events loading
- **Google Maps:** Location embedding
- **WhatsApp Business:** Booking and communication
- **Payment Processing:** Third-party gateway integration (mentioned but not implemented)

### User Experience Requirements

#### Navigation

- **Desktop:** Horizontal navigation with hover effects
- **Mobile:** Hamburger menu with slide-out navigation
- **Active States:** Current section highlighting
- **Smooth Scrolling:** Anchor link navigation

#### Visual Design

- **Color Scheme:** Dark theme (#0f0f10 background, #a7f3d0 accent)
- **Typography:** Inter font family, responsive text sizing
- **Animations:** Subtle hover effects, scroll animations, breathing CTA buttons
- **Branding:** Logo with pulse animation, consistent brand colors

#### Performance

- **Loading Speed:** <3 second initial load time
- **Image Optimization:** WebP format, responsive images
- **Code Splitting:** Modular CSS and JavaScript

### Success Metrics

1. **Conversion Rate:** WhatsApp booking clicks
2. **User Engagement:** Time on page, scroll depth, program filtering usage
3. **SEO Performance:** Search rankings for yoga-related keywords
4. **Mobile Usage:** 70%+ mobile traffic conversion
5. **Booking Volume:** Track class enrollment through WhatsApp integration

### Constraints & Limitations

- **Budget:** Static website, no backend development
- **Technology Stack:** Vanilla web technologies only
- **Maintenance:** Manual content updates required
- **Scalability:** Limited by static hosting capabilities

## Development Tasks Breakdown

### High Priority Tasks

1. **Content Management System Integration**

   - Implement headless CMS for dynamic content updates
   - Replace Google Sheets with proper database/API

2. **Booking System Enhancement**

   - Integrate proper booking calendar
   - Add payment processing integration
   - Implement booking confirmation system

3. **Performance Optimization**
   - Implement lazy loading for images
   - Add service worker for PWA functionality
   - Optimize Core Web Vitals scores

### Medium Priority Tasks

4. **Advanced Filtering & Search**

   - Add search functionality for programs
   - Implement advanced filtering options
   - Add sorting capabilities

5. **User Authentication**

   - Member login system
   - Class booking history
   - Personalized recommendations

6. **Content Expansion**
   - Blog section for yoga tips and wellness articles
   - Video gallery for class previews
   - Resource library (pose guides, meditation audio)

### Low Priority Tasks

7. **Community Features**

   - User forum or discussion board
   - Class rating and review system
   - Social media feed integration

8. **Analytics Enhancement**

   - Advanced Google Analytics setup
   - Conversion funnel tracking
   - A/B testing framework

9. **Internationalization**

   - Multi-language support
   - Currency conversion for international visitors

10. **Advanced PWA Features**
    - Push notifications for class reminders
    - Offline class access
    - Progressive web app installation prompts

### Maintenance Tasks

- **Regular Content Updates:** Program pricing, new class schedules, testimonials
- **SEO Monitoring:** Keyword performance, backlink building
- **Security Updates:** Regular dependency updates, security audits
- **Performance Monitoring:** Speed optimization, user experience metrics
- **Backup & Recovery:** Regular backups of Google Sheets data, content assets

---

_This PRD provides a comprehensive foundation for understanding the current state of the Ath Yog website and planning future enhancements to support business growth and user experience improvement._
