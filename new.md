# Fix Resume Viewer & Add System Controls

## Context

I am building a portfolio project using Next.js with a Windows XP–style UI. Inside a draggable window component, I am rendering a resume PDF.

---

## Issues Observed

### 1. Blurred Resume Display

* The PDF content appears blurry and low resolution.
* Likely caused by scaling, CSS transforms, or improper rendering resolution.

### 2. Improper Sizing / Layout

* The resume is not properly fitted inside the window.
* It looks zoomed out or constrained, making text hard to read.
* There is excessive empty space and poor scaling behavior.

---

## Expected Behavior

* The resume should render **crisp and readable (high DPI)**.
* It should **fit the container properly** without distortion.
* Scrolling should be smooth if content overflows.
* It should look similar to a native PDF viewer (clear and properly scaled).

---

## Possible Causes to Investigate

* CSS properties like:

  * `transform: scale()`
  * `zoom`
  * `overflow: hidden`
* Low canvas resolution (if using PDF renderer)
* Improper iframe/embed sizing
* Device pixel ratio not handled
* Fixed width/height instead of responsive sizing

---

## Requirements / Fixes

### 1. Improve PDF Rendering Quality

* If using `react-pdf`:

  * Increase `scale` or `devicePixelRatio`
  * Example:

    ```js
    <Page pageNumber={1} scale={1.5} />
    ```
* Ensure canvas uses higher resolution:

  ```js
  const scale = window.devicePixelRatio || 2;
  ```

---

### 2. Fix Layout & Sizing

* Make container responsive:

  ```css
  .pdf-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  ```
* Avoid fixed small dimensions
* Ensure parent window allows full rendering space

---

### 3. Avoid CSS That Causes Blur

* Remove:

  * `transform: scale(...)`
  * `filter`
* Ensure:

  ```css
  canvas {
    image-rendering: auto;
  }
  ```

---

### 4. Improve UX

* Add zoom controls (optional)
* Ensure proper padding/margins
* Center the document

---

## 🖥️ System Behavior Fix (Windows XP UI)

### 5. Turn Off Button Functionality

* The **"Turn Off Computer"** button should:

  1. Trigger a shutdown state
  2. Hide/close all windows
  3. Display a shutdown screen (optional XP-style)

* After shutdown:

  * The system should **restart automatically after 2 seconds**
  * Show a **loading/boot screen** before returning to desktop

---

### Implementation Idea

#### State Management

```js
const [systemState, setSystemState] = useState("running");
// "running" | "shuttingDown" | "booting"
```

#### Shutdown Trigger

```js
const handleShutdown = () => {
  setSystemState("shuttingDown");

  setTimeout(() => {
    setSystemState("booting");

    setTimeout(() => {
      setSystemState("running");
    }, 2000);
  }, 2000);
};
```

#### Conditional Rendering

```js
if (systemState === "shuttingDown") {
  return <ShutdownScreen />;
}

if (systemState === "booting") {
  return <BootScreen />;
}
```

---

## Bonus Improvements

* Add XP-style boot animation
* Add shutdown sound effect
* Persist open apps (optional)
* Add restart option separately

---

## Goal

Make the application:

* Visually sharp and professional (fix blur)
* Properly responsive and readable
* More interactive with realistic OS behavior (shutdown + boot flow)

---

Please analyze the current implementation and refactor both the **PDF rendering system** and **OS-level controls** to meet these requirements.
