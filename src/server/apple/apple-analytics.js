import 'server-only';

import { SignJWT, importPKCS8 } from 'jose';

// ----------------------------------------------------------------------

const APPLE_API_BASE = 'https://api.appstoreconnect.apple.com';

function getAppleEnv() {
  const issuerId = process.env.APPLE_ISSUER_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const rawPrivateKey = process.env.APPLE_PRIVATE_KEY;

  if (!issuerId) {
    throw new Error('Missing APPLE_ISSUER_ID');
  }

  if (!keyId) {
    throw new Error('Missing APPLE_KEY_ID');
  }

  if (!rawPrivateKey) {
    throw new Error('Missing APPLE_PRIVATE_KEY');
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

  return {
    issuerId,
    keyId,
    privateKey,
  };
}

async function createAppleToken() {
  const { issuerId, keyId, privateKey } = getAppleEnv();

  const key = await importPKCS8(privateKey, 'ES256');

  return new SignJWT({})
    .setProtectedHeader({
      alg: 'ES256',
      kid: keyId,
      typ: 'JWT',
    })
    .setIssuer(issuerId)
    .setAudience('appstoreconnect-v1')
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(key);
}

async function appleFetch(path, options = {}) {
  const token = await createAppleToken();

  const response = await fetch(`${APPLE_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(`Apple App Store Connect request failed (${response.status}): ${body}`);
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function getAppleApps() {
  return appleFetch('/v1/apps?limit=200');
}

export async function testAppleConnection() {
  const result = await getAppleApps();

  return {
    connected: true,
    apps:
      result.data?.map((app) => ({
        id: app.id,
        name: app.attributes?.name ?? null,
        bundleId: app.attributes?.bundleId ?? null,
        sku: app.attributes?.sku ?? null,
      })) ?? [],
  };
}
