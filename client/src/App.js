import { Router, Route } from 'react-router-dom';
import './App.css';
import history from './utility/history';
import Home from './pages/Home';
import Accommodation from './pages/Accommodation';

function App() {

  return (
      <Router history={history}>
        <Route path="/" exact component={Home} />
        <Route path="/accomodation/:accomodationId" exact component={Accommodation} />
      
      </Router>
  );
}

export default App;
