const Confidentialite = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-primary-600 mb-2">Politique de confidentialité</h1>
    <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : mars 2026</p>

    <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Responsable du traitement</h2>
        <p>
          SamaJob est une plateforme de mise en relation entre clients et prestataires de services au Sénégal.
          Le responsable du traitement des données est SamaJob, joignable à{' '}
          <a href="mailto:contact@samajob.sn" className="text-primary-600 underline">contact@samajob.sn</a>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Identification :</strong> nom, email, téléphone.</li>
          <li><strong>Profil :</strong> domaine, compétences, biographie, photo.</li>
          <li><strong>Documents :</strong> CV, portfolios et pièces déposés lors de l'inscription ou d'une candidature.</li>
          <li><strong>Navigation :</strong> adresse IP, logs de connexion (sécurité).</li>
          <li><strong>Activité :</strong> missions, candidatures, évaluations, messages.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Finalités du traitement</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Créer et gérer votre compte.</li>
          <li>Mettre en relation clients et prestataires.</li>
          <li>Assurer la sécurité et la modération.</li>
          <li>Envoyer des notifications liées à vos missions et candidatures.</li>
          <li>Améliorer nos services via des statistiques anonymisées.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Base légale</h2>
        <p>
          Le traitement repose sur l'exécution des Conditions Générales d'Utilisation acceptées à
          l'inscription, et votre consentement pour les communications optionnelles.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Partage des données</h2>
        <p>Vos données ne sont pas vendues. Elles peuvent être partagées avec :</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>D'autres utilisateurs dans le cadre d'une mise en relation (nom, compétences, note).</li>
          <li>Nos prestataires techniques (hébergement, base de données) soumis à confidentialité.</li>
          <li>Les autorités compétentes si obligation légale.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Durée de conservation</h2>
        <p>
          Vos données sont conservées pendant la durée d'activité de votre compte. En cas de suppression,
          elles sont effacées sous 30 jours, sauf obligation légale de conservation.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Vos droits</h2>
        <p>Vous disposez des droits suivants sur vos données :</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Accès</strong> — obtenir une copie de vos données.</li>
          <li><strong>Rectification</strong> — corriger des données inexactes.</li>
          <li><strong>Effacement</strong> — demander la suppression de vos données.</li>
          <li><strong>Portabilité</strong> — récupérer vos données dans un format structuré.</li>
          <li><strong>Opposition</strong> — vous opposer à certains traitements.</li>
        </ul>
        <p className="mt-2">
          Exercez vos droits en écrivant à{' '}
          <a href="mailto:contact@samajob.sn" className="text-primary-600 underline">contact@samajob.sn</a>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Cookies</h2>
        <p>
          SamaJob n'utilise que des cookies techniques nécessaires au fonctionnement (token JWT stocké
          localement). Aucun cookie publicitaire ou de suivi tiers n'est utilisé.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Sécurité</h2>
        <p>
          Nous protégeons vos données par : chiffrement des mots de passe (bcrypt), connexions HTTPS,
          contrôle d'accès strict et journalisation des connexions.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Modifications</h2>
        <p>
          Cette politique peut évoluer. Toute modification substantielle sera notifiée par email
          ou via un avis sur la plateforme.
        </p>
      </section>

    </div>
  </div>
);

export default Confidentialite;
