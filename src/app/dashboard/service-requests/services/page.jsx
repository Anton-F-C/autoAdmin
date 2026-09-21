import { CONFIG } from 'src/global-config';
import { AutoAdminPlaceholderView } from 'src/sections/auto-admin';

export const metadata = { title: `Services | ${CONFIG.appName}` };

export default function Page() {
  return <AutoAdminPlaceholderView title="Services" description="Manage the active service catalog. Retired services will be archived rather than hard-deleted." />;
}
