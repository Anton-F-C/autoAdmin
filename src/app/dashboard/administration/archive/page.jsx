import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Archive | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Archive" description="Access retired services and other archived operational records without breaking historical references." />;
}
