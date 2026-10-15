import { isMobile } from 'react-device-detect';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default function Login() {
  return isMobile ? <Mobile /> : <Desktop />;
}
