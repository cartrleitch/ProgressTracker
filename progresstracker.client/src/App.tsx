import { useState } from "react";
import ShowCompletedToggle from "./ShowCompletedToggle";
import CreateGoalButton from "./CreateGoalButton";
import GoalFilter from "./GoalFilter";
import GoalList from "./GoalList";
import Attributions from "./Attributions";
import { Bounce, ToastContainer } from "react-toastify";
import "./App.css";
//import { GoalItem } from "./Components";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState<string[]>(["All"]);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleGoalCreated = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div>
      <div className="app-content">
        <h1 id="tableLabel">Progress Tracker</h1>

        <div className="goal-controls">
          {" "}
          <ShowCompletedToggle
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
          />
          <CreateGoalButton onGoalCreated={handleGoalCreated} />
          <GoalFilter filter={filter} setFilter={setFilter} />
        </div>
        <GoalList
          refresh={refresh}
          filter={filter}
          showCompleted={showCompleted}
        />
        {/* <GoalItem goal={{ id: 1, name: 'Sample Goal (Frontend Only)', targetValue: 1, currentValue: 0, period: 'Daily', type: 'Checkbox', unit: '' }} onEdit={() => { }} onDelete={() => { }} />
        <GoalItem goal={{ id: 1, name: 'Sample Goal (Frontend Only)', targetValue: 5, currentValue: 0, period: 'Daily', type: 'Time', unit: 'Hrs' }} onEdit={() => { }} onDelete={() => { }} />
        <GoalItem goal={{ id: 1, name: 'Sample Goal (Frontend Only)', targetValue: 2000, currentValue: 0, period: 'Daily', type: 'Amount', unit: 'Calories' }} onEdit={() => { }} onDelete={() => { }} /> */}
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        limit={5}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Attributions />
    </div>
  );
}

export default App;
