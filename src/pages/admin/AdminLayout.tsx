import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Plus, LayoutDashboard, LogOut, Settings, ChevronRight } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useState } from 'react';
import ContactSettings from '../../components/ContactSettings';

export default function AdminLayout() {
  const { logout, isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/add-product', label: 'Add Product', icon: Plus },
    {
      path: '/admin/affiliate-analytics',
      label: 'Analytics',
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">

      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-[#d4af37] via-[#f4e5c2] to-[#b8860b] rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white logo-font">
                    L
                  </span>
                </div>

                <span className="font-bold text-gray-900 hidden sm:block">
                  LUXE<span className="text-[#b8860b]">FINDS</span>
                </span>
              </Link>

              <div className="h-6 w-px bg-gray-300 hidden sm:block" />

              <div className="flex items-center gap-2 text-gray-600">
                <LayoutDashboard className="w-4 h-4" />

                <span className="font-medium hidden sm:block">
                  Admin Dashboard
                </span>

                <span className="font-medium sm:hidden">
                  Admin
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />

                  <span className="hidden sm:inline">
                    {item.label}
                  </span>
                </Link>
              ))}

              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
              >
                <Settings className="w-4 h-4" />

                <span className="hidden sm:inline">
                  Settings
                </span>
              </button>

              <div className="h-6 w-px bg-gray-300 mx-2" />

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>

            </nav>
          </div>
        </div>

        {/* Mobile Breadcrumb */}
        <div className="sm:hidden border-t border-gray-100 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">

            <span>Admin</span>

            <ChevronRight className="w-4 h-4" />

            <span className="font-medium text-gray-900">
              {location.pathname.includes('add-product')
                ? 'Add Product'
                : location.pathname.includes('affiliate-analytics')
                ? 'Analytics'
                : 'Products'}
            </span>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Settings Modal */}
      <ContactSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

    </div>
  );
}