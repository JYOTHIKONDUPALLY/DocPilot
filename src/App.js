import './App.css';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Editor from "./pages/Editor";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Editor" element={<Editor />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
