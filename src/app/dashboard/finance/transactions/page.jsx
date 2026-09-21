import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Transactions | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Transactions" description="ModemPay transaction history enriched with service-request, passenger, and mechanic context." />;
}
