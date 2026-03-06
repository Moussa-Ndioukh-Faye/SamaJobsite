const MentionsLegales = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-primary-600 mb-2">Mentions légales</h1>
    <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : mars 2026</p>

    <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Éditeur de la plateforme</h2>
        <p>
          <strong>SamaJob</strong><br />
          Plateforme de micro-missions au Sénégal<br />
          Email : <a href="mailto:contact@samajob.sn" className="text-primary-600 underline">contact@samajob.sn</a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Hébergement</h2>
        <p>
          La plateforme SamaJob est hébergée par :<br />
          <strong>Vercel Inc.</strong> — 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.<br />
          La base de données est gérée par <strong>Neon Inc.</strong>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu de la plateforme SamaJob (logo, textes, code source, design) est la
          propriété exclusive de SamaJob. Toute reproduction ou utilisation non autorisée est interdite.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Responsabilité</h2>
        <p>
          SamaJob agit en qualité d'intermédiaire entre clients et prestataires. SamaJob ne peut être
          tenu responsable du contenu publié par les utilisateurs, ni des relations contractuelles
          établies entre eux en dehors de la plateforme.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit sénégalais. Tout litige relatif à
          l'utilisation de la plateforme relève de la compétence des tribunaux de Dakar.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
        <p>
          Pour toute question, contactez-nous à{' '}
          <a href="mailto:contact@samajob.sn" className="text-primary-600 underline">contact@samajob.sn</a>.
        </p>
      </section>

    </div>
  </div>
);

export default MentionsLegales;
