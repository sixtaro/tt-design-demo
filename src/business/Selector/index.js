import SelectorOld from './selector';
import SelectorV2 from './selectorV2';
import { Storage } from '@/utils';

const SystemConfig = Storage.get('SystemConfig', ['public', 'desktop'].includes(window.projectName) ? undefined : window.projectName);
const Selector = String(SystemConfig?.Selector?.version) === '1' ? SelectorOld : SelectorV2;

export default Selector;
