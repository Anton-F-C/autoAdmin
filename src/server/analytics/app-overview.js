import 'server-only';

import { testModemPayConnection } from 'src/server/modempay/modempay';
import { testAppleConnection } from 'src/server/apple/apple-analytics';
import { getGooglePlayPackageName, testGoogleConnection } from 'src/server/google/google-play';

// ----------------------------------------------------------------------

function safeError(error) {
  return {
    message: error instanceof Error ? error.message : 'Unknown error',
  };
}

// ----------------------------------------------------------------------

export async function getAppOverview() {
  const [appleResult, googleResult, modemPayResult] = await Promise.allSettled([
    testAppleConnection(),
    testGoogleConnection(),
    testModemPayConnection(),
  ]);

  const apple =
    appleResult.status === 'fulfilled'
      ? {
          status: 'connected',
          ...appleResult.value,
        }
      : {
          status: 'error',
          error: safeError(appleResult.reason),
        };

  const google =
    googleResult.status === 'fulfilled'
      ? {
          status: 'connected',
          ...googleResult.value,
        }
      : {
          status: 'error',
          packageName: getGooglePlayPackageName(),
          error: safeError(googleResult.reason),
        };

  const modemPay =
    modemPayResult.status === 'fulfilled'
      ? {
          status: 'connected',
          ...modemPayResult.value,
        }
      : {
          status: 'error',
          error: safeError(modemPayResult.reason),
        };

  return {
    integrations: {
      apple,
      google,
      modemPay,
    },

    appMetrics: {
      activeUsers: {
        total: 0,
        apple: 0,
        google: 0,
        available: false,
      },
      installed: {
        total: 0,
        apple: 0,
        google: 0,
        available: false,
      },
      downloads: {
        total: 0,
        apple: 0,
        google: 0,
        available: false,
      },
    },
  };
}
