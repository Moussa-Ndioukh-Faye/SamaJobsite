import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-primary-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-extrabold text-xl text-white">
              Sama<span className="text-secondary-400">Job</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            La plateforme N°1 de micro-missions pour les étudiants et prestataires au Sénégal.
          </p>
        </div>

        {/* Plateforme */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Plateforme</h4>
          <ul className="space-y-2.5">
            <li><Link to="/missions"     className="text-sm hover:text-secondary-400 transition-colors">Parcourir les missions</Link></li>
            <li><Link to="/prestataires" className="text-sm hover:text-secondary-400 transition-colors">Trouver un prestataire</Link></li>
            <li><Link to="/register?role=CLIENT" className="text-sm hover:text-secondary-400 transition-colors">Publier une mission</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
          <ul className="space-y-2.5">
            <li><Link to="/comment-ca-marche" className="text-sm hover:text-secondary-400 transition-colors">Comment ça marche</Link></li>
            <li><a href="mailto:contact@samajob.sn" className="text-sm hover:text-secondary-400 transition-colors">Nous contacter</a></li>
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Légal</h4>
          <ul className="space-y-2.5">
            <li><Link to="/mentions-legales"  className="text-sm hover:text-secondary-400 transition-colors">Mentions légales</Link></li>
            <li><Link to="/confidentialite"   className="text-sm hover:text-secondary-400 transition-colors">Confidentialité</Link></li>
            <li><Link to="/cgu"               className="text-sm hover:text-secondary-400 transition-colors">CGU</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-primary-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} SamaJob. Tous droits réservés.</p>
        <p className="text-xs text-gray-500">Fait avec ❤️ au Sénégal</p>
      </div>
    </div>
  </footer>
);

export default Footer;
