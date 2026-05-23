"use client";
import Image from "next/image";
import "./LoadingScreen.css";
import winxpLogo from "../assets/windowsxplogo.png";// put the image file next to this component

export default function LoadingScreen() {
  return (
    <div className="windows__bg">
      <div className="windows__bg--inner">

        <div className="windows__logo">
          <Image src={winxpLogo} alt="Windows XP Logo" className="winxp-logo-img" />
        </div>

        <div className="windows__name">
          <p>Samhard<span>®</span></p>
          <div className="windows__name--inner">
            Samriddha<span>xp</span>
          </div>
          <div className="windows__name--edition">
            Portfolio Edition
          </div>
        </div>

        <div className="windows__bg--loading">
          <ul>
            <li />
            <li />
            <li />
          </ul>
        </div>

      </div>

      <div className="windows__footer">
        <span className="windows__footer--left">made as a fun and nostalgic way to showcase my portfolio</span>
        <span className="windows__footer--right">samhard<span className="windows__footer--reg">®</span></span>
      </div>
    </div>
  );
}
