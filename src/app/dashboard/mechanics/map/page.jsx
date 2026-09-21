import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Live mechanic map | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Live mechanic map" description="Real-time map for mechanics who have marked themselves available." />;
}
