import { useState } from "react";
import { CreateGoalButton } from "./Components";
//import { GoalItem } from "./Components";
import { GoalList } from "./Components";
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [showAttribution, setShowAttribution] = useState(false);
  const [filter, setFilter] = useState("All");

  const handleGoalCreated = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div>
      <div className="app-content">
        <h1 id="tableLabel">Progress Tracker</h1>

        <div className="goal-controls">
          {" "}
          <div className="filter-spacer" aria-hidden="true"></div>
          <CreateGoalButton onGoalCreated={handleGoalCreated} />
          <div className="filter-container">
            <select
              id="filterSelect"
              aria-label="Filter Goals"
              className="filter-select"
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
            >
              <option value="All">All</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="WeeklyOnThisDay">Weekly On This Day</option>
              <option value="Monthly">Monthly</option>
              <option value="MonthlyOnThisDay">Monthly On This Day</option>
              <option value="Yearly">Yearly</option>
              <option value="YearlyOnThisDay">Yearly On This Day</option>
            </select>
          </div>
        </div>
        <GoalList refresh={refresh} filter={filter} />
        {/*<GoalItem
          goal={{
            id: 1,
            name: "Sample Goal (Frontend Only)",
            targetValue: 10,
            currentValue: 5,
            period: "Daily",
            type: "Numeric",
            unit: "Hrs",
          }}
          onEdit={() => {}}
          onDelete={() => {}}
        />
         <GoalItem goal={{ id: 1, name: 'Sample Goal (Frontend Only)', targetValue: 1, currentValue: 0, period: 'Daily', type: 'Checkbox', unit: '' }} onEdit={() => { }} onDelete={() => { }} />
                <GoalItem goal={{ id: 1, name: 'Sample Goal (Frontend Only)', targetValue: 5, currentValue: 0, period: 'Daily', type: 'Time', unit: 'Hrs' }} onEdit={() => { }} onDelete={() => { }} />
                <GoalItem goal={{ id: 1, name: 'Sample Goal (Frontend Only)', targetValue: 2000, currentValue: 0, period: 'Daily', type: 'Amount', unit: 'Calories' }} onEdit={() => { }} onDelete={() => { }} /> */}
      </div>

      <footer>
        <a
          className="attribution-button"
          onClick={() => setShowAttribution(!showAttribution)}
        >
          {showAttribution ? "Hide Attribution" : "Show Attribution"}
        </a>
        {showAttribution && (
          <div>
            <a
              href="https://www.flaticon.com/free-icons/plus"
              title="plus icons"
            >
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
            </a>
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
