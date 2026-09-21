import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Users & roles | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Users & roles" description="Owner-only access management for Owner, Administrator, and Moderator accounts." />;
}
