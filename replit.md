# Rex Bedachungs GmbH - Website Project

## Overview

This is a modern, responsive website for Rex Bedachungs GmbH, a roofing company (Dachdeckerbetrieb) serving the Ruhr region in Germany. The website presents the company's services, references, team information, career opportunities, and contact details.

**Tech Stack:**
- **Frontend:** React with TypeScript, Vite build system
- **Routing:** Wouter (lightweight client-side routing)
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Radix UI primitives with shadcn/ui patterns
- **Forms:** React Hook Form with Zod validation
- **State Management:** TanStack Query (React Query)
- **Backend:** Express.js (minimal, serves static files in production)
- **Database:** Drizzle ORM configured for PostgreSQL (via Neon serverless)

**Purpose:** Professional business website for lead generation and customer information, focusing on static content delivery with minimal backend requirements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component-Based React Application:**
- Single-page application (SPA) with client-side routing via Wouter
- Page components located in `client/src/pages/` contain all site content
- Reusable UI components in `client/src/components/`
- Design system implemented through Tailwind CSS with custom theme variables
- Responsive-first approach (mobile-first design)

**Design System:**
- Dark mode primary with light mode support
- Custom color palette: Dark charcoal backgrounds, brand red (#B22222) for CTAs
- System sans-serif font stack for performance
- Consistent spacing and typography scale defined in `design_guidelines.md`
- shadcn/ui component library with custom theming in `tailwind.config.ts`

**Build Strategy:**
- Vite for fast development and optimized production builds
- Static asset generation to `dist/public/` for deployment
- No server-side rendering (SSR) - fully static after build
- Code splitting and lazy loading via dynamic imports

### Backend Architecture

**Minimal Express Server:**
- Development: Vite dev server with HMR (Hot Module Replacement)
- Production: Express serves pre-built static files from `dist/public/`
- Server code in `server/` directory handles API routes and static serving
- Contact form sends real emails with image attachments via Resend API

**Session & Storage:**
- In-memory storage implementation (`MemStorage` class) for user data
- Ready for database integration via Drizzle ORM
- Session management setup with `connect-pg-simple` (not actively used)

**API Structure:**
- Routes prefixed with `/api` (defined in `server/routes.ts`)
- `/api/contact` - POST endpoint for contact form submissions with image uploads
- Uses Multer for multipart/form-data file handling (up to 5 images, 5MB each)
- Resend API integration for transactional email sending
- Storage interface ready for CRUD operations when needed

### Data Storage Solutions

**Database Configuration:**
- Drizzle ORM configured for PostgreSQL
- Schema defined in `shared/schema.ts` with users table
- Neon serverless PostgreSQL adapter (`@neondatabase/serverless`)
- Migration files generated to `migrations/` directory
- Currently using in-memory storage; database ready for future use

**Schema Design:**
- Users table with UUID primary key, username, and password fields
- Zod validation schemas for type-safe inserts
- Drizzle-Zod integration for seamless validation

### SEO & Performance

**Search Engine Optimization:**
- React Helmet for dynamic meta tags per page
- Semantic HTML structure with proper heading hierarchy
- Open Graph tags for social media sharing
- Schema.org LocalBusiness structured data (on homepage)
- `robots.txt` and sitemap generation ready
- Descriptive alt texts for all images

**Performance Optimizations:**
- Lazy loading for images and routes
- Minimal JavaScript footprint
- No analytics or tracking cookies (GDPR-friendly)
- Static asset optimization via Vite
- System fonts to avoid external font loading

### Accessibility

**WCAG Compliance Approach:**
- Semantic HTML elements (nav, main, footer, article)
- ARIA labels for interactive elements
- Keyboard navigation support via Radix UI primitives
- High contrast color ratios (defined in design guidelines)
- Focus states on all interactive elements
- Screen reader friendly component structure

### Content Management

**Static Content Approach:**
- All content is code-based in React components
- Page content in `client/src/pages/` directory
- Easy text updates by editing TSX files
- No CMS - content changes require rebuild and redeploy
- Images stored in `attached_assets/generated_images/` directory

**Key Pages:**
- Home (Hero, services overview)
- Services overview + 5 detail pages (Steildach, Flachdach, Bauklempnerei, Dachfenster, Dachwartung)
- References (project gallery)
- About (company history, team)
- Careers (job listings)
- Contact (form, contact details, map placeholder)
- Legal (Impressum, Datenschutz)
- 404 error page

## External Dependencies

### Third-Party Services

**Active Services:**
- **Resend API**: Transactional email service for contact form submissions
  - API key stored in `RESEND_API_KEY` environment variable
  - Development mode: Sends to verified email (tim.rex@gmx.de)
  - Production: Requires domain verification to send to info@rex-bedachung.de
  - Free tier: 100 emails/day, 3,000 emails/month
- Image storage: Using local generated images in `attached_assets/`
- Google Maps: Embedded iframe for location display

**Potential Integrations (Future):**
- Analytics: Code prepared for Plausible Analytics (GDPR-friendly, currently commented out)
- WhatsApp: Click-to-chat mentioned in contact section (URL-based, no API)

### NPM Packages

**Core Framework:**
- `react` & `react-dom`: UI library
- `vite`: Build tool and dev server
- `wouter`: Lightweight routing
- `express`: Production server for static files

**UI & Styling:**
- `tailwindcss`: Utility-first CSS framework
- `@radix-ui/*`: Unstyled, accessible UI primitives (accordion, dialog, dropdown, etc.)
- `class-variance-authority`: Variant-based component styling
- `clsx` & `tailwind-merge`: ClassName utilities

**Forms & Validation:**
- `react-hook-form`: Form state management
- `zod`: Schema validation
- `@hookform/resolvers`: RHF + Zod integration
- `zod-validation-error`: User-friendly Zod error messages

**Data & State:**
- `@tanstack/react-query`: Server state management
- `drizzle-orm`: SQL ORM
- `@neondatabase/serverless`: PostgreSQL adapter
- `drizzle-zod`: Zod schema generation from Drizzle

**File Upload & Email:**
- `multer`: Multipart/form-data file upload handling
- `@types/multer`: TypeScript definitions for Multer
- `resend`: Email sending service (transactional emails)

**Development Tools:**
- `typescript`: Type safety
- `tsx`: TypeScript execution for dev server
- `esbuild`: Fast bundling for server code
- `@replit/*` plugins: Replit-specific development enhancements

### Database & Hosting

**Database:**
- PostgreSQL (via Neon serverless)
- Connection string via `DATABASE_URL` environment variable
- Currently optional - app works without database

**Deployment Target:**
- Static hosting compatible (Netlify, Vercel, etc.)
- Can also run as Node.js app with Express server
- Build output: `dist/public/` (static files) + `dist/index.js` (server)

### Browser Support

- Modern browsers with ES6+ support
- Mobile-responsive (tested breakpoints: sm, md, lg)
- Progressive enhancement approach
- No Internet Explorer support