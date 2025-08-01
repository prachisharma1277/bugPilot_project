import React from "react";
import AppLayout from "../components/AppLayout";

export default function ContactPage() {
  return (
    <AppLayout>
      <div className="main-content">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Whether it’s feedback, suggestions, or support — just reach out.</p>

        <h3>📬 Email</h3>
        <p>support@bugtrackr.io</p>

        <h3>📍 Address</h3>
        <p>123 Developer Street, Code City, India - 110001</p>

        <h3>💬 Follow us on</h3>
        <ul>
          <li>Twitter: <a href="https://twitter.com/bugtrackr" target="_blank"> @bugtrackr</a></li>
          <li>LinkedIn: <a href="https://linkedin.com/company/bugtrackr" target="_blank"> BugTrackr Official</a></li>
        </ul>
      </div>
    </AppLayout>
  );
}
