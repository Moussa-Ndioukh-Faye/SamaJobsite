import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isClient, isPrestataire, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (isAdmin)        return '/admin/dashboard';
    if (isClient)       return '/dashboard/client';
    if (isPrestataire)  return '/dashboard/prestataire';
    return '/';
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium pb-1 transition-all duration-200 border-b-2 ${
      isActive
        ? 'text-primary-600 border-secondary-500'
        : 'text-gray-600 hover:text-primary-600 border-transparent'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <img src="/logo.png" alt="SamaJob" className="h-12 w-auto" />
          </Link>

          {/* Nav liens desktop */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/missions" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Missions
              </span>
            </NavLink>
            <NavLink to="/prestataires" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Prestataires
              </span>
            </NavLink>
            <NavLink to="/comment-ca-marche" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Comment ça marche
              </span>
            </NavLink>
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="btn-outline text-sm py-2 px-4">
                  Mon espace
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.nom?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user?.nom}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs text-gray-400">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.nom}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/profil" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon profil
                      </Link>
                      <Link to={getDashboardPath()} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Dashboard
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-outline text-sm py-2 px-4">Se connecter</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">S'inscrire</Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1 shadow-lg animate-slide-down">
          <NavLink to="/missions" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Missions
          </NavLink>
          <NavLink to="/prestataires" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Prestataires
          </NavLink>
          <NavLink to="/comment-ca-marche" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Comment ça marche
          </NavLink>
          <div className="h-px bg-gray-100 my-1" />
          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors">
                Mon espace
              </Link>
              <Link to="/profil" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Mon profil
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2.5 py-2.5 px-2 w-full text-left text-sm text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                Déconnexion
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-outline text-center py-2.5 text-sm">Se connecter</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center py-2.5 text-sm">S'inscrire</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
