import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Service requests overview | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Service requests overview" description="Snapshot of request volume, status, popular services, and completion performance." />;
}
