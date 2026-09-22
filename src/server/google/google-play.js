import 'server-only';

import { Storage } from '@google-cloud/storage';

// ----------------------------------------------------------------------

function getGooglePlayEnv() {
  const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME;
  const reportBucket = process.env.GOOGLE_PLAY_REPORT_BUCKET;

  if (!rawCredentials) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON');
  }

  if (!packageName) {
    throw new Error('Missing GOOGLE_PLAY_PACKAGE_NAME');
  }

  let credentials;

  try {
    credentials = JSON.parse(rawCredentials);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
  }

  return {
    credentials,
    packageName,
    reportBucket: reportBucket || null,
  };
}

function createGoogleStorageClient() {
  const { credentials } = getGooglePlayEnv();

  return new Storage({
    projectId: credentials.project_id,
    credentials,
  });
}

// ----------------------------------------------------------------------

export function getGooglePlayPackageName() {
  const { packageName } = getGooglePlayEnv();

  return packageName;
}

export async function testGoogleConnection() {
  const { credentials, packageName, reportBucket } = getGooglePlayEnv();

  const result = {
    connected: true,
    serviceAccount: credentials.client_email ?? null,
    projectId: credentials.project_id ?? null,
    packageName,
    reportBucket,
    bucketAccessible: false,
  };

  // Google has not generated your bulk-report bucket yet,
  // so a missing bucket is expected for now.
  if (!reportBucket) {
    return result;
  }

  const storage = createGoogleStorageClient();
  const bucket = storage.bucket(reportBucket);

  await bucket.getFiles({
    maxResults: 1,
    autoPaginate: false,
  });

  return {
    ...result,
    bucketAccessible: true,
  };
}

// ----------------------------------------------------------------------

export async function listGooglePlayReportFiles({ prefix = '', maxResults = 100 } = {}) {
  const { reportBucket } = getGooglePlayEnv();

  if (!reportBucket) {
    return [];
  }

  const storage = createGoogleStorageClient();
  const bucket = storage.bucket(reportBucket);

  const [files] = await bucket.getFiles({
    prefix,
    maxResults,
    autoPaginate: false,
  });

  return files.map((file) => ({
    name: file.name,
    size: Number(file.metadata?.size ?? 0),
    updated: file.metadata?.updated ?? null,
  }));
}
