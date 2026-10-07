import { useState } from "react";
import ShowCompletedToggle from "./ShowCompletedToggle";
import CreateGoalButton from "./CreateGoalButton";
import GoalFilter from "./GoalFilter";
import GoalList from "./GoalList";
import Attributions from "./Attributions";
import Banner from "./Banner";
import { Bounce, ToastContainer } from "react-toastify";
import { useAuth } from "./services/AuthContext";
import AuthForm from "./AuthForm";
import { Navigate, Route, Routes } from "react-router";
import Profile from "./Profile";
import "./App.css";
//import { GoalItem } from "./Components";
function Goals() {
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState<string[]>(["All"]);
  const [showCompleted, setShowCompleted] = useState(true);

  const handleGoalCreated = () => {
    setRefresh((prev) => prev + 1);
  };
  return (
    <div>
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
  );
}

function Tracker() {
  return (
    <div className="app-content">
      <Banner />
      <Routes>
        <Route path="/" element={<Goals />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
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

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <AuthForm />;
  }

  return <Tracker />;
}

export default App;
