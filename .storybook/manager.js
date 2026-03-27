import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'tt-design',
    brandUrl: 'http://localhost:3000',
    brandTarget: '_self',
    brandImage: undefined,
  }),
});
