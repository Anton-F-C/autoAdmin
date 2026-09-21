import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Contracts | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Contracts" description="Review contract status, dates, associated users, and signed documents." />;
}
