import "./welcome.css";

// Converted from original HTML template
// Windows XP Nody Greeter Theme by Markus Hernandez

export default function WelcomePage() {
  return (
    <div id="main-content">
      {/* Header */}
      <div id="header"></div>
      <div id="headerStripe"></div>

      {/* Center Content */}
      <div id="center">
        <h1 className="welcome-text"><b>welcome</b></h1>
      </div>

      {/* Footer */}
      <div id="footerStripe"></div>
      <div id="footer"></div>
    </div>
  );
}
