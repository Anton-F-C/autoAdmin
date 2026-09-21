import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Passenger roster | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Passenger roster" description="Filter passengers by name, tenure, request count, activity, and account status." />;
}
