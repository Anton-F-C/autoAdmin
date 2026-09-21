import { CONFIG } from 'src/global-config';
import { AdminProfileView } from 'src/sections/auto-admin/admin-profile-view';

export const metadata = { title: `Profile | ${CONFIG.appName}` };

export default function Page() {
  return <AdminProfileView />;
}
