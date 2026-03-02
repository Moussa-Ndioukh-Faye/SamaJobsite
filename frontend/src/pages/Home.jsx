import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import MissionCard from '../components/MissionCard';

const DOMAINES = [
  { label: 'Développement web',    icon: '💻', count: '120+' },
  { label: 'Design graphique',     icon: '🎨', count: '85+' },
  { label: 'Rédaction',            icon: '✍️',  count: '95+' },
  { label: 'Marketing digital',    icon: '📱', count: '70+' },
  { label: 'Traduction',           icon: '🌍', count: '40+' },
  { label: 'Photographie',         icon: '📸', count: '35+' },
  { label: 'Assistance virtuelle', icon: '🤝', count: '60+' },
  { label: 'Saisie de données',    icon: '📊', count: '50+' },
];

const STATS = [
  { value: '10 000+', label: 'Prestataires actifs' },
  { value: '5 000+',  label: 'Missions réalisées' },
  { value: '200+',    label: 'Villes couvertes' },
  { value: '98%',     label: 'Taux de satisfaction' },
];

const STEPS_PRESTATAIRE = [
  { num: '1', title: 'Créez votre profil',    desc: 'Inscrivez-vous et complétez votre profil prestataire avec vos compétences.' },
  { num: '2', title: 'Parcourez les missions',desc: 'Consultez les missions disponibles et postulez à celles qui correspondent.' },
  { num: '3', title: 'Réalisez et soyez payé',desc: 'Effectuez la mission et recevez votre paiement sécurisé.' },
];

const STEPS_CLIENT = [
  { num: '1', title: 'Publiez votre mission',  desc: 'Décrivez votre besoin, indiquez le budget et la localisation.' },
  { num: '2', title: 'Choisissez un prestataire', desc: 'Recevez des candidatures et sélectionnez le meilleur profil.' },
  { num: '3', title: 'Mission accomplie',      desc: 'Validez la fin de mission et évaluez le prestataire.' },
];

const Home = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    api.get('/missions?statut=OUVERTE').then(r => setMissions(r.data.missions.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="fade-in">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse" />
                Plateforme N°1 en Afrique de l'Ouest
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
                Trouvez des missions locales et{' '}
                <span className="text-secondary-400">boostez vos revenus</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                SamaJob met en relation étudiants et prestataires sénégalais avec des
                entreprises et particuliers pour des micro-missions rémunérées.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/missions" className="btn-secondary px-6 py-3 text-base shadow-lg hover:shadow-xl">
                  Voir les missions
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-primary-700 font-semibold text-base hover:bg-gray-100 transition-colors shadow-lg">
                  S'inscrire gratuitement
                </Link>
              </div>

              {/* Stats inline */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                {STATS.slice(0, 2).map(s => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-extrabold text-secondary-400">{s.value}</div>
                    <div className="text-sm text-white/70 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration carte flottante */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative">
                <div className="w-72 h-80 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-secondary-400 flex items-center justify-center font-bold text-white">M</div>
                    <div>
                      <div className="text-sm font-semibold text-white">Mamadou Diallo</div>
                      <div className="text-xs text-white/60">Développeur web</div>
                    </div>
                    <span className="ml-auto badge bg-secondary-500 text-white text-xs">Validé</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="text-xs text-white/60 mb-1">Mission acceptée</div>
                      <div className="text-sm font-medium text-white">Site e-commerce Dakar</div>
                      <div className="text-secondary-400 font-bold text-base mt-1">150 000 FCFA</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="text-xs text-white/60 mb-1">Évaluation reçue</div>
                      <div className="flex text-yellow-400">★★★★★</div>
                      <div className="text-xs text-white/60 mt-1">"Excellent travail, très professionnel"</div>
                    </div>
                  </div>
                </div>
                {/* Badge flottant */}
                <div className="absolute -top-4 -right-4 bg-secondary-500 text-white rounded-xl px-3 py-2 text-xs font-bold shadow-lg">
                  +5 000 FCFA gagnés
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSIONS RÉCENTES ─────────────────────────────────────── */}
      {missions.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Missions récentes</h2>
                <p className="text-gray-500 mt-1">Trouvez votre prochaine opportunité</p>
              </div>
              <Link to="/missions" className="btn-outline hidden md:inline-flex">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {missions.map(m => <MissionCard key={m.id} mission={m} />)}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link to="/missions" className="btn-outline">Voir toutes les missions</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CATÉGORIES ────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Catégories populaires</h2>
            <p className="text-gray-500 mt-2">Explorez toutes les catégories de missions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DOMAINES.map(d => (
              <Link
                key={d.label}
                to={`/missions?domaine=${encodeURIComponent(d.label)}`}
                className="card text-center hover:border hover:border-primary-300 cursor-pointer group"
              >
                <div className="text-3xl mb-3">{d.icon}</div>
                <div className="font-semibold text-gray-800 text-sm group-hover:text-primary-600 transition-colors">{d.label}</div>
                <div className="text-xs text-gray-400 mt-1">{d.count} missions</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Comment ça marche ?</h2>
            <p className="text-gray-500 mt-2">Simple, rapide et sécurisé</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Prestataires */}
            <div>
              <h3 className="text-lg font-bold text-primary-600 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">P</span>
                Pour les Prestataires
              </h3>
              <div className="space-y-5">
                {STEPS_PRESTATAIRE.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{s.num}</div>
                    <div>
                      <div className="font-semibold text-gray-800">{s.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Clients */}
            <div>
              <h3 className="text-lg font-bold text-secondary-600 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center text-sm font-bold">C</span>
                Pour les Clients
              </h3>
              <div className="space-y-5">
                {STEPS_CLIENT.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-secondary-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{s.num}</div>
                    <div>
                      <div className="font-semibold text-gray-800">{s.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Prêt à commencer l'aventure SamaJob ?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Rejoignez des milliers de prestataires et clients au Sénégal
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register?role=PRESTATAIRE" className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-white text-primary-700 font-bold text-base hover:bg-gray-100 transition-colors shadow-lg">
              Je suis Prestataire
            </Link>
            <Link to="/register?role=CLIENT" className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-secondary-500 text-white font-bold text-base hover:bg-secondary-600 transition-colors shadow-lg">
              Je suis Client →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
