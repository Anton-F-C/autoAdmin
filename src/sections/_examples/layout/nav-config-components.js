import { orderBy, kebabCase } from 'es-toolkit';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const COMPONENT_CATEGORY = {
  FOUNDATION: 'foundation',
  MUI: 'mui',
  EXTRA: 'extra',
};

export const COMPONENT_PACKAGE = {
  FOUNDATION: 'Foundation',
  MUI: 'MUI',
  MUI_X: 'MUI X',
  THIRD_PARTY: '3rd Party',
  CUSTOM: 'Custom',
};

// ----------------------------------------------------------------------

const ICON_BASE_PATH = `${CONFIG.assetsDir}/assets/icons/components`;

const createNavItem = ({ name, packageType, categorySlug }) => {
  const slug = kebabCase(name);
  const iconPrefix = categorySlug === COMPONENT_CATEGORY.EXTRA ? 'ic-extra' : 'ic';

  return {
    name,
    packageType,
    href: `/components/${categorySlug}/${slug}`,
    icon: `${ICON_BASE_PATH}/${iconPrefix}-${slug}.svg`,
  };
};

const createNavItems = (names, options) => names.map((name) => createNavItem({ name, ...options }));

/* **********************************************************************
 * 🧩 Foundation
 * **********************************************************************/
const FOUNDATION_COMPONENTS = ['Colors', 'Typography', 'Shadows', 'Grid', 'Icons'];

const foundationNavItems = createNavItems(FOUNDATION_COMPONENTS, {
  categorySlug: COMPONENT_CATEGORY.FOUNDATION,
  packageType: COMPONENT_PACKAGE.FOUNDATION,
});

/* **********************************************************************
 * 🧩 MUI X
 * **********************************************************************/
const MUI_X_COMPONENTS = ['Data grid', 'Date pickers', 'Tree view'];

const muiXNavItems = createNavItems(MUI_X_COMPONENTS, {
  categorySlug: COMPONENT_CATEGORY.MUI,
  packageType: COMPONENT_PACKAGE.MUI_X,
});

/* **********************************************************************
 * 🧩 MUI Core
 * **********************************************************************/
const MUI_CORE_COMPONENTS = [
  'Chip',
  'List',
  'Menu',
  'Tabs',
  'Alert',
  'Badge',
  'Table',
  'Avatar',
  'Dialog',
  'Rating',
  'Slider',
  'Switch',
  'Drawer',
  'Buttons',
  'Popover',
  'Stepper',
  'Tooltip',
  'Checkbox',
  'Progress',
  'Timeline',
  'Accordion',
  'Text field',
  'Pagination',
  'Breadcrumbs',
  'Autocomplete',
  'Radio button',
  'Transfer list',
];

const muiNavItems = createNavItems(MUI_CORE_COMPONENTS, {
  categorySlug: COMPONENT_CATEGORY.MUI,
  packageType: COMPONENT_PACKAGE.MUI,
});

/* **********************************************************************
 * 🧩 Extra
 * **********************************************************************/
const CUSTOM_COMPONENTS = ['Image', 'Label', 'Layout', 'Mega menu', 'Utilities', 'Navigation bar'];

const THIRD_PARTY_COMPONENTS = [
  'Map',
  'Dnd',
  'Chart',
  'Editor',
  'Upload',
  'Animate',
  'Carousel',
  'Lightbox',
  'Snackbar',
  'Markdown',
  'Walktour',
  'Scrollbar',
  'Form wizard',
  'Multi-language',
  'Form validation',
  'Scroll progress',
  'Organization chart',
];

const extraNavItems = [
  ...createNavItems(THIRD_PARTY_COMPONENTS, {
    categorySlug: COMPONENT_CATEGORY.EXTRA,
    packageType: COMPONENT_PACKAGE.THIRD_PARTY,
  }),
  ...createNavItems(CUSTOM_COMPONENTS, {
    categorySlug: COMPONENT_CATEGORY.EXTRA,
    packageType: COMPONENT_PACKAGE.CUSTOM,
  }),
];

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const allComponents = [
  {
    title: 'Foundation',
    items: foundationNavItems,
  },
  {
    title: 'MUI',
    items: orderBy(muiNavItems, ['name'], ['asc']),
  },
  {
    title: 'MUI X',
    items: orderBy(muiXNavItems, ['name'], ['asc']),
  },
  {
    title: 'Extra',
    items: orderBy(extraNavItems, ['name'], ['asc']),
  },
];
