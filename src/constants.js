const ARIA_ROLES = {
  alert: {
    namefrom: ['author'],
    parent: ['region'],
  },
  alertdialog: {
    namefrom: ['author'],
    namerequired: true,
    parent: ['alert', 'dialog'],
  },
  application: {
    namefrom: ['author'],
    namerequired: true,
    parent: ['landmark'],
  },
  article: {
    namefrom: ['author'],
    parent: ['document', 'region'],
  },
  banner: {
    namefrom: ['author'],
    parent: ['landmark'],
  },
  button: {
    childpresentational: true,
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['command'],
    properties: ['aria-expanded', 'aria-pressed'],
  },
  checkbox: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['input'],
    requiredProperties: ['aria-checked'],
    properties: ['aria-checked'],
  },
  columnheader: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['gridcell', 'sectionhead', 'widget'],
    properties: ['aria-sort'],
    scope: ['row'],
  },
  combobox: {
    mustcontain: ['listbox', 'textbox'],
    namefrom: ['author'],
    namerequired: true,
    parent: ['select'],
    requiredProperties: ['aria-expanded'],
    properties: ['aria-expanded', 'aria-autocomplete', 'aria-required'],
  },
  command: {
    abstract: true,
    namefrom: ['author'],
    parent: ['widget'],
  },
  complementary: {
    namefrom: ['author'],
    parent: ['landmark'],
  },
  composite: {
    abstract: true,
    childpresentational: false,
    namefrom: ['author'],
    parent: ['widget'],
    properties: ['aria-activedescendant'],
  },
  contentinfo: {
    namefrom: ['author'],
    parent: ['landmark'],
  },
  definition: {
    namefrom: ['author'],
    parent: ['section'],
  },
  dialog: {
    namefrom: ['author'],
    namerequired: true,
    parent: ['window'],
  },
  directory: {
    namefrom: ['contents', 'author'],
    parent: ['list'],
  },
  document: {
    namefrom: [' author'],
    namerequired: true,
    parent: ['structure'],
    properties: ['aria-expanded'],
  },
  form: {
    namefrom: ['author'],
    parent: ['landmark'],
  },
  grid: {
    mustcontain: ['row', 'rowgroup'],
    namefrom: ['author'],
    namerequired: true,
    parent: ['composite', 'region'],
    properties: ['aria-level', 'aria-multiselectable', 'aria-readonly'],
  },
  gridcell: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['section', 'widget'],
    properties: ['aria-readonly', 'aria-required', 'aria-selected'],
    scope: ['row'],
  },
  group: {
    namefrom: [' author'],
    parent: ['section'],
    properties: ['aria-activedescendant'],
  },
  heading: {
    namerequired: true,
    parent: ['sectionhead'],
    properties: ['aria-level'],
  },
  img: {
    childpresentational: true,
    namefrom: ['author'],
    namerequired: true,
    parent: ['section'],
  },
  input: {
    abstract: true,
    namefrom: ['author'],
    parent: ['widget'],
  },
  landmark: {
    abstract: true,
    namefrom: ['contents', 'author'],
    namerequired: false,
    parent: ['region'],
  },
  link: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['command'],
    properties: ['aria-expanded'],
  },
  list: {
    mustcontain: ['group', 'listitem'],
    namefrom: ['author'],
    parent: ['region'],
  },
  listbox: {
    mustcontain: ['option'],
    namefrom: ['author'],
    namerequired: true,
    parent: ['list', 'select'],
    properties: ['aria-multiselectable', 'aria-required'],
  },
  listitem: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['section'],
    properties: ['aria-level', 'aria-posinset', 'aria-setsize'],
    scope: ['list'],
  },
  log: {
    namefrom: [' author'],
    namerequired: true,
    parent: ['region'],
  },
  main: {
    namefrom: ['author'],
    parent: ['landmark'],
  },
  marquee: {
    namerequired: true,
    parent: ['section'],
  },
  math: {
    childpresentational: true,
    namefrom: ['author'],
    parent: ['section'],
  },
  menu: {
    mustcontain: [
      'group',
      'menuitemradio',
      'menuitem',
      'menuitemcheckbox',
    ],
    namefrom: ['author'],
    namerequired: true,
    parent: ['list', 'select'],
  },
  menubar: {
    namefrom: ['author'],
    parent: ['menu'],
  },
  menuitem: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['command'],
    scope: ['menu', 'menubar'],
  },
  menuitemcheckbox: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['checkbox', 'menuitem'],
    scope: ['menu', 'menubar'],
  },
  menuitemradio: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['menuitemcheckbox', 'radio'],
    scope: ['menu', 'menubar'],
  },
  navigation: {
    namefrom: ['author'],
    parent: ['landmark'],
  },
  note: {
    namefrom: ['author'],
    parent: ['section'],
  },
  option: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['input'],
    properties: [
      'aria-checked',
      'aria-posinset',
      'aria-selected',
      'aria-setsize',
    ],
  },
  presentation: {
    parent: ['structure'],
  },
  progressbar: {
    childpresentational: true,
    namefrom: ['author'],
    namerequired: true,
    parent: ['range'],
  },
  radio: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['checkbox', 'option'],
  },
  radiogroup: {
    mustcontain: ['radio'],
    namefrom: ['author'],
    namerequired: true,
    parent: ['select'],
    properties: ['aria-required'],
  },
  range: {
    abstract: true,
    namefrom: ['author'],
    parent: ['widget'],
    properties: [
      'aria-valuemax',
      'aria-valuemin',
      'aria-valuenow',
      'aria-valuetext',
    ],
  },
  region: {
    namefrom: [' author'],
    parent: ['section'],
  },
  roletype: {
    abstract: true,
    properties: [
      'aria-atomic',
      'aria-busy',
      'aria-controls',
      'aria-describedby',
      'aria-disabled',
      'aria-dropeffect',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-owns',
      'aria-relevant',
    ],
  },
  row: {
    mustcontain: ['columnheader', 'gridcell', 'rowheader'],
    namefrom: ['contents', 'author'],
    parent: ['group', 'widget'],
    properties: ['aria-level', 'aria-selected'],
    scope: ['grid', 'rowgroup', 'treegrid'],
  },
  rowgroup: {
    mustcontain: ['row'],
    namefrom: ['contents', 'author'],
    parent: ['group'],
    scope: ['grid'],
  },
  rowheader: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['gridcell', 'sectionhead', 'widget'],
    properties: ['aria-sort'],
    scope: ['row'],
  },
  search: {
    namefrom: ['author'],
    parent: ['landmark'],
  },
  section: {
    abstract: true,
    namefrom: ['contents', 'author'],
    parent: ['structure'],
    properties: ['aria-expanded'],
  },
  sectionhead: {
    abstract: true,
    namefrom: ['contents', 'author'],
    parent: ['structure'],
    properties: ['aria-expanded'],
  },
  select: {
    abstract: true,
    namefrom: ['author'],
    parent: ['composite', 'group', 'input'],
  },
  separator: {
    childpresentational: true,
    namefrom: ['author'],
    parent: ['structure'],
    properties: ['aria-expanded', 'aria-orientation'],
  },
  scrollbar: {
    childpresentational: true,
    namefrom: ['author'],
    namerequired: false,
    parent: ['input', 'range'],
    requiredProperties: [
      'aria-controls',
      'aria-orientation',
      'aria-valuemax',
      'aria-valuemin',
      'aria-valuenow',
    ],
    properties: [
      'aria-controls',
      'aria-orientation',
      'aria-valuemax',
      'aria-valuemin',
      'aria-valuenow',
    ],
  },
  slider: {
    childpresentational: true,
    namefrom: ['author'],
    namerequired: true,
    parent: ['input', 'range'],
    requiredProperties: ['aria-valuemax', 'aria-valuemin', 'aria-valuenow'],
    properties: [
      'aria-valuemax',
      'aria-valuemin',
      'aria-valuenow',
      'aria-orientation',
    ],
  },
  spinbutton: {
    namefrom: ['author'],
    namerequired: true,
    parent: ['input', 'range'],
    requiredProperties: ['aria-valuemax', 'aria-valuemin', 'aria-valuenow'],
    properties: [
      'aria-valuemax',
      'aria-valuemin',
      'aria-valuenow',
      'aria-required',
    ],
  },
  status: {
    parent: ['region'],
  },
  structure: {
    abstract: true,
    parent: ['roletype'],
  },
  tab: {
    namefrom: ['contents', 'author'],
    parent: ['sectionhead', 'widget'],
    properties: ['aria-selected'],
    scope: ['tablist'],
  },
  tablist: {
    mustcontain: ['tab'],
    namefrom: ['author'],
    parent: ['composite', 'directory'],
    properties: ['aria-level'],
  },
  tabpanel: {
    namefrom: ['author'],
    namerequired: true,
    parent: ['region'],
  },
  textbox: {
    namefrom: ['author'],
    namerequired: true,
    parent: ['input'],
    properties: [
      'aria-activedescendant',
      'aria-autocomplete',
      'aria-multiline',
      'aria-readonly',
      'aria-required',
    ],
  },
  timer: {
    namefrom: ['author'],
    namerequired: true,
    parent: ['status'],
  },
  toolbar: {
    namefrom: ['author'],
    parent: ['group'],
  },
  tooltip: {
    namerequired: true,
    parent: ['section'],
  },
  tree: {
    mustcontain: ['group', 'treeitem'],
    namefrom: ['author'],
    namerequired: true,
    parent: ['select'],
    properties: ['aria-multiselectable', 'aria-required'],
  },
  treegrid: {
    mustcontain: ['row'],
    namefrom: ['author'],
    namerequired: true,
    parent: ['grid', 'tree'],
  },
  treeitem: {
    namefrom: ['contents', 'author'],
    namerequired: true,
    parent: ['listitem', 'option'],
    scope: ['group', 'tree'],
  },
  widget: {
    abstract: true,
    parent: ['roletype'],
  },
  window: {
    abstract: true,
    namefrom: [' author'],
    parent: ['roletype'],
    properties: ['aria-expanded'],
  },
};

export default {
  ARIA_ROLES,
};
