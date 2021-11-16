import { Router } from 'react-router-dom';
import './App.css';
import Layout from './hoc/Layout';
import history from './utility/history';

function App() {
  return (
    <Layout>
      <Router history={history}>
        
        <div className="App">

          Hotel app

        </div>
      </Router>
    </Layout>
  );
}

export default App;
