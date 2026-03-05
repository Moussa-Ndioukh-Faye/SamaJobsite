import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-primary-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-extrabold text-xl text-white">
              Sama<span className="text-secondary-400">Job</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            La plateforme N°1 de micro-missions pour les étudiants et prestataires au Sénégal.
          </p>
          {/* Réseaux sociaux */}
          <div className="flex items-center gap-2">
            <a href="#" aria-label="Facebook"
              className="w-8 h-8 rounded-lg bg-primary-800 hover:bg-secondary-600 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter / X"
              className="w-8 h-8 rounded-lg bg-primary-800 hover:bg-secondary-600 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn"
              className="w-8 h-8 rounded-lg bg-primary-800 hover:bg-secondary-600 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Plateforme */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Plateforme</h4>
          <ul className="space-y-2.5">
            <li><Link to="/missions"             className="text-sm hover:text-secondary-400 transition-colors">Parcourir les missions</Link></li>
            <li><Link to="/prestataires"          className="text-sm hover:text-secondary-400 transition-colors">Trouver un prestataire</Link></li>
            <li><Link to="/register?role=CLIENT" className="text-sm hover:text-secondary-400 transition-colors">Publier une mission</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
          <ul className="space-y-2.5">
            <li><Link to="/comment-ca-marche"           className="text-sm hover:text-secondary-400 transition-colors">Comment ça marche</Link></li>
            <li><a href="mailto:contact@samajob.sn"     className="text-sm hover:text-secondary-400 transition-colors">Nous contacter</a></li>
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Légal</h4>
          <ul className="space-y-2.5">
            <li><Link to="/mentions-legales" className="text-sm hover:text-secondary-400 transition-colors">Mentions légales</Link></li>
            <li><Link to="/confidentialite"  className="text-sm hover:text-secondary-400 transition-colors">Confidentialité</Link></li>
            <li><Link to="/cgu"              className="text-sm hover:text-secondary-400 transition-colors">CGU</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-primary-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} SamaJob. Tous droits réservés.</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span>Fait avec</span>
          <span className="text-red-400">♥</span>
          <span>au Sénégal</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
