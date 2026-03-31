# AI Tử Vi - Vietnamese Astrology Web App

A beautiful, modern web application for Vietnamese Tử Vi (Purple Star Astrology) analysis powered by AI-style interpretations.

## Features

- **Lập Lá Số Tử Vi** — Calculate full Tử Vi birth charts with 14 major stars, auxiliary stars, and 12 palaces
- **AI Luận Giải** — Intelligent analysis of career, love, health, and overall fortune
- **Interactive Chart** — Visual 12-palace grid chart with clickable palace details
- **Responsive Design** — Beautiful cosmic-themed UI that works on all devices
- **Multiple Pages** — Landing page, chart calculator, pricing, and about pages

## Getting Started

No build tools required! Just serve the files with any HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Then open http://localhost:8080
```

## Project Structure

```
├── index.html          # Landing page
├── xem-tuvi.html       # Tử Vi chart calculator
├── pricing.html        # Pricing packages
├── about.html          # About page
├── css/
│   └── style.css       # All custom styles
├── js/
│   ├── tuvi-engine.js  # Core Tử Vi calculation engine
│   ├── tuvi-analysis.js # AI-style analysis text generator
│   └── app.js          # Main application logic
└── README.md
```

## Tech Stack

- Pure HTML5, CSS3, JavaScript (no frameworks)
- Custom CSS with glass-morphism design
- Tử Vi calculation engine implementing traditional Vietnamese astrology algorithms
- Solar-to-Lunar calendar conversion
- Responsive grid-based chart layout

## Tử Vi Engine

The engine implements:
- Heavenly Stems (Thiên Can) and Earthly Branches (Địa Chi) calculation
- Palace (Cung) determination from birth month and hour
- Cục (Destiny Element) calculation
- 14 Major Star placement (Tử Vi group + Thiên Phủ group)
- Auxiliary star placement (Lộc Tồn, Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, etc.)
- Hóa star transformation based on year stem
- Nạp Âm (Sound Element) lookup for 60-year cycle
