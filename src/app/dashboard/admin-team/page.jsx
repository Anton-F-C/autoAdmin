import { CONFIG } from 'src/global-config';
import { AdminTeamView } from 'src/sections/auto-admin/admin-team-view';

export const metadata = { title: `Admin team | ${CONFIG.appName}` };

export default function Page() {
  return <AdminTeamView />;
}
