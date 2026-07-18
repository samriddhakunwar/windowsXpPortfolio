"use client";
import Image from "next/image";

import "./WindowsXPLogin.css";

interface WindowsXPLoginProps {
  onLogin: () => void;
  onShutdownRequest?: () => void;
}

export default function WindowsXPLogin({ onLogin, onShutdownRequest }: WindowsXPLoginProps) {
  return (
    <div id="main-content">
      {/* Header */}
      <div id="header"></div>
      <div id="headerStripe"></div>

      {/* Center Content */}
       <div id="center">
        {/* Left Side (LOGO AREA) */}
        <div id="centerLeft">
          <div id="centerLogo">
            <Image
              src="/img/logo.png"
              id="logo"
              alt="Windows XP Logo"
              width={450}
              height={450}
              priority
            />
            <span id="text-under-logo" style={{fontSize: "18px"}}>
              To checkout my portfolio, click my user name
            </span>
          </div>
        </div>

        <div id="centerDivider"></div>

        {/* Right Side */}
        <div id="centerRight">
          <div id="userListings">
            <div className="user-border-wrapper">
              <div className="user">
                <div className="profile-picture-wrapper">
                  <Image
                    src="/img/bike.png"
                    className="profile-picture"
                    alt="User Avatar"
                    width={48}
                    height={48}
                  />
                </div>

                <span className="user-name" onClick={onLogin}>
      Samriddha
    </span>

                <div className="password-box">
                  <span className="password-msg">
                    Type your password
                  </span>

                  <form className="password-form">
                    <input
                      type="password"
                      className="password"
                    />
                    <input
                      type="image"
                      src="/img/continue.png"
                      className="img-button"
                      alt="Login"

                    />
                  </form>
                </div>

                {/* Password Error Popup */}
                <div className="password-error-popup">
                  <div className="popup-arrow-border">
                    <div className="popup-arrow"></div>
                  </div>

                  <div className="password-error-title">
                    <Image
                      src="/img/error.png"
                      className="password-error-icon"
                      alt="Error"
                      width={16}
                      height={16}
                    />
                    Did you forget your password?
                  </div>

                  <div>
                    Please type your password again.
                    <br />
                    Be sure to use the correct uppercase and lowercase letters.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div id="footerStripe"></div>

      <div id="footer">
        <div
          id="shutdown-group"
          onClick={onShutdownRequest}
          style={{ cursor: onShutdownRequest ? "pointer" : "default" }}
        >
          <img
            src="/img/shutdown.png"
            id="shutdown-options"
            className="img-button"
            alt="Shutdown"
            width={24}
            height={24}
            draggable={false}
          />
          <span>Turn off computer</span>
        </div>

        <div id="account-message">
          After you log in, you can view my portfolio.
          <br />
          Explore my creation :V.
        </div>
      </div>


    </div>
  );
}

