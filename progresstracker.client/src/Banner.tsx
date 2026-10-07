export default function Banner() {
  return (
    <div className="banner-container">
        <button className="banner-button">
            <img src="/calendar.png" alt="Calendar" className="banner-button-image" />
        </button>
        <button className="banner-button">
            <img src="/profile.png" alt="Profile" className="banner-button-image" />
        </button>
    </div>
  );
}
