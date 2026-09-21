import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Mechanic roster | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Mechanic roster" description="Filter mechanics by name, rating, specialty, availability, and time on the platform." />;
}
