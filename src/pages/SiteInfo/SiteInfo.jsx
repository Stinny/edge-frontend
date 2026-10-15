import { isMobile } from 'react-device-detect';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function SiteInfo() {
  return isMobile ? <Mobile /> : <Desktop />;
}
