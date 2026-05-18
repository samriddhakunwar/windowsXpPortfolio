"use client";
import Image from "next/image";
import "./LoadingScreen.css"
export default function LoadingScreen() {
  return (
    <div className="windows__bg">
      <div className="windows__bg--inner">

        <div className="windows__logo">
          <div className="windows__logo--inner red" />
          <div className="windows__logo--inner green" />
          <div className="windows__logo--inner blue" />
          <div className="windows__logo--inner yellow" />
          {/* <Image src="/img/logo-small.png" alt="logo" width={200} height={200} /> */}
        </div>

        <div className="windows__name">
          <p>Samhard<span>©</span></p>
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
        <span className="windows__footer--right">samsoft<span className="windows__footer--reg">®</span></span>
      </div>
    </div>
  );
}
