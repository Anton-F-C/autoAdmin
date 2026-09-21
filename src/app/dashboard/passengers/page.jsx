import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Passengers overview | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Passengers overview" description="Passenger growth, activity, retention, and service-request usage." />;
}
