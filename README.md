# 🖥️ Samriddha XP — Portfolio Edition

> A pixel-perfect Windows XP desktop experience, built as an interactive developer portfolio.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

Live site: **[samriddhakunwar/windowsXpPortfolio](https://github.com/samriddhakunwar/windowsXpPortfolio)**

---

## ✨ Overview

This portfolio recreates the authentic **Windows XP desktop environment** inside a browser. Visitors experience a fully interactive OS simulation — from the boot sequence and login screen all the way through to the desktop, draggable windows, Start Menu, and shutdown flow.

---

## 🚀 Features

### 🖥️ Boot & Login Flow
- **Boot Screen** — Animated Windows XP-style BIOS/boot loader screen
- **Loading Screen** — "Samriddha XP — Portfolio Edition" branded loading bar
- **Login Screen** — Pixel-perfect Windows XP Welcome Screen with user account selection
- **Shutdown from Login** — Functional "Turn off computer" button on the login screen, triggering the full shutdown modal

### 🗂️ Desktop Environment
- **XP Wallpaper** — Classic "Bliss" inspired background
- **Desktop Icons** — Double-click to open windows; icons snap and are draggable
- **Taskbar** — Pinned apps, open window buttons, system tray, and live clock
- **Start Menu** — Full Windows XP-style Start Menu with user panel, quick-launch items, and all-programs list
- **Right-Click Context Menu** — Desktop context menu with XP-style options

### 🪟 Window System
- **Draggable & Resizable** Windows with authentic XP chrome (title bar, min/max/close buttons)
- **Minimize / Maximize / Close** with Framer Motion animations
- **Z-index management** — clicking a window brings it to focus
- **Taskbar integration** — minimized windows appear in the taskbar

### 📂 Portfolio Windows
| Window | Content |
|---|---|
| **About Me** | Photo, bio, tech stack, interests, and career goals |
| **Projects** | Project cards with title, description, tech stack, GitHub & live demo links |
| **Skills** | Frontend, Backend, Tools — animated progress bars |
| **Resume** | Embedded PDF viewer with a download button |
| **Contact** | Contact form (Name / Email / Message) with email delivery via Resend API |
| **My Computer** | XP-style "My Computer" with drive and folder navigation |
| **GitHub** | Live GitHub stats and repository viewer |
| **Recycle Bin** | Fun Easter egg — an interactive recycle bin |
| **Minesweeper** | Fully playable Minesweeper game |
| **Help Center** | XP Help & Support center styled page |

### ⚙️ Shutdown & Log Off
- **Shutdown Modal** — Authentic XP "Turn Off Computer" dialog (Stand By / Turn Off / Restart)
- **XP Shutdown Screen** — Full-screen animated shutdown/restart/logoff sequence
- **Log Off** — Closes all windows, resets desktop state, and returns to the Login screen
- **Shutdown / Restart** — Animated XP shutdown screen before returning to Boot

---

## 🗃️ Project Structure

```
windowsxp-portfolio-website/
│
├── app/                        # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                # Root entry (renders flow controller)
│   ├── globals.css
│   └── components/             # Boot / Login / Shutdown screens
│       ├── BootScreen.tsx
│       ├── LoadingScreen.tsx
│       ├── WindowsXPLogin.tsx
│       └── XPShutdownScreen.tsx
│
├── desktop/                    # Desktop environment
│   ├── DesktopProvider.tsx     # Global desktop context
│   ├── context/                # React context for window state
│   ├── core/                   # Architecture utilities
│   │   ├── AppRegistry.ts      # Registered apps/windows
│   │   ├── EventBus.ts         # Cross-component pub/sub events
│   │   └── WindowManager.ts    # Window lifecycle management
│   ├── types/                  # Shared TypeScript types
│   ├── styles/                 # Desktop-specific CSS
│   └── ui/
│       ├── DesktopPanel.tsx    # Main desktop canvas
│       ├── components/         # UI building blocks
│       │   ├── TaskBar.tsx
│       │   ├── StartMenu.tsx
│       │   ├── ShutdownModal.tsx
│       │   ├── XPWindow.tsx    # Reusable draggable window shell
│       │   ├── DesktopIcon.tsx
│       │   ├── ContextMenu.tsx
│       │   ├── ErrorDialog.tsx
│       │   └── RecycleBinDynamicIcon.tsx
│       └── windows/            # Portfolio content windows
│           ├── AboutWindow.tsx
│           ├── ProjectsWindow.tsx
│           ├── SkillsWindow.tsx (via Skills tab in About/Projects)
│           ├── ContactWindow.tsx
│           ├── ResumeWindow.tsx
│           ├── MyComputerWindow.tsx
│           ├── GithubWindow.tsx
│           ├── RecycleBinWindow.tsx
│           ├── MinesweeperWindow.tsx
│           └── HelpWindow.tsx
│
├── data/                       # Static portfolio data
│   ├── projects.ts
│   └── skills.ts
│
├── hooks/                      # Custom React hooks
├── types/                      # Global TypeScript types
│
└── public/                     # Static assets
    ├── icons/                  # XP-style PNG icons
    └── wallpaper/              # Desktop wallpaper
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16 | Framework (App Router) |
| **React** | 19 | UI library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Framer Motion** | 11 | Animations & transitions |
| **react-draggable** | 4 | Draggable window behaviour |
| **Lucide React** | latest | Icon set |
| **Resend** | 6 | Contact form email delivery |
| **uuid** | 9 | Unique window/instance IDs |

---

## ⚡ Getting Started

### Prerequisites

- Node.js **18+**
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/samriddhakunwar/windowsXpPortfolio.git
cd windowsXpPortfolio

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` and fill in your values:

```env
# Resend API key (for the Contact window email form)
RESEND_API_KEY=your_resend_api_key_here
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site boots through the full XP sequence automatically.

### Building for Production

```bash
npm run build
npm start
```

---

## 🎮 User Flow

```
Boot Screen → Loading Screen → Login Screen → Desktop
                                                  │
                          ┌───────────────────────┤
                          │                       │
                     Start Menu              Desktop Icons
                          │                       │
              ┌───────────┴──────┐           Open Windows
              │                  │          (About, Projects,
           Log Off           Shutdown           Skills…)
              │             Modal / Screen
              │
         Returns to Login
```

---

## 📧 Contact Form

The **Contact** window uses the [Resend](https://resend.com) API to send emails server-side via a Next.js API route (`app/api/`). Set your `RESEND_API_KEY` in `.env.local` to enable it.

---

## 📸 Credits & Inspiration

- Windows XP UI design language © Microsoft Corporation
- UI inspiration: [mitchivin.com](https://mitchivin.com/)
- Additional reference: [github.com/firwer/winxpsite](https://github.com/firwer/winxpsite)
- Icons and visual references based on the Windows XP design system

---

## 🙏 Acknowledgements

- The open-source community for making tools like Next.js, Framer Motion, and react-draggable freely available
- Developers who share creative, unconventional portfolio ideas

---

*Built with ❤️ by [Samriddha Kunwar](https://github.com/samriddhakunwar)*
