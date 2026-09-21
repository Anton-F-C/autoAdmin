import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Service request history | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Service request history" description="Search and filter requests by passenger, mechanic, price, rating, status, payment, and refund state." />;
}
