# Design Guidelines: Rex Bedachungs GmbH

## Design Approach

**Reference-Based Approach** inspired by successful local service business websites, combining the trust-building elements of Airbnb's hospitality design with the professional clarity of Apple's minimalism and the service-focused layouts of established craftsman websites.

**Core Principle:** Create a trustworthy, professional presence that converts visitors into customers through clear service presentation and strong calls-to-action.

---

## Color Palette

### Dark Mode (Primary)
- **Background Primary:** 25 3% 12% (deep charcoal, slightly warmer than pure black)
- **Background Secondary:** 0 0% 18% (elevated surfaces, cards)
- **Text Primary:** 0 0% 98% (high contrast white)
- **Text Secondary:** 0 0% 70% (muted text, descriptions)
- **Brand Red:** 0 68% 42% (Dachziegel-Rot #B22222 for CTAs, accents)
- **Brand Red Hover:** 0 68% 36% (darker for interactions)
- **Border/Divider:** 0 0% 25% (subtle separation)

### Light Mode
- **Background Primary:** 0 0% 98%
- **Background Secondary:** 0 0% 100%
- **Text Primary:** 0 0% 15%
- **Text Secondary:** 0 0% 40%
- **Brand Red:** 0 68% 42% (consistent across modes)
- **Brand Red Hover:** 0 68% 36%
- **Border/Divider:** 0 0% 88%

**Accent Usage:** Use Brand Red sparingly—primary CTAs, navigation highlights, and key interactive elements only. Avoid gold/yellow accents.

---

## Typography

**Font Stack:** System Sans-Serif
```
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

**Scale & Hierarchy:**
- **Hero Headline (H1):** text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight
- **Section Headlines (H2):** text-3xl md:text-4xl lg:text-5xl, font-bold
- **Subsection Headlines (H3):** text-2xl md:text-3xl, font-semibold
- **Card Titles:** text-xl md:text-2xl, font-semibold
- **Body Large:** text-lg md:text-xl, font-normal, leading-relaxed
- **Body Regular:** text-base md:text-lg, font-normal, leading-relaxed
- **Small/Meta:** text-sm, font-medium, tracking-wide, uppercase for labels

**Line Height:** Generous spacing for readability—use leading-relaxed (1.625) for body text, leading-tight (1.25) for headlines.

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm.

**Container Strategy:**
- Full-width sections: `w-full` with inner `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`
- Content sections: `max-w-6xl mx-auto`
- Text-heavy content: `max-w-4xl mx-auto`
- Forms: `max-w-2xl mx-auto`

**Vertical Rhythm:**
- Section padding: `py-16 md:py-20 lg:py-24`
- Component spacing: `space-y-8 md:space-y-12`
- Card padding: `p-6 md:p-8`

**Grid Patterns:**
- Services grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`
- References grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- Two-column content: `grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16`

---

## Component Library

### Navigation
- **Sticky header** with subtle backdrop blur (`backdrop-blur-md bg-background/90`)
- Desktop: Horizontal nav with dropdown for "Leistungen"
- Mobile: Hamburger menu, full-screen overlay
- Logo: Simple "R" or "Rex" text mark, size `h-8 md:h-10`
- CTA button in nav: Brand Red, prominent placement

### Hero Section
- **Full-width hero** with high-quality roofing imagery (80-90vh)
- Dark overlay gradient for text legibility (`from-black/60 to-black/30`)
- Centered content with claim, 40-60 word description
- Dual CTAs: Primary ("Angebot anfragen", Brand Red) + Secondary ("Anrufen", outline with blur background)
- Include trust indicator below CTAs: "Meisterbetrieb • 20+ Jahre Erfahrung • Ruhrgebiet"

### Service Cards
- Elevated cards with subtle shadow and border
- Card structure: Image top (16:9 aspect), icon/badge, title, 2-3 bullet points, "Mehr erfahren" link
- Hover state: Slight lift (translate-y), increased shadow
- Icon style: Line icons from Heroicons, Brand Red color

### Reference/Portfolio Cards
- Grid layout with consistent aspect ratio (4:3)
- Overlay on hover revealing: Project type, location, brief description
- Bottom info bar: Project name, year

### CTA Sections
- Full-width colored backgrounds (Brand Red or Deep Charcoal)
- Centered content: Headline, supporting text, primary CTA button
- Contact info repeated: Phone (tel: link), WhatsApp hint, Email

### Forms
- Generous input padding (`px-4 py-3`)
- Subtle borders, focus state with Brand Red ring
- Labels above inputs, always visible
- Honeypot field: `absolute -left-[9999px]`
- Submit button: Full-width on mobile, inline on desktop, Brand Red
- Form wrapper: White/light card on dark background with padding

### Footer
- Multi-column layout: Company info, Quick links, Services, Contact
- Include: Logo, address (with Schema.org markup), hours, phone, email
- Social links placeholder (if applicable)
- Bottom bar: Copyright, Impressum, Datenschutz links
- Newsletter signup: Optional inline form

---

## Images

**Hero Image:** Large, high-quality roofing work photo (modern home, clean lines, professional craftsmanship). Aspect 16:9, covers full section height.

**Service Pages:** Each service gets a relevant hero image (Steildach: pitched roof, Flachdach: flat roof detail, etc.). 16:9 aspect.

**Reference Grid:** 6 project images, 4:3 aspect, showing completed work—variety of roof types, different buildings.

**About Us:** Team photo (placeholder of workers in branded workwear), office/workshop exterior.

**Placeholders:** Use https://picsum.photos with specific dimensions and grayscale filter for professional look. Alt texts: Descriptive, service-specific (e.g., "Modernes Steildach mit roten Ziegeln in Bochum").

---

## Interactions & States

**Minimize animations** to maintain professional, no-nonsense feel:
- Smooth scrolling for anchor links
- Subtle hover states: `transition-all duration-200`
- Button hover: Slight darkening of Brand Red
- Card hover: Small lift (`hover:-translate-y-1`)
- No scroll-triggered animations or parallax effects

**Focus States:** Clear Brand Red focus rings for keyboard navigation (`focus:ring-2 focus:ring-brand-red`)

---

## Accessibility

- **Semantic HTML:** Proper heading hierarchy (h1 → h2 → h3)
- **ARIA labels:** Navigation landmarks, button purposes
- **Color contrast:** Minimum 4.5:1 for text, 3:1 for UI elements
- **Keyboard navigation:** All interactive elements accessible via Tab
- **Alt texts:** Descriptive, concise (under 125 characters)

---

## Mobile-First Considerations

- **Touch targets:** Minimum 44x44px for all buttons/links
- **Readable font sizes:** Never below 16px to prevent zoom
- **Click-to-call:** Prominently placed phone numbers with `tel:` links
- **Sticky mobile header:** Compact, with hamburger menu
- **Form inputs:** Large enough for thumbs, adequate spacing
- **Image optimization:** Responsive images with `srcset`, lazy loading

---

This design creates a trustworthy, conversion-focused presence that respects traditional craftsmanship values while presenting a modern, professional digital face for Rex Bedachungs GmbH.