import { Link } from 'react-router-dom';

const DOMAINE_COLORS = {
  'Développement web':   'bg-blue-100 text-blue-700',
  'Design graphique':    'bg-purple-100 text-purple-700',
  'Rédaction':           'bg-green-100 text-green-700',
  'Marketing digital':   'bg-orange-100 text-orange-700',
  'Traduction':          'bg-teal-100 text-teal-700',
  'Photographie':        'bg-pink-100 text-pink-700',
  'Assistance virtuelle':'bg-indigo-100 text-indigo-700',
  'Saisie de données':   'bg-gray-100 text-gray-700',
};

const STATUT_CONFIG = {
  OUVERTE:    { label: 'Ouverte',    cls: 'badge-green' },
  ATTRIBUEE:  { label: 'Attribuée',  cls: 'badge-blue' },
  TERMINEE:   { label: 'Terminée',   cls: 'badge-gray' },
};

const MissionCard = ({ mission }) => {
  const domaineColor = DOMAINE_COLORS[mission.domaine] || 'bg-gray-100 text-gray-700';
  const statut       = STATUT_CONFIG[mission.statut] || STATUT_CONFIG.OUVERTE;

  const dateFormatted = new Date(mission.dateMission).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link to={`/missions/${mission.id}`} className="block group">
      <div className="card group-hover:border group-hover:border-primary-200 transition-all duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`badge ${domaineColor} text-xs`}>{mission.domaine}</span>
          <span className={`${statut.cls} text-xs`}>{statut.label}</span>
        </div>

        {/* Titre */}
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {mission.titre}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">
          {mission.description}
        </p>

        {/* Infos */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{mission.lieu}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{dateFormatted}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-primary-600">
            {mission.budget.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-500">FCFA</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{mission._count?.candidatures || 0} candidat{(mission._count?.candidatures || 0) > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MissionCard;
