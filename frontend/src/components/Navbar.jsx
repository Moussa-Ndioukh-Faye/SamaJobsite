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
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-secondary-500' : 'text-gray-600 hover:text-primary-600'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo – reproduit le logo officiel SamaJob */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* Icône : S avec flèche verte, inspiré du logo */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow overflow-hidden">
                {/* Mini drapeau sénégalais en arrière-plan */}
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-[#009A44]" />
                  <div className="flex-1 bg-[#FDEF42]" />
                  <div className="flex-1 bg-[#E31E24]" />
                </div>
                {/* Flèche verte par-dessus */}
                <svg className="relative z-10 w-5 h-5 text-secondary-500 drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19L19 5M19 5H9M19 5v10" />
                </svg>
              </div>
            </div>
            {/* Texte : "Sama" bleu marine, "Job" vert */}
            <span className="font-extrabold text-xl tracking-tight">
              <span className="text-primary-600">Sama</span><span className="text-secondary-500">Job</span>
            </span>
          </Link>

          {/* Nav liens desktop */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/missions" className={navLinkClass}>Missions</NavLink>
            <NavLink to="/prestataires" className={navLinkClass}>Prestataires</NavLink>
            <NavLink to="/comment-ca-marche" className={navLinkClass}>Comment ça marche</NavLink>
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
                    <span className="text-sm font-medium text-gray-700">{user?.nom}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-1">
                      <Link to="/profil" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        <span>Mon profil</span>
                      </Link>
                      <Link to={getDashboardPath()} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        <span>Dashboard</span>
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <span>Déconnexion</span>
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
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-2 shadow-lg">
          <NavLink to="/missions"          onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Missions</NavLink>
          <NavLink to="/prestataires"      onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Prestataires</NavLink>
          <NavLink to="/comment-ca-marche" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Comment ça marche</NavLink>
          <hr className="border-gray-100" />
          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-primary-600 font-semibold">Mon espace</Link>
              <Link to="/profil"            onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700">Mon profil</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-red-600 font-medium">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-primary-600 font-semibold">Se connecter</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-secondary-600 font-semibold">S'inscrire</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
