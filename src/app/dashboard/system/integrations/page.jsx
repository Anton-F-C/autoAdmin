import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Integrations | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Integrations" description="Owner-only health and configuration controls for Supabase, ModemPay, App Store Connect, and Google Play." />;
}
