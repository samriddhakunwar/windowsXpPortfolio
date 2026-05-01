# Windows XP Portfolio Website – AI Project Specification

## Repository

https://github.com/samriddhakunwar/windowsXpPortfolio

## Objective

Build a **fully functional portfolio website themed around the Windows XP desktop experience**.
The site should mimic the nostalgic UI of Windows XP while showcasing my **developer portfolio, projects, and skills**.

The website should feel like interacting with a **Windows XP desktop environment inside the browser**.

---

# Tech Stack

Use the following technologies:

- **Next.js 16+ (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **ShadCN UI (optional where useful)**
- **Lucide Icons**
- **Framer Motion for animations**

---

# Core Concept

The website should replicate a **Windows XP operating system UI** in the browser.

When users open the site they should see:

A **Windows XP desktop** with:

- Wallpaper
- Desktop icons
- Start menu
- Taskbar
- Draggable windows
- XP-style UI elements

Each icon opens a **window that displays portfolio content**.

---

# UI Layout

## Desktop

The main screen should look like a Windows XP desktop.

Features:

- XP wallpaper
- Desktop icons
- Taskbar at bottom
- Start button
- System tray
- Clock

---

## Desktop Icons

Icons should open draggable windows.

Icons required:

- My Computer
- About Me
- Projects
- Skills
- Contact
- Resume
- GitHub

Each icon opens a window similar to XP explorer windows.

---

# Windows Behavior

Each window should:

- Be draggable
- Have minimize button
- Have maximize button
- Have close button
- Appear in taskbar when open
- Animate when opening

Use **Framer Motion** for animations.

---

# Pages / Window Content

## About Me

Display:

- Photo
- Short bio
- Tech stack
- Current interests
- Career goals

---

## Projects

Projects should appear like **folders or files**.

Example:

Project Window Layout:

Project Card

- Title
- Description
- Tech stack
- GitHub link
- Live demo

Example projects:

- Smart Traffic Management System (Django)
- Search Engine Project (Django + React)
- Portfolio Website
- Data Analysis Project

---

## Skills

Display skills grouped into categories.

Example:

Frontend

- React
- Next.js
- TypeScript
- Tailwind

Backend

- Django
- Django REST Framework
- Node.js

Tools

- Git
- Docker
- Linux

Use animated progress bars.

---

## Resume

Show resume preview with:

- Download button
- PDF viewer

---

## Contact

Include:

Contact form:

- Name
- Email
- Message

Form should show success message on submit.

No backend required yet.

---

# Start Menu

Clicking **Start** should open a Windows XP style start menu.

Menu Items:

- About
- Projects
- Skills
- Resume
- Contact
- GitHub
- Shutdown

Shutdown can display:

"Thanks for visiting my portfolio!"

---

# Animations

Use **Framer Motion** for:

- Window open animation
- Window minimize
- Taskbar transitions
- Icon hover effects

---

# Folder Structure

The project should follow this structure:

```
app/
  layout.tsx
  page.tsx

components/
  Desktop.tsx
  Taskbar.tsx
  StartMenu.tsx
  Window.tsx
  DesktopIcon.tsx
  DraggableWindow.tsx

windows/
  AboutWindow.tsx
  ProjectsWindow.tsx
  SkillsWindow.tsx
  ContactWindow.tsx
  ResumeWindow.tsx

data/
  projects.ts
  skills.ts

styles/
  globals.css

public/
  icons/
  wallpaper/
```

---

# Desktop State Management

Use React state to manage:

- Open windows
- Active window
- Window position
- Taskbar items

---

# Styling Requirements

UI must match Windows XP design:

- Blue gradients
- Rounded XP window borders
- XP style buttons
- Pixel-like icons
- Classic fonts

Optional:

Use **Press Start 2P** or similar retro fonts.

---

# Additional Features

Add the following if possible:

- Draggable icons
- Sound effects for opening windows
- Fake loading screen
- Boot animation
- Right-click desktop menu

---

# Performance Requirements

- Fast loading
- Responsive
- Works on desktop and mobile
- Lighthouse score > 90

---

# Deliverables

Claude should generate:

- All React components
- All pages
- TypeScript types
- Sample project data
- Tailwind styles
- Functional UI

The site should run using:

```
npm install
npm run dev
```

---

# Expected Result

A **fully interactive Windows XP themed portfolio website** where users can:

- Click desktop icons
- Open windows
- Browse projects
- View skills
- Contact me

The experience should feel like **using Windows XP in the browser**.

---

# Repository

https://github.com/samriddhakunwar/windowsXpPortfolio

## Credits

* Inspired by the classic Microsoft Windows XP UI by Microsoft
* UI/UX inspiration from https://mitchivin.com/
* Additional inspiration from https://github.com/firwer/winxpsite
* Icons and visual references based on Windows XP design language
* Built using Next.js, React, Tailwind CSS, and Framer Motion

## Acknowledgements

Special thanks to:

* The open source community
* Developers who share creative portfolio ideas


