import { CONFIG } from 'src/global-config';
import { ChatView } from 'src/sections/chat/view';

export const metadata = { title: `Team chat | ${CONFIG.appName}` };

export default function Page() {
  return <ChatView />;
}
