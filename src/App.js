import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RootCaPage from './pages/RootCaPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import ConnectToContractPage from './pages/ConnectToContractPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute Component={<HomePage />} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/root" element={<PrivateRoute Component={<RootCaPage />} />} />
        <Route path="/connect" element={<PrivateRoute Component={<ConnectToContractPage />} />} />
        <Route component={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
