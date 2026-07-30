import { useState } from 'react';
import { CreateGoalButton } from './Components';
import { GoalList } from './Components';
import './App.css';

function App() {
    const [refresh, setRefresh] = useState(0);
    const [showAttribution, setShowAttribution] = useState(false);

    const handleGoalCreated = () => {
        setRefresh((prev) => prev + 1);
    };

    return (
        <div>
            <div className="app-content">
                <h1 id="tableLabel">Progress Tracker</h1>
                <CreateGoalButton onGoalCreated={handleGoalCreated} />
                <GoalList refresh={refresh} />
            </div>

            <footer>
                <a className="attribution-button" onClick={() => setShowAttribution(!showAttribution)}>
                    {showAttribution ? 'Hide Attribution' : 'Show Attribution'}
                </a>
                {showAttribution && (
                    <div>
                        <a href="https://www.flaticon.com/free-icons/plus" title="plus icons">Plus icons created by Fuzzee - Flaticon</a> <br />
                        <a href="https://www.flaticon.com/free-icons/trash" title="trash icons">Trash icons created by Magnific - Flaticon</a> <br />
                        <a href="https://www.flaticon.com/free-icons/write" title="write icons">Write icons created by Tanah Basah - Flaticon</a>
                    </div>
                )}
            </footer>
        </div >
    );
}

export default App;