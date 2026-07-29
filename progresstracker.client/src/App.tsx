import { CreateGoalButton } from './Components';
import { GoalItem } from './Components';
import './App.css';

function App() {

    return (
        <div>
            <div>
                <h1 id="tableLabel">Test</h1>
                <p>Test</p>
                <CreateGoalButton />
                <GoalItem goal={{ id: 1, name: 'Test Goal', targetValue: 100, currentValue: 76, period: 'Monthly' }} />
                <GoalItem goal={{ id: 2, name: 'Test Goal 2', targetValue: 5, currentValue: 2, period: 'Daily' }} />
            </div>

            <footer>
                <a href="https://www.flaticon.com/free-icons/plus" title="plus icons">Plus icons created by Fuzzee - Flaticon</a> <br />    
                <a href="https://www.flaticon.com/free-icons/trash" title="trash icons">Trash icons created by Magnific - Flaticon</a> <br /> 
                <a href="https://www.flaticon.com/free-icons/write" title="write icons">Write icons created by Tanah Basah - Flaticon</a>
            </footer>

        </div >
    );
}

export default App;