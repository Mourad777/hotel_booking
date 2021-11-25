import { Router, Route } from 'react-router-dom';
import './App.css';
import Layout from './hoc/Layout';
import history from './utility/history';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {

  return (
    <Layout>
      <Router history={history}>
        <Route path="/" exact component={Home} />
        <Route path="/room/:roomId" exact component={Room} />
      
      </Router>
    </Layout>
  );
}

export default App;
