import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthRequired from './components/AuthRequired';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/Home';
import Sites from './pages/dashboard/Sites';
import DashboardSettings from './pages/dashboard/DashboardSettings';
import SiteDetail from './pages/dashboard/SiteDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route element={<AuthRequired />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/sites" element={<Sites />} />
            <Route path="/dashboard/sites/:id" element={<SiteDetail />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
