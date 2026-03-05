/**
 * SamaJob – Script de déploiement automatique
 *
 * Ce script configure automatiquement Render avec les variables
 * d'environnement et déclenche un redéploiement.
 *
 * Usage :
 *   node deploy.js <RENDER_API_KEY>
 *
 * Pour obtenir ta clé API Render :
 *   → https://dashboard.render.com/u/settings → API Keys → Create API Key
 */

const https = require('https');

// ─── Configuration ─────────────────────────────────────────────────────────

const RENDER_API_KEY = process.argv[2];

const CONFIG = {
  serviceName: 'samajob-backend',
  envVars: [
    {
      key: 'DATABASE_URL',
      value: 'postgresql://postgres.xoxbsuxnmogjpjxoxatp:0RznTzqu0s618FYf@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1',
    },
    {
      key: 'DIRECT_URL',
      value: 'postgresql://postgres:0RznTzqu0s618FYf@db.xoxbsuxnmogjpjxoxatp.supabase.co:5432/postgres',
    },
    {
      key: 'JWT_SECRET',
      value: 'samajob_secret_key_super_securisee_2024',
    },
    {
      key: 'JWT_EXPIRES_IN',
      value: '7d',
    },
    {
      key: 'NODE_ENV',
      value: 'production',
    },
    {
      key: 'FRONTEND_URL',
      value: 'https://sama-jobsite.vercel.app',
    },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function apiRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.render.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Étapes ────────────────────────────────────────────────────────────────

async function getServiceId() {
  log('🔍', 'Recherche du service Render...');
  const res = await apiRequest('GET', '/v1/services?limit=20');

  if (res.status !== 200) {
    throw new Error(`Erreur API Render (${res.status}) : vérifiez votre clé API`);
  }

  const services = res.body;
  const service = services.find(s => s.service?.name === CONFIG.serviceName);

  if (!service) {
    throw new Error(`Service "${CONFIG.serviceName}" introuvable sur Render. Vérifiez le nom.`);
  }

  const id = service.service.id;
  log('✅', `Service trouvé : ${CONFIG.serviceName} (id: ${id})`);
  return id;
}

async function setEnvVars(serviceId) {
  log('⚙️ ', 'Configuration des variables d\'environnement...');

  const res = await apiRequest(
    'PUT',
    `/v1/services/${serviceId}/env-vars`,
    CONFIG.envVars
  );

  if (res.status !== 200) {
    throw new Error(`Erreur lors de la mise à jour des variables (${res.status})`);
  }

  log('✅', `${CONFIG.envVars.length} variables configurées`);
  CONFIG.envVars.forEach(v => {
    const display = ['DATABASE_URL', 'DIRECT_URL', 'JWT_SECRET'].includes(v.key)
      ? v.value.slice(0, 30) + '...'
      : v.value;
    console.log(`      ${v.key} = ${display}`);
  });
}

async function triggerDeploy(serviceId) {
  log('🚀', 'Déclenchement du redéploiement...');

  const res = await apiRequest('POST', `/v1/services/${serviceId}/deploys`, {
    clearCache: 'clear',
  });

  if (res.status !== 201) {
    throw new Error(`Erreur lors du déploiement (${res.status})`);
  }

  const deployId = res.body.id;
  log('✅', `Déploiement déclenché (id: ${deployId})`);
  return deployId;
}

async function waitForDeploy(serviceId, deployId) {
  log('⏳', 'Attente du déploiement (peut prendre 2-3 minutes)...');

  const maxAttempts = 40;
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(10000); // 10s entre chaque vérification

    const res = await apiRequest('GET', `/v1/services/${serviceId}/deploys/${deployId}`);
    const status = res.body?.status;

    process.stdout.write(`\r      Statut : ${status} (${(i + 1) * 10}s écoulées)  `);

    if (status === 'live') {
      console.log('');
      return true;
    }
    if (status === 'failed' || status === 'canceled') {
      console.log('');
      throw new Error(`Déploiement ${status}. Vérifiez les logs sur Render.`);
    }
  }

  console.log('');
  log('⚠️ ', 'Timeout : vérifiez manuellement sur Render.');
  return false;
}

async function verifyBackend() {
  log('🔎', 'Vérification du backend...');
  await sleep(5000);

  return new Promise((resolve) => {
    https.get('https://samajob-backend.onrender.com/api/health', (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'ok') {
            log('✅', 'Backend opérationnel : ' + JSON.stringify(json));
            resolve(true);
          } else {
            log('⚠️ ', 'Réponse inattendue : ' + data);
            resolve(false);
          }
        } catch {
          log('⚠️ ', 'Impossible de vérifier : ' + data);
          resolve(false);
        }
      });
    }).on('error', () => {
      log('⚠️ ', 'Backend pas encore joignable (normal si Render démarre encore)');
      resolve(false);
    });
  });
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║    SamaJob – Script de déploiement       ║');
  console.log('╚══════════════════════════════════════════╝\n');

  if (!RENDER_API_KEY) {
    console.error('❌  Clé API Render manquante.\n');
    console.error('Usage : node deploy.js <RENDER_API_KEY>\n');
    console.error('→ Obtenir la clé : https://dashboard.render.com/u/settings → API Keys\n');
    process.exit(1);
  }

  try {
    const serviceId = await getServiceId();
    await setEnvVars(serviceId);
    const deployId = await triggerDeploy(serviceId);
    const success = await waitForDeploy(serviceId, deployId);

    if (success) {
      await verifyBackend();
      console.log('\n╔══════════════════════════════════════════╗');
      console.log('║  ✅  Déploiement réussi !                ║');
      console.log('╠══════════════════════════════════════════╣');
      console.log('║  Backend : samajob-backend.onrender.com  ║');
      console.log('║  Frontend: sama-jobsite.vercel.app       ║');
      console.log('║  Admin   : admin@samajob.sn / Admin1234  ║');
      console.log('╚══════════════════════════════════════════╝\n');
    }
  } catch (err) {
    console.error('\n❌  Erreur :', err.message);
    process.exit(1);
  }
}

main();
