import { useState } from "react";
import ShowCompletedToggle from "./Components/ShowCompletedToggle/ShowCompletedToggle";
import CreateGoalButton from "./Components/CreateGoalButton/CreateGoalButton";
import GoalFilter from "./Components/GoalFilter/GoalFilter";
import GoalList from "./Components/GoalList/GoalList";
import Attributions from "./Components/Attributions/Attributions";
import Banner from "./Components/Banner/Banner";
import { Bounce, ToastContainer } from "react-toastify";
import { useAuth } from "./services/AuthContext";
import AuthForm from "./Components/AuthForm/AuthForm";
import { Navigate, Route, Routes } from "react-router";
import Profile from "./Components/Profile/Profile";
import "./styles/App.css";
import "./Components/Profile/Profile.css";
import "./Components/GoalFilter/GoalFilter.css";
import "./Components/CreateGoalButton/CreateGoalButton.css";
import "./Components/ShowCompletedToggle/ShowCompletedToggle.css";
import "./Components/Attributions/Attributions.css";
import "./Components/Banner/Banner.css";
import "./Components/AuthForm/AuthForm.css";
import "./Components/GoalItem/GoalItem.css";
import "./Components/GoalList/GoalList.css";
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
        limit={1}
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
