import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import SiteInfo from './pages/SiteInfo/SiteInfo';
import AuthRequired from './components/AuthRequired';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/Home/Home';
import Sites from './pages/dashboard/Sites/Sites';
import DashboardSettings from './pages/dashboard/Settings/Settings';
import SiteDetail from './pages/dashboard/SiteDetail/SiteDetail';
import Favorites from './pages/dashboard/Favorites/Favorites';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/site/:id" element={<SiteInfo />} />

        <Route element={<AuthRequired />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/sites" element={<Sites />} />
            <Route path="/dashboard/sites/:id" element={<SiteDetail />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
            <Route path="/dashboard/favorites" element={<Favorites />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
