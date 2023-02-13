
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
          {
            name: 'ws_ssh',
            title:  'Encrypted',
            widget: 'bool',
            default: 'false',
            help: 'wss protocol'
          },
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
    name: 'history',
    title: 'Job History',
    icon: 'bi-clock-history',
    widget: 'navtab',
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
                name: 'jhistory_actions',
                title:  'Actions',
                widget: 'tcell',
                value: 'Select',
                help: 'Select job.s',
              },
              {
                name: 'jhistory_id',
                title:  'ID',
                value: 'ID',
                widget: 'tcell',
                help: 'Display Job ID',
              },
              {
                name: 'jhistory_program',
                title:  'Program',
                value: 'Program',
                widget: 'tcell',
                help: 'Display Job Program',
              },
              {
                name: 'jhistory_date',
                title:  'Date',
                value: 'Date',
                widget: 'tcell',
                help: 'Display Job Date',
              },
              {
                name: 'jhistory_alias',
                title:  'Job Title',
                value: 'Job Title',
                widget: 'tcell',
                help: 'Display Job Title',
              },
              {
                name: 'jhistory_dir',
                title:  'Job Directory',
                value: 'Job Directory',
                widget: 'tcell',
                help: 'Display Job Directory',
              }
            ]
          },
          {
            name: 'jhistory_body',
            title:  'Table Body',
            widget: 'tbody',
            help: 'Display Job History',
            children: [
              {
                name: 'jhistory_row',
                title:  'Row',
                widget: 'trow',
                help: 'Data',
                children: [
                  {
                    name: 'jhistory_cell',
                    title:  'Cell',
                    widget: 'tcell',
                    value: 'bool',
                    help: 'DataCell',
                  },
                  {
                    name: 'jhistory_cell',
                    title:  'Cell',
                    widget: 'tcell',
                    help: 'DataCell',
                    value: '001'
                  },
                  {
                    name: 'jhistory_cell',
                    title:  'Cell',
                    widget: 'tcell',
                    help: 'DataCell',
                    value: 'baseline:rolling_ball'
                  },
                  {
                    name: 'jhistory_cell',
                    title:  'Cell',
                    widget: 'tcell',
                    help: 'DataCell',
                    value: 'lun. 30 janv. 2023 15:54:32 CET'
                  },
                  {
                    name: 'jhistory_cell',
                    title:  'Cell',
                    widget: 'tcell',
                    help: 'DataCell',
                    value: 'job005/baseline'
                  },
                  {
                    name: 'jhistory_cell',
                    title:  'Cell',
                    widget: 'tcell',
                    help: 'DataCell',
                    value: 'job005/baseline'
                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  },
/*
  {
    name: 'action',
    title: 'Job Actions',
    icon: 'bi-pencil',
    widget: 'navtab',
    children: [
      {
        name: 'single',
        title:  'Single Selection',
        widget: 'fieldset',
        help: 'View, Delete, Abort selected job',
        children: [
          {
            name: 'display',
            title:  'View',
            icon: 'bi-eye',
            widget: 'radio',
            group:'jsaction',
            help: 'Display Parameters and Results'
          },
          {
            name: 'copy',
            title:  'Copy',
            icon: 'bi-clipboard-plus',
            widget: 'radio',
            group:'jsaction',
            help: 'Create a new Job from Selected Job'
          } ,
          {
            name: 'delete',
            title:  'Delete',
            icon: 'bi-trash',
            widget: 'radio',
            group:'jsaction',
            help: 'Move Job in Trash'
          } ,
          {
            name: 'abort',
            title:  'Abort',
            icon: 'bi-x-square',
            widget: 'radio',
            group:'jsaction',
            help: 'Abort running Job'
          } 
        ]
      },
      {
        name: 'multi',
        title:  'Multiple Selections',
        widget: 'fieldset',
        help: 'Delete selected jobs',
        children: [
          {
            name: 'delete',
            title:  'Delete All jobs selected',
            icon: 'bi-trash',
            widget: 'radio',
            group:'jmaction',
            help: 'Move Job in Trash'
          }
        ]
      },  
    ]
  },
*/
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
  motioncor: motioncor_tabs,
  ctf: ctf_tabs,
  picking: picking_tabs,
  extract: extract_tabs,
  class2d: class2d_tabs,
  abinitio: abinitio_tabs,
  tools: tools_tabs,
  debug: debug_tabs
};




