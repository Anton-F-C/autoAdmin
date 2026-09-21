import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Refunds | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Refunds" description="Review service requests marked for refund and track refund processing status." />;
}
