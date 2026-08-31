# 🖥️ Samriddha XP — Portfolio Edition

> A pixel-perfect **Windows XP desktop** recreated in the browser as an interactive developer portfolio.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff3c70?logo=framer&logoColor=white)](https://www.framer.com/motion/)

🔗 **Repository:** [github.com/samriddhakunwar/windowsXpPortfolio](https://github.com/samriddhakunwar/windowsXpPortfolio)

---

## ✨ Overview

**Samriddha XP** is not your typical portfolio website. It faithfully simulates the **Windows XP operating system** inside a browser tab — complete with a boot sequence, login screen, draggable/resizable windows, a Start Menu, system tray, shutdown dialogs, and authentic sound effects. Every portfolio section (About, Projects, Skills, Resume, Contact) is presented as an XP-style application window, making the browsing experience feel like using a real desktop from 2001.

---

## 🚀 Features

### 🖥️ Boot & Login Flow
| Step | Description |
|---|---|
| **Boot Screen** | Animated XP-style BIOS / boot loader splash |
| **Loading Screen** | Branded progress bar — *"Samriddha XP — Portfolio Edition"* |
| **Login Screen** | Pixel-perfect Windows XP Welcome Screen with user account selection |
| **Shutdown from Login** | *"Turn off computer"* button on the login screen triggers the full shutdown modal before boot restarts |

### 🗂️ Desktop Environment
- **Classic Wallpaper** — The iconic "Bliss" green hills
- **Desktop Icons** — Double-click to open windows; supports single-click focus
- **Taskbar** — Open window buttons, system tray, and a live clock
- **Start Menu** — Full XP-style menu with user panel, pinned apps, and quick actions
- **Right-Click Context Menu** — Desktop context menu with period-accurate XP styling

### 🪟 Window System
- **Draggable & Resizable** windows with authentic XP chrome (title bar gradient, Luna theme buttons)
- **Minimize / Maximize / Close** with smooth Framer Motion animations
- **Z-index focus management** — clicking a window brings it to the front
- **Taskbar integration** — minimised windows appear in the taskbar and can be restored

### 📂 Portfolio Windows

| Window | Content |
|---|---|
| **About Me** | Photo, bio, tech stack, interests, and career goals |
| **Projects** | Project cards with title, description, tech tags, GitHub & live demo links |
| **Skills** | Frontend, Backend, and Tools — visualised with animated progress bars |
| **Resume** | Embedded PDF viewer with a one-click download button |
| **Contact** | Contact form (Name / Email / Message) with server-side email delivery via Resend |
| **My Computer** | XP-style drive and system-folder navigation |
| **GitHub** | Live GitHub stats and repository browser |
| **Recycle Bin** | Interactive Easter-egg recycle bin |
| **Minesweeper** | Fully playable classic Minesweeper game |
| **Help Center** | Styled XP Help & Support centre page |


### ⚙️ Shutdown & Log Off
- **Shutdown Modal** — Authentic *"Turn Off Computer"* dialog with Stand By / Turn Off / Restart options
- **XP Shutdown Screen** — Full-screen animated shutdown, restart, or log-off sequence
- **Log Off** — Closes all windows, resets desktop state, and returns to the Login screen
- **Shutdown / Restart** — Plays the animated shutdown screen before cycling back to Boot

---

## 🗃️ Project Structure

```
windowsxp-portfolio-website/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                  # Root entry — orchestrates the boot/login/desktop flow
│   ├── globals.css
│   ├── api/                      # Server-side API routes (e.g. contact email)
│   └── components/               # Splash / transition screens
│       ├── BootScreen.tsx
│       ├── LoadingScreen.tsx
│       ├── WindowsXPLogin.tsx
│       └── XPShutdownScreen.tsx
│
├── desktop/                      # Full desktop environment
│   ├── DesktopProvider.tsx       # Global desktop React context
│   ├── context/                  # Window state contexts
│   ├── core/
│   │   ├── AppRegistry.ts        # All registered apps / window definitions
│   │   ├── EventBus.ts           # Cross-component pub/sub event system
│   │   └── WindowManager.ts      # Window lifecycle (open, close, focus, minimise)
│   ├── types/                    # Shared TypeScript interfaces & enums
│   ├── styles/                   # Desktop-specific CSS modules
│   └── ui/
│       ├── DesktopPanel.tsx      # Main desktop canvas
│       ├── components/           # Reusable UI building blocks
│       │   ├── TaskBar.tsx
│       │   ├── StartMenu.tsx
│       │   ├── ShutdownModal.tsx
│       │   ├── XPWindow.tsx      # Generic draggable/resizable window shell
│       │   ├── DesktopIcon.tsx
│       │   ├── ContextMenu.tsx
│       │   ├── ErrorDialog.tsx
│       │   └── RecycleBinDynamicIcon.tsx
│       └── windows/              # Portfolio content windows
│           ├── AboutWindow.tsx
│           ├── ProjectsWindow.tsx
│           ├── SkillsWindow.tsx
│           ├── ContactWindow.tsx
│           ├── ResumeWindow.tsx
│           ├── MyComputerWindow.tsx
│           ├── GithubWindow.tsx
│           ├── RecycleBinWindow.tsx
│           ├── MinesweeperWindow.tsx
│           └── HelpWindow.tsx
│
├── data/                         # Static portfolio content
│   ├── projects.ts
│   └── skills.ts
│
├── hooks/                        # Custom React hooks (e.g. useWindowManager)
├── types/                        # Global TypeScript type definitions
│
└── public/                       # Static assets
    ├── icons/                    # XP-style PNG icons
    ├── audio/                    # Authentic XP sound effects
    ├── wallpaper/                # Desktop wallpaper images
    └── resume.pdf                # Downloadable résumé
```

---

## 🛠️ Tech Stack

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 16.1.6 | Framework — App Router, API routes, SSR |
| **React** | 19 | UI library |
| **TypeScript** | 5 | Type safety across the entire codebase |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Framer Motion** | 11 | Animations, transitions, and spring physics |
| **react-draggable** | 4 | Draggable window behaviour |
| **Lucide React** | latest | Icon set |
| **Resend** | 6 | Contact form — server-side email delivery |
| **uuid** | 9 | Unique IDs for window instances |

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** (or yarn / pnpm)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/samriddhakunwar/windowsXpPortfolio.git
cd windowsxp-portfolio-website

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Open `.env.local` and set your values:

```env
# Required — Resend API key for the Contact window email form
RESEND_API_KEY=your_resend_api_key_here
```

> Get a free API key at [resend.com](https://resend.com). Without it the contact form will return an error, but the rest of the portfolio works fine.

### Run in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site automatically boots through the full XP sequence.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎮 Application Flow

```
┌─────────────┐    ┌────────────────┐    ┌──────────────┐    ┌─────────────────────┐
│  Boot Screen │───▶│ Loading Screen │───▶│ Login Screen │───▶│      Desktop        │
└─────────────┘    └────────────────┘    └──────┬───────┘    └────────┬────────────┘
                                                │                      │
                                         Turn Off Computer      Start Menu / Icons
                                                │                      │
                                         Shutdown Modal         Open Windows
                                                                 (About, Projects,
                                                                  Skills, Resume…)
                                                                       │
                                                               ┌───────┴────────┐
                                                               │                │
                                                            Log Off         Shutdown
                                                               │            Modal / Screen
                                                               │
                                                        Returns to Login
```

---

## 📧 Contact Form

The **Contact** window submits the form to a Next.js API route (`app/api/contact/`) which uses the [Resend](https://resend.com) SDK to deliver emails server-side. No third-party form services — everything stays within the application.

Set `RESEND_API_KEY` in `.env.local` to enable email delivery.

---

## 🎵 Sound Effects

Authentic Windows XP audio is used throughout the experience:

| Trigger | Sound |
|---|---|
| Desktop loads | Windows XP startup chime |
| Log off initiated | Windows XP logoff sound |
| Shutdown / Restart | Windows XP shutdown sound |

---

## 📸 Credits & Inspiration

- Windows XP UI design language © Microsoft Corporation
- UI concept inspired by [mitchivin.com](https://mitchivin.com/)
- Additional reference: [github.com/firwer/winxpsite](https://github.com/firwer/winxpsite)
- Icons adapted from the Windows XP design system

---

## 🙏 Acknowledgements

- The open-source community behind Next.js, Framer Motion, react-draggable, and all the other libraries that made this possible
- Developers who push the boundaries of what a portfolio website can be

---

*Built with ❤️ by [Samriddha Kunwar](https://github.com/samriddhakunwar)*
