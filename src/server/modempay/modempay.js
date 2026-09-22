import 'server-only';

// ----------------------------------------------------------------------

const MODEMPAY_API_BASE = 'https://api.modempay.com';

function getModemPayEnv() {
  const apiKey = process.env.MODEMPAY_API_KEY;
  const webhookSecret = process.env.MODEMPAY_WEBHOOK_SECRET;

  if (!apiKey) {
    throw new Error('Missing MODEMPAY_API_KEY');
  }

  return {
    apiKey,
    webhookSecret: webhookSecret || null,
  };
}

async function modemPayFetch(path, options = {}) {
  const { apiKey } = getModemPayEnv();

  const response = await fetch(`${MODEMPAY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof body === 'string' ? body : JSON.stringify(body);

    throw new Error(
      `Modem Pay request failed (${response.status}): ${message}`
    );
  }

  return body;
}

// ----------------------------------------------------------------------

export async function getModemPayTransaction(transactionId) {
  if (!transactionId) {
    throw new Error('transactionId is required');
  }

  return modemPayFetch(`/v1/transactions/${transactionId}`);
}

export async function createModemPayTransfer(payload) {
  if (!payload) {
    throw new Error('Transfer payload is required');
  }

  return modemPayFetch('/v1/transfers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function testModemPayConnection() {
  const { apiKey, webhookSecret } = getModemPayEnv();

  return {
    configured: true,
    mode: apiKey.startsWith('sk_test_') ? 'test' : 'live',
    webhookConfigured: Boolean(webhookSecret),
  };
}
