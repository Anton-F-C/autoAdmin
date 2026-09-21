import { CONFIG } from 'src/global-config';
import { OverviewBankingView } from 'src/sections/overview/banking/view';

export const metadata = { title: `Finance | ${CONFIG.appName}` };

export default function Page() {
  return <OverviewBankingView />;
}
