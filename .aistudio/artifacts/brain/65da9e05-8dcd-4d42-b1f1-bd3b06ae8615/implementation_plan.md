# Enterprise Architectural Modularization & Clean Code Refactoring

Deconstruct the monolithic 4,967-line `App.tsx` file into a clean, enterprise-grade modular architecture featuring typed domain models, decoupled business logic, dedicated React Context state stores, domain-specific component trees, and resilient Firebase service integrations without altering existing visual polish or breaking runtime features.

## User Review & Critical Decisions

> [!IMPORTANT]
> The refactoring preserves 100% feature parity, data compatibility with existing Firestore collections, Web Audio sound effects, canvas aurora animations, and responsive mobile layout fixes while transforming the internal codebase into a maintainable, senior-level architectural design.

- **Architecture Strategy**: Decomposed feature-first architecture (`types/`, `constants/`, `services/`, `context/`, `hooks/`, `components/`) ensuring single-responsibility principle (SRP) and separation of concerns (SoC).
- **State Management**: Centralized React Context providers (`StoreContext` for catalog, cart, wishlist, orders, and store config; `AdminContext` for authentication and administrative operations) to prevent prop drilling across 40+ nested states.
- **Zero Downtime / Zero Regressions**: Maintain exact types, prop contracts, and component behavior so end-user experience remains fluid and error-free.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms a monolithic single-file application into a production-grade, maintainable frontend codebase with well-defined module boundaries, typed interfaces, isolated UI components, custom hooks, and centralized state management.
- **Target Audience / Persona**: Engineering teams maintaining and scaling the e-commerce platform, plus end-customers enjoying zero downtime and uninterrupted shopping.
- **Key Value**: Drastically reduces cognitive load, eliminates duplicate code, speeds up development iteration, and establishes clean patterns for testing and feature additions.

---

## 2. User Experience & Visual Design

- **Visual Consistency**: All visual styles, Tailwind CSS token hierarchies, luxury typography (Cormorant Garamond + Plus Jakarta Sans), interactive micro-animations, and mobile safe-area paddings remain pixel-identical.
- **Component Boundaries**:
  - **Storefront & Navigation**: Global Announcement Bar, Header / Sticky Nav with Cart Counter & Search, Silk Aurora Canvas Background, and Mobile Bottom Navigation Bar.
  - **Catalog & Discovery**: Hero Showcase Banner, Value Proposition Pillars, Scent Family Filter Bar, 3-column / 2-column Product Cards Grid with Quick Add, and Interactive Scent Quiz Modal.
  - **Shopping & Conversion**: Cart Slide-over Drawer with order summary & progress bar, Multi-Step Checkout Modal (Delivery Details, Payment Method with bKash/Nagad/Rocket instructions, Order Review), and Live Order Tracking.
  - **Administrative Operations**: Password/PIN-protected Admin Suite partitioned into Overview Metrics, Product Catalog Management, Order Fulfillment Pipeline, Banner Customization, and Store Configuration tabs.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Modular Component Hierarchy vs Single File**
  - *Chosen Approach*: Break down `App.tsx` into modular components grouped by domain (`layout/`, `catalog/`, `cart/`, `quiz/`, `admin/`, `ui/`).
  - *Why*: Enables component reusability, isolation for bug fixing, and eliminates massive file scroll overhead.
  - *Alternatives Considered*: Partial extraction of just the admin dashboard. Rejected because the root catalog and cart logic would still remain tangled in a 3,000-line root.
- **Decision 2: Context API for Shared State**
  - *Chosen Approach*: Two focused contexts: `StoreContext` (shopping flow, catalog, cart, wishlist, orders, checkout) and `AdminContext` (session PIN, admin tab navigation, management actions).
  - *Why*: Eliminates drilling 30+ props down to nested modals and cards without introducing heavy third-party state libraries like Redux.
- **Decision 3: Isolated Service Layer for Firebase & Audio**
  - *Chosen Approach*: Extract all Firestore listeners, Auth token handling, Web Audio oscillators, and canvas particle loops into standalone utility modules (`src/services/firebase.ts`, `src/services/audio.ts`, `src/services/canvas.ts`).
  - *Why*: Encapsulates third-party and browser API side effects away from React render cycles.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          main.tsx                           │
│               (ErrorBoundary + PWA Registry)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    StoreProvider (Context)                  │
│       ┌──────────────────────┴──────────────────────┐       │
│       │             AdminProvider (Context)         │       │
│       └──────────────────────┬──────────────────────┘       │
└──────────────────────────────┼──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                           App.tsx                           │
│            (Root Layout Coordinator & Shell)                │
├─────────────────────────────────────────────────────────────┤
│ ├── CanvasBackground (Silk Aurora / Petals / Crystal)       │
│ ├── AnnouncementBanner                                      │
│ ├── Navbar (Logo, Search, Wishlist, Cart Drawer Trigger)    │
│ ├── HeroBanner (Featured Perfume Showcase & Direct CTA)     │
│ ├── FeaturePillars (Longevity, Authenticity, Delivery)      │
│ ├── CatalogSection (Category / Scent Family Filters & Grid) │
│ │   └── ProductCard (Quick View, Add to Cart, Notes)        │
│ ├── ScentFinderBanner & ScentQuizModal                      │
│ ├── QuickViewModal & FragranceNotesPyramid                  │
│ ├── CartDrawer & MultiStepCheckoutModal                     │
│ ├── OrderSuccessModal & OrderTrackingModal                  │
│ ├── AdminDashboardModal (Products, Orders, Banner, Settings)│
│ ├── MobileBottomBar (Home, Search, Orders, Wishlist, Cart)  │
│ └── Footer (Brand Story, Store Info, Legal & Socials)       │
└─────────────────────────────────────────────────────────────┘
                               │
 ┌─────────────────────────────┴─────────────────────────────┐
 │                      Service Layer                        │
 │  ├── firebase.ts (Auth, Firestore Collections, Listeners) │
 │  ├── audio.ts (Procedural Web Audio Chimes & Clicks)      │
 │  └── canvas.ts (WebGL / Canvas Ambient Background Loop)   │
 └───────────────────────────────────────────────────────────┘
```

### Module Structure Plan

- `src/types/`:
  - `product.ts`: `PerfumeProduct`, `CartItem`, `Category`, `ScentFamily`
  - `order.ts`: `Order`, `OrderStatus`, `PaymentMethod`, `CustomerInfo`
  - `store.ts`: `StoreConfig`, `Review`, `QuizQuestion`
- `src/constants/`:
  - `defaultProducts.ts`: Curated fragrance catalog with fragrance notes & imagery
  - `defaultConfig.ts`: Shipping rates, payment details, merchant numbers, admin PIN
  - `quizData.ts`: Fragrance personality questionnaire steps
- `src/services/`:
  - `firebase.ts`: Database initialization, real-time sync listeners, CRUD methods
  - `audio.ts`: Synthesized Web Audio API sound feedback
- `src/context/`:
  - `StoreContext.tsx`: Products catalog, cart operations, wishlist, active modals, checkout logic
  - `AdminContext.tsx`: Admin login status, PIN verification, current admin tab
- `src/components/`:
  - `layout/`: `Navbar`, `Footer`, `AnnouncementBanner`, `MobileBottomBar`, `CanvasBackground`
  - `catalog/`: `HeroBanner`, `FeaturePillars`, `FilterBar`, `ProductGrid`, `ProductCard`, `QuickViewModal`, `FragrancePyramid`
  - `cart/`: `CartDrawer`, `CheckoutModal`, `OrderSuccessReceipt`
  - `quiz/`: `ScentQuizModal`
  - `tracking/`: `OrderTrackingModal`
  - `admin/`: `AdminDashboardModal`, `AdminProductsTab`, `AdminOrdersTab`, `AdminBannerTab`, `AdminSettingsTab`, `ProductEditModal`

### Interactive Component & State Mapping

- **Cart & Checkout Flow**: `ProductCard` / `QuickViewModal` calls `addToCart()` via `useStore()`. Cart slide-over triggers checkout step state machine (Customer Info -> Payment Provider Selection -> Receipt / Confetti).
- **Catalog Filtering**: Reactive memoized queries filtering by category (`For Her`, `For Him`, `Unisex`, etc.), scent notes (`Floral`, `Woody`, `Oriental`), and full-text keyword search.
- **Admin Dashboard**: `AdminContext` manages PIN authentication state, granting real-time update capability to Firestore products, live order status changes (Pending -> Confirmed -> Shipped -> Delivered), banner customization, and store delivery settings.
