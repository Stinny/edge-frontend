import { isMobile } from 'react-device-detect';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function Favorites() {
  return isMobile ? <Mobile /> : <Desktop />;
}
