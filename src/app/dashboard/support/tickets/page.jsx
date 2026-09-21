import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Tickets | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Tickets" description="Read and review passenger and mechanic support tickets." />;
}
