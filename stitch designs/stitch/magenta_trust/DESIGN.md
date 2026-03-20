# Magenta Executive Design System

### 1. Overview & Creative North Star
**Creative North Star: The Sovereign Architect**
Magenta Executive is a design system built for high-stakes financial and corporate environments where authority meets modern agility. It moves away from the sterile "SaaS blue" aesthetic into a world of deep magentas, ink-blacks, and expansive whitespace. The system rejects the standard grid in favor of a "Editorial Authority" layout—using extreme typographic scales (3.75rem to 4.5rem) and intentional asymmetry to guide the eye through complex narratives without friction.

### 2. Colors
The palette is dominated by **Primary Magenta (#BA2979)** and **Deep Midnight (#160D2D)**.
- **The "No-Line" Rule:** Visual boundaries are created via tonal shifts. A section should transition from `surface` to `surface_container_low` (#eef4ff) rather than using a 1px border.
- **Surface Hierarchy:** Depth is achieved through "pockets" of color. Cards use `surface_container_lowest` (#ffffff) sitting on top of `surface_container_low` backgrounds to create a subtle lift.
- **Glass & Gradient:** Navigation and floating panels must use a 80% opacity blur (`backdrop-blur-lg`) to maintain context of the content beneath.
- **Signature Textures:** High-impact sections (like the Impact area) utilize skewed geometric overlays (primary-tinted shapes at 5% opacity) to break the monotony of flat backgrounds.

### 3. Typography
The system uses **Inter** across all levels, relying on weight and tracking rather than font switching to establish hierarchy.
- **Display/H1:** 3.75rem (60px) to 4.5rem (72px). Black weight (900), tight tracking (-0.05em).
- **Headlines:** 2.25rem (36px) to 3rem (48px). Extra Bold.
- **Body:** 1.125rem (18px) to 1.25rem (20px). Light to Regular weight for long-form readability.
- **Label/Small:** 0.75rem (12px) to 0.875rem (14px). Bold and Uppercase with high tracking (0.1em) for "Executive Reports" or metadata.

### 4. Elevation & Depth
Elevation is expressed through soft, environmental shadows rather than harsh outlines.
- **The Layering Principle:** Use `surface-container` tiers to stack information. The deeper the information, the lighter the background container.
- **Ambient Shadows:** 
  - **Low (shadow-sm):** Used for interactive cards.
  - **Medium (shadow-lg):** Standard for floating elements.
  - **High (shadow-xl):** 0px 48px 96px -24px with a 12% opacity of the #160D2D shadow color for a "lifting off the page" effect.
- **Glassmorphism:** Navigation bars must use `bg-white/80` with a 32px blur to signify their position at the top of the Z-axis.

### 5. Components
- **Buttons:** Pill-shaped (rounded-full). Primary buttons use a high-contrast Magenta-to-White scheme. Secondary buttons use `surface-container-high` to blend into the background.
- **Cards:** No borders. Large corner radii (0.75rem to 1.5rem). Use "Bento" style layouts with varying heights to create visual rhythm.
- **Chips:** Small, rounded-full, using `secondary-container` backgrounds with bold, tracked-out text.
- **Inputs:** Minimalist. Underline or subtle background shift instead of heavy boxes.

### 6. Do's and Don'ts
**Do:**
- Use extreme contrast between text sizes to create drama.
- Use wide gutters (32px+) and generous section padding (80px+).
- Lean into the "Midnight" color for footers and high-impact "Impact" sections to reset the user's visual palette.

**Don't:**
- Never use a 1px solid border to separate sections.
- Avoid standard "Primary Blue" links; use Magenta for all interactive text.
- Do not use sharp corners (radius 0) unless specifically requested for a brutalist sub-brand; the default is organic and pill-shaped.