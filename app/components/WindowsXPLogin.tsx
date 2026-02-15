"use client";
import Image from "next/image";

import "./WindowsXPLogin.css";

export default function WindowsXPLogin() {
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
              width={200}
              height={200}
              priority
            />
            <span id="text-under-logo">
              To begin, click your user name
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

                <span className="user-name">Samriddha</span>

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
        <div id="shutdown-group">
          <Image
            src="/img/shutdown.png"
            id="shutdown-options"
            className="img-button"
            alt="Shutdown"
            width={24}
            height={24}
          />
          <span>Turn off computer</span>
        </div>

        <div id="account-message">
          After you log on, you can add or change accounts.
          <br />
          Just go to Control Panel and click User Accounts.
        </div>
      </div>

      {/* Shutdown Prompt Overlay */}
      <div id="shutdown-prompt-overlay">
        <div id="shutdown-prompt">
          <div id="shutdown-prompt-header">
            <span>Turn off computer</span>
            <Image
              src="/img/logo-small.png"
              id="logo-small"
              alt="XP Logo Small"
              width={16}
              height={16}
            />
          </div>

          <div id="shutdown-prompt-header-stripe"></div>

          <div id="shutdown-prompt-options">
            <div className="shutdown-prompt-option">
              <Image
                src="/img/suspend.png"
                className="img-button"
                alt="Stand By"
                width={24}
                height={24}
              />
              <span>Stand By</span>
            </div>

            <div className="shutdown-prompt-option">
              <Image
                src="/img/shutdown.png"
                className="img-button"
                alt="Turn Off"
                width={24}
                height={24}
              />
              <span>Turn Off</span>
            </div>

            <div className="shutdown-prompt-option">
              <Image
                src="/img/restart.png"
                className="img-button"
                alt="Restart"
                width={24}
                height={24}
              />
              <span>Restart</span>
            </div>
          </div>

          <div id="shutdown-prompt-footer">
            <div id="shutdown-cancel-button-outline">
              <div id="shutdown-cancel-button-border">
                <div id="shutdown-cancel-button">
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
