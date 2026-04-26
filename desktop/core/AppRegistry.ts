import { WindowType } from "@/types";
import React, { lazy, ReactNode } from "react";

export interface AppMetadata {
  id: WindowType;
  title: string;
  defaultWidth: number;
  defaultHeight: number;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  icon: ReactNode;
  launchable: boolean;
}

export class AppRegistry {
  private static apps: Map<WindowType, AppMetadata> = new Map();
  private static initialized = false;

  static initialize() {
    if (this.initialized) return;

    const NextImage = require("next/image").default;
    const icon = (src: string, alt: string) =>
      React.createElement(NextImage, {
        src,
        alt,
        width: 32,
        height: 32,
        draggable: false,
        unoptimized: true,
      });

    this.registerApp({
      id: "about",
      title: "About Me",
      defaultWidth: 600,
      defaultHeight: 420,
      component: lazy(() =>
        import("@/desktop/ui/windows/AboutWindow").then((m) => ({
          default: m.AboutWindow,
        }))
      ),
      icon: icon("/assets/users.png", "About Me"),
      launchable: true,
    });

    this.registerApp({
      id: "projects",
      title: "Projects",
      defaultWidth: 740,
      defaultHeight: 540,
      component: lazy(() =>
        import("@/desktop/ui/windows/ProjectsWindow").then((m) => ({
          default: m.ProjectsWindow,
        }))
      ),
      icon: icon("/assets/folder_program.png", "Projects"),
      launchable: true,
    });

    this.registerApp({
      id: "skills",
      title: "Skills",
      defaultWidth: 650,
      defaultHeight: 460,
      component: lazy(() =>
        import("@/desktop/ui/windows/SkillsWindow").then((m) => ({
          default: m.SkillsWindow,
        }))
      ),
      icon: icon("/assets/help.png", "Skills"),
      launchable: true,
    });

    this.registerApp({
      id: "contact",
      title: "Contact",
      defaultWidth: 600,
      defaultHeight: 420,
      component: lazy(() =>
        import("@/desktop/ui/windows/ContactWindow").then((m) => ({
          default: m.ContactWindow,
        }))
      ),
      icon: icon("/assets/outlook_large.png", "Contact"),
      launchable: true,
    });

    this.registerApp({
      id: "resume",
      title: "Resume",
      defaultWidth: 700,
      defaultHeight: 540,
      component: lazy(() =>
        import("@/desktop/ui/windows/ResumeWindow").then((m) => ({
          default: m.ResumeWindow,
        }))
      ),
      icon: icon("/assets/doc.png", "Resume"),
      launchable: true,
    });

    this.registerApp({
      id: "mycomputer",
      title: "My Computer",
      defaultWidth: 620,
      defaultHeight: 460,
      component: lazy(() =>
        import("@/desktop/ui/windows/MyComputerWindow").then((m) => ({
          default: m.MyComputerWindow,
        }))
      ),
      icon: icon("/assets/mycomputer.png", "My Computer"),
      launchable: true,
    });

    this.registerApp({
      id: "github",
      title: "GitHub",
      defaultWidth: 720,
      defaultHeight: 520,
      component: lazy(() =>
        import("@/desktop/ui/windows/GithubWindow").then((m) => ({
          default: m.GithubWindow,
        }))
      ),
      icon: icon("/assets/github.png", "GitHub"),
      launchable: true,
    });

    this.registerApp({
      id: "settings",
      title: "Settings",
      defaultWidth: 560,
      defaultHeight: 420,
      component: lazy(() =>
        import("@/desktop/ui/windows/SettingsWindow").then((m) => ({
          default: m.SettingsWindow,
        }))
      ),
      icon: icon("/assets/defaultprog.png", "Settings"),
      launchable: true,
    });

    this.registerApp({
      id: "help",
      title: "Help & Support",
      defaultWidth: 580,
      defaultHeight: 440,
      component: lazy(() =>
        import("@/desktop/ui/windows/HelpWindow").then((m) => ({
          default: m.HelpWindow,
        }))
      ),
      icon: icon("/assets/help.png", "Help & Support"),
      launchable: true,
    });

    this.registerApp({
      id: "recycle",
      title: "Recycle Bin",
      defaultWidth: 580,
      defaultHeight: 380,
      component: lazy(() =>
        import("@/desktop/ui/windows/RecycleBinWindow").then((m) => ({
          default: m.RecycleBinWindow,
        }))
      ),
      icon: icon("/assets/recycling_bin.png", "Recycle Bin"),
      launchable: false,
    });

    this.registerApp({
      id: "minesweeper",
      title: "Minesweeper",
      defaultWidth: 170,
      defaultHeight: 261,
      component: lazy(() =>
        import("@/desktop/ui/windows/MinesweeperWindow").then((m) => ({
          default: m.MinesweeperWindow,
        }))
      ),
      icon: icon("/assets/minesweeper.png", "Minesweeper"),
      launchable: true,
    });

    this.initialized = true;
  }

  static registerApp(app: AppMetadata) {
    this.apps.set(app.id, app);
  }

  static getApp(type: WindowType): AppMetadata | undefined {
    return this.apps.get(type);
  }

  static getAllLaunchableApps(): AppMetadata[] {
    return Array.from(this.apps.values()).filter((a) => a.launchable);
  }

  static getAllApps(): AppMetadata[] {
    return Array.from(this.apps.values());
  }
}
