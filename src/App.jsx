import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import VisitDocumentation from './pages/VisitDocumentation';
import Schedule from './pages/Schedule';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
          <Route path="/visit/:visitId" element={<VisitDocumentation />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
        <NavBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
