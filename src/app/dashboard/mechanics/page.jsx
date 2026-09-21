import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Mechanics overview | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Mechanics overview" description="Snapshot of mechanic availability, ratings, activity, specialties, and platform growth." />;
}
