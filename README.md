# Éclat de Rose — Luxury Parfumerie & Rose Ouds

A high-performance luxury fragrance e-commerce web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**. Features interactive liquid aura animations, olfactory scent pyramid filtering, interactive scent quiz, decant size picker, mobile-first responsive design, Bangladesh mobile banking checkout (bKash, Nagad, Rocket, Cash on Delivery), and an executive admin suite.

---

## 🚀 How to Run in VS Code

### Step 1: Open the Project in VS Code
1. Open **Visual Studio Code**.
2. Click **File > Open Folder...** (or press `Ctrl+K Ctrl+O` on Windows / `Cmd+O` on macOS).
3. Select this project root folder (the folder containing `package.json`).

### Step 2: Open the Integrated Terminal
- Press `` Ctrl+` `` (backtick) on Windows/Linux or `` Cmd+` `` on macOS.
- Alternatively, go to the top menu: **Terminal > New Terminal**.

### Step 3: Install Dependencies
Run the following command in the terminal:
```bash
npm install
```
*(You can also use `pnpm install`, `yarn`, or `bun install` if preferred).*

### Step 4: Start the Development Server
Run:
```bash
npm run dev
```

You will see:
```text
  VITE v8.3.0  ready in 180 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 5: Open in Your Browser
- Hold `Ctrl` (or `Cmd`) and click `http://localhost:3000/` in the terminal, or open your browser and navigate to:
  **`http://localhost:3000`**

---

## ⚡ VS Code Shortcuts & Workspace Integration

This project includes preconfigured `.vscode/` configurations:

- **Run Dev Server with 1-Click**: Press `Ctrl+Shift+B` (Windows) or `Cmd+Shift+B` (macOS) to launch the `npm: dev` task automatically.
- **Run Tasks**: Go to **Terminal > Run Task...** to select `npm: dev`, `npm: build`, `npm: preview`, or `npm: typecheck`.
- **Debug in Browser**: Press `F5` to start debugging directly with Chrome or Edge connected to your local server.

---

## 📦 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with hot reload at `http://localhost:3000` |
| `npm run build` | Compiles TypeScript and builds optimized production bundles in `dist/` |
| `npm run preview` | Previews the production build locally at `http://localhost:3000` |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) to verify zero errors |

---

## 📁 Architecture & File Structure

The project follows a clean, decoupled, enterprise-grade architecture:

```text
├── .vscode/                   # VS Code tasks, debugging, and workspace settings
│   ├── extensions.json        # Recommended VS Code extensions
│   ├── launch.json            # Browser debug configuration (F5)
│   ├── settings.json          # Editor formatting & Tailwind CSS integration
│   └── tasks.json             # Build & dev tasks (Ctrl+Shift+B)
├── public/                    # Static assets (favicons, manifests, icons)
├── src/
│   ├── components/            # Modular React components
│   │   ├── admin/             # Executive admin portal & management tabs
│   │   ├── cart/              # Slide-over cart & bKash/Nagad checkout flow
│   │   ├── catalog/           # Hero, filter bar, product grid, quick view
│   │   ├── layout/            # Navbar, mobile bottom bar, footer, canvas aurora
│   │   ├── quiz/              # Interactive AI-inspired scent profiling quiz
│   │   └── tracking/          # Live courier & order tracking view
│   ├── constants/             # Default store config, products, BD districts
│   ├── context/               # React Contexts (StoreContext, AdminContext)
│   ├── hooks/                 # Reusable custom hooks (useOnlineStatus, usePWAInstall)
│   ├── services/              # External services (Firebase sync, Firestore listeners)
│   ├── types/                 # Strict TypeScript domain interfaces
│   ├── App.tsx                # Clean root layout & view coordinator
│   ├── index.css              # Tailwind CSS styles & liquid morph animations
│   └── main.tsx               # React 19 application entry point
├── index.html                 # HTML entry point with SEO & OpenGraph tags
├── package.json               # NPM scripts & dependencies
├── tsconfig.json              # TypeScript compiler settings
└── vite.config.ts             # Vite bundler & Tailwind configuration
```

---

## 💡 Recommended VS Code Extensions

When you open the folder, VS Code will suggest recommended extensions from `.vscode/extensions.json`:
1. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — Autocomplete & hover preview for Tailwind classes.
2. **Prettier - Code formatter** (`esbenp.prettier-vscode`) — Consistent code formatting on save.
3. **ESLint** (`dbaeumer.vscode-eslint`) — Real-time lint warnings and errors.

---

## 📱 Testing Mobile View in VS Code / Chrome

1. Open `http://localhost:3000` in Google Chrome or Microsoft Edge.
2. Press `F12` (or right-click and click **Inspect**).
3. Press `Ctrl+Shift+M` (`Cmd+Shift+M` on Mac) to toggle the **Device Toolbar**.
4. Select devices such as **iPhone 14 Pro**, **Samsung Galaxy S20**, or **Pixel 7** to experience the mobile-optimized navigation, bottom action bar, and touch gestures.
