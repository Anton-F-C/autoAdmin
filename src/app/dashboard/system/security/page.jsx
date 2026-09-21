import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Security | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Security" description="Owner-only security configuration and access-control status." />;
}
