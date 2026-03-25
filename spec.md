# Vazhalai - Tamil Cultural Catering & Matrimony Website

## Current State
New project. Empty backend (main.mo scaffold only). No frontend implementation.

## Requested Changes (Diff)

### Add
- Catering service listings with name, description, category, and contact info
- Matrimony profile listings with name, age, location, education, profession, and bio
- Homepage with hero section, catering cards, matrimony profile cards
- Navigation with sections: Home, Catering Services, Matrimony, Contact
- Contact form for inquiries
- Filter for matrimony profiles by community, location, and education
- Admin ability to add/edit/remove catering services and matrimony profiles

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: Catering services CRUD (id, name, description, category, imageUrl, phone, priceRange)
2. Backend: Matrimony profiles CRUD (id, name, age, gender, location, education, profession, bio, community, imageUrl, contactEmail)
3. Backend: Contact form submission storage
4. Frontend: Full website matching warm Tamil cultural design
   - Header with logo, nav links, Sign In button
   - Hero section with two CTAs
   - Catering services 3-column card grid
   - Matrimony 4-column profile card grid with filters
   - Footer with links and newsletter signup
