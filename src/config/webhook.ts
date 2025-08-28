// Configuración del webhook de n8n
const config = {
  // URL base para el webhook de n8n
  n8nWebhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://host.docker.internal:5678',
  // Path para el webhook en modo test
  n8nWebhookTestPath: process.env.NEXT_PUBLIC_N8N_TEST_PATH || '/webhook-test/tarot-reading',
  // Path para el webhook en producción
  n8nWebhookProdPath: process.env.NEXT_PUBLIC_N8N_PROD_PATH || '/webhook/tarot-reading',
  // Modo de prueba activado/desactivado
  isTestMode: process.env.NEXT_PUBLIC_TEST_MODE === 'true'
};

export default config;
