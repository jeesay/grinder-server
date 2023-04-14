// Tomo



const tomo_tabs = [
  {
    name: 'tools',
    title: 'Tools',
    icon: 'bi-wrench-adjustable',
    widget: 'navtab',
    default:  true, 
    children: []
  },
  {
    name: 'io',
    icon: 'bi-arrow-down-up',
    title: 'I/O',
    widget: 'navtab',
    children: []
  },
  {
    name: 'settings',
    icon: 'bi-tools',
    title: 'Settings',
    widget: 'navtab',
    children: []
  },
  {
    name: 'running',
    icon: 'bi-send',
    title: 'Running',
    widget: 'navtab',
    children: [
      queue_settings,
      ...submit_settings
    ]
  }
];


