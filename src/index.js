import Button from './components/Button';
import * as versionUtils from './utils/version';
import { libraryVersion } from './utils/version-config';

export {
  Button,
  versionUtils
};

const components = {
  Button
};

components.version = libraryVersion;
components.versionUtils = versionUtils;

export default components;
