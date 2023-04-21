import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InfoEntryPage from './pages/InfoEntry';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute Component={<HomePage />} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/entry" element={<InfoEntryPage />} />
        <Route component={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
