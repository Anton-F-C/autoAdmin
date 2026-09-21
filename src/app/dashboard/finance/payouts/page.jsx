import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Payouts | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Payouts" description="Review eligible mechanic balances and trigger controlled ModemPay payouts." />;
}
