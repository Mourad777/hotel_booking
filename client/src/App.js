import { Router } from 'react-router-dom';
import './App.css';
import Layout from './hoc/Layout';
import history from './utility/history';
import BasicDateRangePicker from './components/date-selector/DateSelector';

function App() {
  return (
    <Layout>
      <Router history={history}>
        
        <div className="App">

        Home

        </div>
        <BasicDateRangePicker />
        
      </Router>
    </Layout>
  );
}

export default App;
