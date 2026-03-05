import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import MissionCard from '../components/MissionCard';

const DOMAINES = [
  { label: 'Développement web',    icon: '💻', color: 'bg-blue-50',    iconBg: 'bg-blue-100' },
  { label: 'Design graphique',     icon: '🎨', color: 'bg-purple-50',  iconBg: 'bg-purple-100' },
  { label: 'Rédaction',            icon: '✍️',  color: 'bg-green-50',   iconBg: 'bg-green-100' },
  { label: 'Marketing digital',    icon: '📱', color: 'bg-orange-50',  iconBg: 'bg-orange-100' },
  { label: 'Traduction',           icon: '🌍', color: 'bg-teal-50',    iconBg: 'bg-teal-100' },
  { label: 'Photographie',         icon: '📸', color: 'bg-pink-50',    iconBg: 'bg-pink-100' },
  { label: 'Assistance virtuelle', icon: '🤝', color: 'bg-indigo-50',  iconBg: 'bg-indigo-100' },
  { label: 'Saisie de données',    icon: '📊', color: 'bg-amber-50',   iconBg: 'bg-amber-100' },
];

const STATS = [
  { value: '10 000+', label: 'Prestataires actifs' },
  { value: '5 000+',  label: 'Missions réalisées' },
  { value: '200+',    label: 'Villes couvertes' },
  { value: '98%',     label: 'Taux de satisfaction' },
];

const STEPS_PRESTATAIRE = [
  { num: '1', title: 'Créez votre profil',     desc: 'Inscrivez-vous et complétez votre profil avec vos compétences et expériences.' },
  { num: '2', title: 'Parcourez les missions', desc: 'Consultez les missions disponibles et postulez à celles qui correspondent.' },
  { num: '3', title: 'Réalisez et soyez payé', desc: 'Effectuez la mission et recevez votre paiement sécurisé.' },
];

const STEPS_CLIENT = [
  { num: '1', title: 'Publiez votre mission',     desc: 'Décrivez votre besoin, indiquez le budget et la localisation.' },
  { num: '2', title: 'Choisissez un prestataire', desc: 'Recevez des candidatures et sélectionnez le meilleur profil.' },
  { num: '3', title: 'Mission accomplie',          desc: 'Validez la fin de mission et évaluez le prestataire.' },
];

const TESTIMONIALS = [
  {
    name: 'Fatou Ndiaye',
    role: 'Étudiante en design',
    text: 'SamaJob m\'a permis de trouver mes premières missions et de construire mon portfolio. Je gagne suffisamment pour financer mes études.',
    initials: 'FN',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Ibrahima Sarr',
    role: 'Directeur PME, Dakar',
    text: 'En tant que client, j\'ai trouvé un développeur compétent en moins de 24h. Le processus est simple et les prestataires sont de grande qualité.',
    initials: 'IS',
    color: 'from-primary-600 to-blue-500',
  },
  {
    name: 'Aissatou Ba',
    role: 'Freelance – Rédactrice',
    text: 'La validation de mon profil a pris seulement 12h. Depuis, j\'ai réalisé plus de 20 missions. La plateforme est vraiment professionnelle.',
    initials: 'AB',
    color: 'from-secondary-500 to-teal-500',
  },
];

const HERO_BG = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const Home = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    api.get('/missions?statut=OUVERTE').then(r => setMissions(r.data.missions.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="fade-in">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-600 text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: HERO_BG }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium mb-6 border border-white/10">
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
                <Link to="/missions" className="btn-secondary px-6 py-3 text-base shadow-lg">
                  Voir les missions
                </Link>
                <Link to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-primary-700 font-semibold text-base hover:bg-gray-100 hover:-translate-y-px transition-all shadow-lg">
                  S'inscrire gratuitement
                </Link>
              </div>
              {/* Stats inline */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                {STATS.slice(0, 2).map(s => (
                  <div key={s.label} className="glass rounded-xl p-4">
                    <div className="text-2xl font-extrabold text-secondary-400">{s.value}</div>
                    <div className="text-sm text-white/70 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration flottante */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative animate-float">
                <div className="w-72 glass rounded-3xl p-6 shadow-2xl">
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
                      <div className="flex text-yellow-400 text-sm">★★★★★</div>
                      <div className="text-xs text-white/60 mt-1">"Excellent travail, très professionnel"</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-secondary-500 text-white rounded-xl px-3 py-2 text-xs font-bold shadow-lg">
                  +5 000 FCFA gagnés
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white text-primary-700 rounded-xl px-3 py-2 text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
                  3 nouvelles candidatures
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map(s => (
              <div key={s.label} className="text-center px-6 py-2">
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
                <p className="section-subtitle">Trouvez votre prochaine opportunité</p>
              </div>
              <Link to="/missions" className="btn-outline hidden md:inline-flex items-center gap-1.5">
                Voir tout
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
            <p className="section-subtitle">Explorez toutes les catégories de missions disponibles</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DOMAINES.map(d => (
              <Link
                key={d.label}
                to={`/missions?domaine=${encodeURIComponent(d.label)}`}
                className={`group flex flex-col items-center p-5 rounded-xl border border-gray-100 ${d.color} hover:border-primary-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-14 h-14 rounded-2xl ${d.iconBg} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {d.icon}
                </div>
                <div className="font-semibold text-gray-800 text-sm text-center group-hover:text-primary-600 transition-colors">
                  {d.label}
                </div>
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
            <p className="section-subtitle">Simple, rapide et sécurisé en 3 étapes</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Prestataires */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">P</div>
                <h3 className="text-lg font-bold text-primary-600">Pour les Prestataires</h3>
              </div>
              <div className="space-y-6">
                {STEPS_PRESTATAIRE.map((s, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i < STEPS_PRESTATAIRE.length - 1 && (
                      <div className="absolute left-4 top-9 w-0.5 h-8 bg-primary-100" />
                    )}
                    <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 relative z-10">
                      {s.num}
                    </div>
                    <div className="pt-1">
                      <div className="font-semibold text-gray-800">{s.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5 leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register?role=PRESTATAIRE" className="btn-primary w-full mt-7 py-2.5 justify-center">
                Devenir Prestataire
              </Link>
            </div>

            {/* Clients */}
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold text-sm">C</div>
                <h3 className="text-lg font-bold text-secondary-600">Pour les Clients</h3>
              </div>
              <div className="space-y-6">
                {STEPS_CLIENT.map((s, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i < STEPS_CLIENT.length - 1 && (
                      <div className="absolute left-4 top-9 w-0.5 h-8 bg-secondary-100" />
                    )}
                    <div className="w-9 h-9 rounded-full bg-secondary-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 relative z-10">
                      {s.num}
                    </div>
                    <div className="pt-1">
                      <div className="font-semibold text-gray-800">{s.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5 leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register?role=CLIENT" className="btn-secondary w-full mt-7 py-2.5 justify-center">
                Publier une mission
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ───────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Ce qu'ils disent de nous</h2>
            <p className="section-subtitle">Des milliers d'utilisateurs nous font confiance chaque jour</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 truncate">{t.role}</div>
                  </div>
                  <div className="ml-auto flex text-yellow-400 text-xs flex-shrink-0">★★★★★</div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary-800 via-primary-700 to-secondary-700 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: HERO_BG }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm mb-5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse" />
            Rejoignez +10 000 utilisateurs actifs
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Prêt à commencer l'aventure SamaJob ?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Rejoignez des milliers de prestataires et clients au Sénégal
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register?role=PRESTATAIRE"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-white text-primary-700 font-bold text-base hover:bg-gray-100 hover:-translate-y-px transition-all shadow-lg">
              Je suis Prestataire
            </Link>
            <Link to="/register?role=CLIENT"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-secondary-500 text-white font-bold text-base hover:bg-secondary-600 hover:-translate-y-px transition-all shadow-lg">
              Je suis Client
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
