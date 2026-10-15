import { isMobile } from 'react-device-detect';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function DashboardSettings() {
  return isMobile ? <Mobile /> : <Desktop />;
}
