# Flowly

A responsive task manager app built with **React + TypeScript**, **Tailwind CSS** and
**Capacitor**. The same codebase runs on **Web**, **Android** and **iOS**.

The UI follows the provided design: a greeting header, two category cards with
gradient progress bars, a today's tasks list with colored check circles, and a
bottom navigation bar with a central floating "+" button.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (dev server & bundler)
- [Tailwind CSS 3](https://tailwindcss.com/) (styling)
- [lucide-react](https://lucide.dev/) (icons)
- [Capacitor 8](https://capacitorjs.com/) (native Android/iOS shells)

## Requirements

- Node.js **>= 22** (Capacitor CLI requirement). An `.nvmrc` is provided — run
  `nvm use` if you use [nvm](https://github.com/nvm-sh/nvm).
- For Android builds: Android Studio + JDK 17.
- For iOS builds: macOS with Xcode + CocoaPods.

## Getting started (Web)

```bash

# node
nvm list
nvm use v24.15.0

#app
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build locally
```

The layout is fully responsive:

- **Mobile / native:** the design from the reference image — top header, category
  cards, task list and a bottom tab bar with a floating "+" button.
- **Web / desktop (≥ 1024px):** a real full-screen web app with a left sidebar for
  navigation, a wider header and a two-column dashboard (tasks + categories rail).

## Running on devices (Capacitor)

The native `android/` and `ios/` projects are already generated. After any web
change, sync the build into the native shells:

```bash
npm run sync          # build + copy web assets to android & ios
```

### Android

```bash
npm run android       # build, sync, and open the project in Android Studio
```

Then press **Run** in Android Studio (emulator or a connected device).

### iOS (macOS only)

```bash
npm run ios           # build, sync, and open the project in Xcode
```

Then select a simulator/device and press **Run** in Xcode. If pods are missing,
run `cd ios/App && pod install` first.

## Project structure

```
src/
  components/      # Header, CategoryCard, TaskItem, BottomNav, Sidebar, AddTaskSheet, navItems
  pages/           # Home, Calendar, Analytics, Profile
  data.ts          # initial categories & tasks
  types.ts         # shared TypeScript types
  native.ts        # native-only setup (status bar, keyboard), no-op on web
  App.tsx          # state, tab navigation, responsive frame
android/           # Capacitor Android project
ios/               # Capacitor iOS project
capacitor.config.ts
```

## Features

- Toggle tasks complete/incomplete (tap a task).
- Add new tasks via the floating "+" button (with a color picker).
- Bottom-tab navigation: Home, Calendar, Analytics, Profile.
- Safe-area aware layout for notches and home indicators.
- Responsive: full screen on mobile, framed on desktop.
