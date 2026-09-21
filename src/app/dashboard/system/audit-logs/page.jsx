import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Audit logs | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Audit logs" description="Review sensitive administrative actions and security events." />;
}
