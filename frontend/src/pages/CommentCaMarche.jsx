import { Link } from 'react-router-dom';

const ETAPES_PRESTATAIRE = [
  { num: '01', icon: '👤', titre: 'Créez votre profil',     desc: 'Inscrivez-vous gratuitement et complétez votre profil avec vos compétences, votre domaine et votre bio.' },
  { num: '02', icon: '📋', titre: 'Attendez la validation', desc: 'Un administrateur SamaJob vérifie votre profil sous 24-48h pour garantir la qualité de la plateforme.' },
  { num: '03', icon: '🔍', titre: 'Parcourez les missions',  desc: 'Consultez les missions disponibles et postulez à celles qui correspondent à vos compétences.' },
  { num: '04', icon: '💬', titre: 'Communiquez',             desc: 'Échangez avec le client via le chat intégré pour clarifier les détails de la mission.' },
  { num: '05', icon: '✅', titre: 'Réalisez et soyez payé',  desc: 'Effectuez la mission, faites-la valider et recevez votre paiement.' },
];

const ETAPES_CLIENT = [
  { num: '01', icon: '🏢', titre: 'Créez votre compte',      desc: 'Inscription rapide et gratuite. Votre compte est immédiatement actif.' },
  { num: '02', icon: '📝', titre: 'Publiez votre mission',   desc: 'Décrivez votre besoin, indiquez votre budget, lieu et date souhaitée.' },
  { num: '03', icon: '📥', titre: 'Recevez des candidatures',desc: 'Des prestataires qualifiés et vérifiés postulent avec leurs propositions.' },
  { num: '04', icon: '🤝', titre: 'Sélectionnez',            desc: 'Comparez les profils, lisez les messages de motivation et choisissez le meilleur candidat.' },
  { num: '05', icon: '⭐', titre: 'Évaluez',                 desc: 'Une fois la mission terminée, notez et commentez le prestataire pour aider la communauté.' },
];

const GARANTIES = [
  { icon: '🔒', titre: 'Prestataires vérifiés',     desc: 'Chaque prestataire est validé manuellement par notre équipe avant de pouvoir postuler.' },
  { icon: '⚡', titre: 'Rapide et efficace',         desc: 'Publiez une mission en moins de 2 minutes et recevez vos premières candidatures rapidement.' },
  { icon: '💬', titre: 'Communication intégrée',     desc: 'Chat directement sur la plateforme, pas besoin d\'échanger des contacts personnels.' },
  { icon: '🌍', titre: 'Local et accessible',        desc: 'Conçu pour les réalités africaines : paiement mobile, missions locales, interface simple.' },
];

const CommentCaMarche = () => (
  <div className="fade-in">
    {/* Hero */}
    <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Comment fonctionne SamaJob ?</h1>
        <p className="text-white/75 text-lg">
          Simple, rapide, sécurisé. Découvrez comment notre plateforme connecte les talents aux opportunités.
        </p>
      </div>
    </section>

    {/* Garanties */}
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Pourquoi choisir SamaJob ?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GARANTIES.map(g => (
            <div key={g.titre} className="card text-center">
              <div className="text-4xl mb-4">{g.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{g.titre}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Étapes */}
    <section className="py-14 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-14">
          {/* Prestataire */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">P</div>
              <h2 className="text-xl font-bold text-primary-600">Pour les Prestataires</h2>
            </div>
            <div className="space-y-6">
              {ETAPES_PRESTATAIRE.map((e, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {e.num}
                    </div>
                    {i < ETAPES_PRESTATAIRE.length - 1 && <div className="w-0.5 h-8 bg-primary-200 mt-1" />}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{e.icon}</span>
                      <span className="font-semibold text-gray-800">{e.titre}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register?role=PRESTATAIRE" className="btn-primary mt-8 inline-flex">
              Je m'inscris comme Prestataire →
            </Link>
          </div>

          {/* Client */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-secondary-500 flex items-center justify-center text-white font-bold">C</div>
              <h2 className="text-xl font-bold text-secondary-600">Pour les Clients</h2>
            </div>
            <div className="space-y-6">
              {ETAPES_CLIENT.map((e, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {e.num}
                    </div>
                    {i < ETAPES_CLIENT.length - 1 && <div className="w-0.5 h-8 bg-secondary-200 mt-1" />}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{e.icon}</span>
                      <span className="font-semibold text-gray-800">{e.titre}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register?role=CLIENT" className="btn-secondary mt-8 inline-flex">
              Je publie une mission →
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-14 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="section-title text-center mb-10">Questions fréquentes</h2>
        <div className="space-y-4">
          {[
            { q: "SamaJob est-il gratuit ?", a: "Oui, l'inscription et la consultation des missions sont entièrement gratuites pour prestataires et clients." },
            { q: "Comment sont vérifiés les prestataires ?", a: "Chaque dossier prestataire est examiné manuellement par notre équipe. Nous vérifions le profil, les compétences et la cohérence du dossier." },
            { q: "Puis-je publier des missions depuis n'importe quelle ville ?", a: "Oui ! SamaJob couvre tout le Sénégal. Indiquez simplement la ville de la mission lors de la publication." },
            { q: "Comment se passe le paiement ?", a: "Le paiement est géré directement entre le client et le prestataire. SamaJob facilite la mise en relation mais ne gère pas encore les paiements en ligne (fonctionnalité prévue)." },
          ].map((faq, i) => (
            <div key={i} className="card">
              <div className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                <span className="text-primary-600">Q.</span> {faq.q}
              </div>
              <div className="text-sm text-gray-500 flex items-start gap-2">
                <span className="text-secondary-500">R.</span> {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default CommentCaMarche;
