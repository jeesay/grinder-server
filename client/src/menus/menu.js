
'use strict';

const home_tabs = [
  {
    name: 'home',
    title: 'Home',
    icon: 'bi-house-door',
    widget: 'navtab',
    children: [
      {
        name: 'ws_config',
        title: 'Server Connection',
        widget: 'fieldset',
        children: [
/*
          {
            name: 'ws_ssh',
            title:  'Encrypted',
            widget: 'bool',
            default: 'false',
            help: 'wss protocol'
          },
*/
          {
            name: 'ws_server_ip',
            title:  'Server IP Address',
            widget: 'text',
            default: '127.0.0.1',
            help: 'Server IP address'
          },
          {
            name: 'ws_port',
            title:  'Server port',
            widget: 'int',
            default: '8001',
            help: 'Server port. Usually for Gimmick, 8001'
          },
          {
            name: 'ws_connect',
            title:  'Connect',
            widget: 'button',
            help: 'Connect to the Server',
            on_click: (ev) => connect_to_ws_server(),
          },
        ]
      }
    ]
  },
  {
    name: 'config',
    title: 'Configuration',
    icon: 'bi-gear',
    widget: 'navtab',
    children: [
      {
        name: 'software',
        title:  'Softwares',
        widget: 'table',
        help: 'Display Softwares found',
        children: [
          {
            name: 'software_head',
            title:  'Table Header',
            widget: 'thead',
            help: 'Display',
            children: [
              {
                name: 'software_name',
                title:  'Name',
                value: 'Name',
                widget: 'tcell',
                help: 'Display Software name',
              },
              {
                name: 'software_status',
                title:  'Status',
                value: 'Status',
                widget: 'tcell',
                help: 'Display Software status',
              },
              {
                name: 'software_path',
                title: 'Path',
                value: 'Path',
                widget: 'tcell',
                help: 'Display Software path',
              },
            ]
          },
          /*
            Relion
            UCSF motioncor2, CTFFIND 4.xx, gctf, topaz, localres, python, numpy, pytorch, etc.
          */
          {
            name: 'software_body',
            title:  'Table Body',
            widget: 'tbody',
            help: 'Display Software found',
            children: [
            ]
          }
        ]
      },
    ]
  },
  {
    name: 'history',
    title: 'Job History',
    icon: 'bi-clock-history',
    widget: 'navtab',
    on_click: create_history,
    children: [
      {
        name: 'jhistory',
        title:  'Job History',
        widget: 'table',
        help: 'Display Job History',
        children: [
          {
            name: 'jhistory_head',
            title:  'Table Header',
            widget: 'thead',
            help: 'Display Job History',
            children: [
              {
                name: 'jhistory_id',
                title:  'ID',
                value: 'ID',
                widget: 'tcell',
                help: 'Display Job ID',
              },
              {
                name: 'jhistory_actions',
                title:  'Actions',
                widget: 'tcell',
                value: 'Actions',
                help: 'Select job.s',
              },
              {
                name: 'jhistory_dir',
                title:  'Job Directory',
                value: 'Job Directory',
                widget: 'tcell',
                help: 'Display Job Directory',
              },
              {
                name: 'jhistory_alias',
                title:  'Job Title',
                value: 'Job Alias',
                widget: 'tcell',
                help: 'Display Job Title',
              },
              {
                name: 'jhistory_date',
                title:  'Date',
                value: 'Date',
                widget: 'tcell',
                help: 'Display Job Date',
              },
              {
                name: 'jhistory_program',
                title:  'Program',
                value: 'Program',
                widget: 'tcell',
                help: 'Display Job Program',
              },
            ]
          },
          {
            name: 'jhistory_body',
            title:  'Table Body',
            widget: 'tbody',
            help: 'Display Job History',
            children: []
          }
        ]
      }
    ]
  },
  {
    name: 'workflow',
    title: 'Workflow',
    icon: 'bi-calendar3',
    widget: 'navtab',
    children: []
  },
];

const debug_tabs = [
  {
    name: 'methods',
    title: 'Methods',
    icon: 'bi-card-checklist',
    widget: 'navtab',
    children: [
      {
        name: 'dimreduce',
        title: 'Communication Tests',
        widget: 'fieldset',
        children: [
          {
            name: 'no_test',
            title:  'None',
            widget: 'radio',
            option: '--notest',
            default: true,
            group:'testcom',
            help: 'No Test'
          },
          {
            name: 'sleep',
            title:  'Sleep',
            widget: 'radio',
            option: '--sleep',
            group:'testcom',
            help: 'Test communication between client and server',
            on_click: (ev) => w_navtab_update({settings: sleep_settings,running: sleep_running})
          }
        ]
      },
    ]
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: 'bi-tools',
    widget: 'navtab'
  },
  {
    name: 'running',
    title: 'Run',
    icon: 'bi-cursor',
    widget: 'navtab'
  },
  {
    name: 'result',
    title: 'Result',
    status: 'inactive',
    icon: 'bi-eye',
    widget: 'navtab'
  },
];


const menus = {
  home: home_tabs,
  import: import_tabs,
  motioncorr: motioncor_tabs,
  enhance: enhance_tabs,
  ctf: ctf_tabs,
  picking: picking_tabs,
  extract: extract_tabs,
  class2d: class2d_tabs,
  rec3d: rec3d_tabs,
  postprocess: postprocess_tabs,
  tools: tools_tabs,
  helix: helix_tabs,
  tomo: tomo_tabs,
  metrics: metrics_tabs,
  debug: debug_tabs
};

const actions = {
  home: home_tabs,
  import: import_tabs,
  motioncorr: motioncor_tabs,
  ctffind: ctf_tabs,
  manualpick: picking_tabs,
  extract: extract_tabs,
  select: tools_tabs,
  class2d: class2d_tabs,
  autopick: picking_tabs,
  rec3d: rec3d_tabs,
  maskcreate: tools_tabs,
  postprocess: postprocess_tabs,
  polish: postprocess_tabs,
  joinstar: tools_tabs,
  ctfrefine: ctf_tabs,
}



