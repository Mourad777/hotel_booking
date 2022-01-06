import { Router, Route } from 'react-router-dom';
import './App.css';
import history from './utility/history';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {

  return (
      <Router history={history}>
        <Route path="/" exact component={Home} />
        <Route path="/room/:roomId" exact component={Room} />
      
      </Router>
  );
}

export default App;
