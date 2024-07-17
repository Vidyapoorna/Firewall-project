
import Loginpage from './components/Loginpage';
import Homepage from './components/Homepage';
import {BrowserRouter as Router,Route,Routes }  from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router>
      <Routes>
        <Route path="/" exact Component={Loginpage} />
        <Route path="/home" exact Component={Homepage} />
      </Routes>
    </Router>
      </header>
    </div>
  );
}

export default App;