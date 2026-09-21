import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Mechanic earnings | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Mechanic earnings" description="Track gross earnings, eligible balances, adjustments, and paid totals for each mechanic." />;
}
