import { isMobile } from 'react-device-detect';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function Sites() {
  return isMobile ? <Mobile /> : <Desktop />;
}
