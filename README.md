# NutriCalc — Clinical Nutrition Formula Calculator

A Progressive Web App (PWA) for calculating clinical nutrition formulas. Built for medical and nutrition professionals to quickly compute patient-specific dietary and metabolic values.

---

## 🌿 Features

- **8 Clinical Formulas** — BMI, Curreri, IBW, AjBW, Injury Factor, PAL, Harris-Benedict, Mifflin St. Jeor
- **Unit Flexibility** — Height in cm or ft, Weight in kg or lbs
- **Conversion Reference Charts** — kg ↔ lbs and cm ↔ ft/in on the landing page
- **Installable as a Mobile App** — PWA with install prompt on the landing page
- **Offline Support** — Works without internet after first load (via Service Worker)
- **Clean Medical Theme** — Professional green-toned UI with DM Serif Display & DM Sans fonts

---

## 📁 Project Structure

```
nutrical/
├── index.html          # Main app — all 3 pages (Landing, Dashboard, Formula)
├── manifest.json       # PWA manifest (name, icons, theme color)
├── sw.js               # Service Worker for offline caching
├── css/
│   └── style.css       # All styles — theme, layout, components
├── js/
│   └── app.js          # All logic — navigation, calculations, PWA install
└── icons/
    ├── icon-192.png    # PWA icon (192×192)
    └── icon-512.png    # PWA icon (512×512)
```

---

## 🖥️ App Flow

```
Landing Page
├── Input: Age, Height (cm/ft), Weight (kg/lbs)
├── Conversion Charts: kg↔lbs, cm↔ft
└── [Calculate Formulas] →

Formula Dashboard
├── 8 formula cards displayed
└── Click any card →

Formula Result Page
├── Additional inputs (if needed: gender, %TBSA, activity level, etc.)
├── [Calculate] button
└── Result card with value + clinical interpretation
```

---

## 🧮 Formulas Implemented

### 1. BMI — Body Mass Index
**Formula:** `Weight (kg) ÷ Height² (m)`  
**Output:** kg/m² with WHO weight category classification  
**Extra inputs:** None

---

### 2. Curreri Formula
**Formula:** `25 × Weight (kg) + 40 × %TBSA`  
**Output:** kcal/day  
**Extra inputs:** Total Body Surface Area burned (%)  
**Use case:** Estimating caloric needs in burn patients

---

### 3. Ideal Body Weight (IBW) — Devine Formula
**Male:** `50 + 2.3 × (Height in inches − 60)`  
**Female:** `45.5 + 2.3 × (Height in inches − 60)`  
**Output:** kg  
**Extra inputs:** Gender

---

### 4. Adjusted Body Weight (AjBW)
**Formula:** `IBW + 0.25 × (Actual Weight − IBW)`  
**Output:** kg  
**Extra inputs:** Gender (to calculate IBW internally)  
**Note:** Only applied when Actual Weight > IBW

---

### 5. Injury Factor (Stress Factor)
**Formula:** `BMR × Injury Factor`  
**Output:** Multiplier + adjusted kcal/day  
**Extra inputs:** Injury/stress category selection

| Category | Factor |
|---|---|
| Minor Surgery / Uncomplicated | 1.0 |
| Skeletal Trauma | 1.2 |
| Major Surgery | 1.25 |
| Sepsis / Peritonitis | 1.4 |
| Burns < 20% TBSA | 1.5 |
| Burns 20–40% TBSA | 1.75 |
| Burns > 40% TBSA | 2.0 |
| Severe Head Injury | 1.6 |

---

### 6. Physical Activity Level (PAL)
**Formula:** `BMR × PAL = TDEE`  
**Output:** PAL multiplier + TDEE in kcal/day  
**Extra inputs:** Gender + activity level selection

| Activity Level | PAL |
|---|---|
| Sedentary | 1.200 |
| Lightly Active | 1.375 |
| Moderately Active | 1.550 |
| Very Active | 1.725 |
| Extra Active | 1.900 |

---

### 7. Harris-Benedict Formula (Revised 1984)
**Male:** `88.362 + (13.397 × W) + (4.799 × H) − (5.677 × A)`  
**Female:** `447.593 + (9.247 × W) + (3.098 × H) − (4.330 × A)`  
*(W = kg, H = cm, A = years)*  
**Output:** kcal/day (BMR)  
**Extra inputs:** Gender

---

### 8. Mifflin St. Jeor Formula (1990)
**Male:** `(10 × W) + (6.25 × H) − (5 × A) + 5`  
**Female:** `(10 × W) + (6.25 × H) − (5 × A) − 161`  
*(W = kg, H = cm, A = years)*  
**Output:** kcal/day (BMR)  
**Extra inputs:** Gender

---

## 🚀 Deployment

### Option 1 — Netlify (Recommended, Free)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop the `nutrical/` folder onto the Netlify dashboard
3. Your site is live instantly with a public URL

### Option 2 — GitHub Pages (Free)
1. Create a new GitHub repository
2. Upload all files from the `nutrical/` folder
3. Go to **Settings → Pages → Source → main branch**
4. Your site will be at `https://yourusername.github.io/repo-name`

### Option 3 — Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Inside the `nutrical/` folder, run `vercel`
3. Follow the prompts

> **Important:** The app must be served over **HTTPS** for PWA install and Service Worker to work. All the platforms above provide HTTPS automatically.

---

## 📲 Installing as a Mobile App

### Android (Chrome)
1. Open the deployed URL in Chrome
2. The **"Install App"** banner appears automatically at the top
3. Tap **Install App** — the app is added to your home screen

### iOS (Safari)
1. Open the deployed URL in Safari
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add** — the app appears on your home screen

---

## ⚙️ Technical Details

| Feature | Detail |
|---|---|
| Type | Progressive Web App (PWA) |
| Framework | Vanilla HTML / CSS / JavaScript (no dependencies) |
| Fonts | DM Serif Display + DM Sans (Google Fonts) |
| Offline | Service Worker with Cache-First strategy |
| Icons | PNG 192×192, 512×512 |
| Theme Color | `#1a6b4a` (Deep Medical Green) |
| Responsive | Mobile-first, works on all screen sizes |

---

## 🛠️ Customisation Notes

- **Colors** — All theme colors are CSS variables in `css/style.css` under `:root {}`. Change `--green-deep`, `--green-mid`, etc. to restyle the whole app.
- **Adding Formulas** — Add a new entry to the `formulas` object in `js/app.js` and a new card in the `#formulaGrid` section of `index.html`.
- **App Name** — Update `"name"` and `"short_name"` in `manifest.json` and the `<title>` in `index.html`.

---

## 📄 License

Built as a freelance project for academic and clinical reference use.  
All formula implementations are based on published clinical literature.

---

*NutriCalc — Precision nutrition, at your fingertips.*
