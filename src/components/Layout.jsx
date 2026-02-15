import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Toast from './Toast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-900 bg-blueprint">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-6 max-w-[1200px] mx-auto pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
