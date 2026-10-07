import { useState } from "react";
export default function Attributions() {
  const [showAttribution, setShowAttribution] = useState(false);

  return (
    <footer>
      <a
        className="attribution-button"
        onClick={() => setShowAttribution(!showAttribution)}
      >
        {showAttribution ? "Hide Attribution" : "Show Attribution"}
      </a>
      {showAttribution && (
        <div>
          <a href="https://www.flaticon.com/free-icons/plus" title="plus icons">
            Plus icons created by Fuzzee - Flaticon
          </a>{" "}
          <br />
          <a
            href="https://www.flaticon.com/free-icons/trash"
            title="trash icons"
          >
            Trash icons created by Magnific - Flaticon
          </a>{" "}
          <br />
          <a
            href="https://www.flaticon.com/free-icons/write"
            title="write icons"
          >
            Write icons created by Tanah Basah - Flaticon
          </a>{" "}
          <br />
          <a
            href="https://www.flaticon.com/free-icons/calendar"
            title="calendar icons"
          >
            Calendar icons created by Magnific - Flaticon
          </a>{" "}
          <br />
          <a href="https://www.flaticon.com/free-icons/user" title="user icons">
            User icons created by Magnific - Flaticon
          </a>
        </div>
      )}
    </footer>
  );
}
