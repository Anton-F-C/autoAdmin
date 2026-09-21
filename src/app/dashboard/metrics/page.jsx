import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Metrics | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Metrics" description="Platform and business performance across passengers, mechanics, requests, finance, and app activity." />;
}
