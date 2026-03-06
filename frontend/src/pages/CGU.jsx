const CGU = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-primary-600 mb-2">Conditions Générales d'Utilisation</h1>
    <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : mars 2026</p>

    <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
          de la plateforme SamaJob, service de mise en relation entre clients (donneurs d'ordre) et
          prestataires de services au Sénégal.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Inscription et compte</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>L'inscription est gratuite et ouverte à toute personne physique majeure ou morale.</li>
          <li>Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité sous votre compte.</li>
          <li>Les prestataires doivent faire valider leur profil par l'administrateur avant de pouvoir postuler.</li>
          <li>SamaJob se réserve le droit de suspendre ou supprimer tout compte en infraction.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Rôles et responsabilités</h2>
        <p><strong>Clients :</strong> publient des missions, sélectionnent des prestataires et valident la fin des missions.</p>
        <p className="mt-1"><strong>Prestataires :</strong> postulent aux missions, réalisent les prestations et peuvent être évalués.</p>
        <p className="mt-1">
          SamaJob est un intermédiaire et n'est pas partie au contrat entre le client et le prestataire.
          La relation contractuelle est établie directement entre eux.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Contenu des utilisateurs</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Vous êtes responsable du contenu que vous publiez (missions, candidatures, messages, documents).</li>
          <li>Tout contenu illicite, trompeur, offensant ou contraire aux bonnes mœurs est interdit.</li>
          <li>SamaJob se réserve le droit de modérer ou supprimer tout contenu inapproprié.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Dépôt de dossiers et documents</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Les prestataires peuvent déposer des documents (CV, portfolio, diplômes) pour enrichir leur profil.</li>
          <li>Les documents doivent être authentiques et vous appartenir ou être libres de droits.</li>
          <li>SamaJob ne vérifie pas l'authenticité des documents mais se réserve le droit de les supprimer s'ils sont signalés.</li>
          <li>Les fichiers acceptés sont : PDF, JPG, PNG, DOCX (taille maximale : 5 Mo par fichier).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Évaluations et avis</h2>
        <p>
          Les évaluations doivent être honnêtes et basées sur une expérience réelle. Tout abus
          (faux avis, manipulation de notes) entraîne la suspension du compte.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Disponibilité du service</h2>
        <p>
          SamaJob s'efforce d'assurer la disponibilité de la plateforme mais ne garantit pas
          un accès ininterrompu. Des maintenances peuvent être réalisées sans préavis.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Modification des CGU</h2>
        <p>
          SamaJob peut modifier les présentes CGU à tout moment. Les utilisateurs seront informés
          des changements importants par email. L'utilisation continue de la plateforme vaut acceptation.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Droit applicable</h2>
        <p>
          Les présentes CGU sont soumises au droit sénégalais. En cas de litige, les parties
          s'engagent à rechercher une solution amiable avant tout recours judiciaire.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Contact</h2>
        <p>
          Pour toute question relative aux CGU :{' '}
          <a href="mailto:contact@samajob.sn" className="text-primary-600 underline">contact@samajob.sn</a>.
        </p>
      </section>

    </div>
  </div>
);

export default CGU;
