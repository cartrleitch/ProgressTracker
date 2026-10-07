import { useAuth } from "./services/AuthContext";

export default function Banner() {
  // Renders two buttons, the one with a calendar image for for showing streaks and progress, and the one with a profile image for showing user profile and settings.
  const signOut = useAuth().signOut;
  return (
    <div className="banner-container">

     <div className="banner-button-container-left">
      <button className="banner-button">
        <img
          src="/calendar.png"
          alt="Calendar"
          className="banner-button-image"
        />
      </button>
      </div>

      <div className="banner-button-container-right">
      <button className="banner-button">
        <img src="/profile.png" alt="Profile" className="banner-button-image" />
      </button>
      <button className="banner-button" onClick={signOut}>
        <img src="/logout.png" alt="LogOut" className="banner-button-image" />
      </button>
      </div>
    </div>
  );
}
