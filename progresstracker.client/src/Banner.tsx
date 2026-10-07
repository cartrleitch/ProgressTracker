export default function Banner() {
  // Renders two buttons, the one with a calendar image for for showing streaks and progress, and the one with a profile image for showing user profile and settings.

  return (
    <div className="banner-container">
      <button className="banner-button">
        <img
          src="/calendar.png"
          alt="Calendar"
          className="banner-button-image"
        />
      </button>
      <button className="banner-button">
        <img src="/profile.png" alt="Profile" className="banner-button-image" />
      </button>
    </div>
  );
}
