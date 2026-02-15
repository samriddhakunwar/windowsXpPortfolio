"use client";
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
        </div>

        <div className="windows__name">
          <p>Samhard<span>©</span></p>
          <div className="windows__name--inner">
            Samriddha<span>xp</span>
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
    </div>
  );
}
