
const generic_run_menu = (tool) => [
  {
    name: 'run_command',
    title: 'Running',
    widget: 'fieldset',
    children: [
      {
        name: 'alias',
        title: 'Job Title/Alias',
        widget: 'text',
        default: '',
        help: `Job Title for sake of convenience`
      },
      {
        name: 'in_workflow',
        title: 'Add in Workflow',
        widget: 'bool',
        default: false,
        help: `If True, the command is not executed immediately, but add in a queue for a further run in the section 'Workflow'.`
      },
      {
        name: 'submit',
        title: 'Run Command',
        widget: 'button',
        help: `Submit command`,
        on_click: (ev) => submit_command(tool)(ev)
      }
    ]
  },
  {
    name: 'command',
    title: 'Command Line',
    widget: 'details',
    status: 'hidden',
    children:[]
  },
  {
    name: 'log',
    title: 'Log',
    widget: 'fieldset',
    status: 'hidden',
    children:[]
  },
  {
    name: 'error',
    title: 'Errors',
    status: 'hidden',
    widget: 'fieldset',
    children:[]
  }
];



const no_settings = {
  name: 'no_settings',
  title: 'No Settings',
  widget: 'navtab',
  help: 'No Settings to setup',
  children: [
    {
      name: 'cycles',
      title: 'No Parameter',
      widget: 'label',
      help: `Number of Iterations`
    }
  ]
}

const no_running = {
  name: 'running',
  title: 'Run',
  widget: 'navtab',
  children: []
}


const sleep_settings = {
  name: 'sleep',
  title: 'Savitzky-Golay Filter',
  widget: 'navtab',
  option: '--sleep',
  help: 'Sleep Test',
  children: [
    {
      name: 'cycles',
      title: 'Iterations Number',
      option: '-i',
      widget: 'int',
      default: 10,
      help: `Number of Iterations`
    },
    {
      name: 'sleep_ms',
      title: 'Sleep Duration (ms)',
      option: '-ms',
      widget: 'int',
      default: 1000,
      help: `Sleep Duration in milliseconds`
    },
    {
      name: 'crash',
      title: 'Random Crash',
      option: '--crash',
      widget: 'bool',
      help: `Randomly crashed to test Error management`
    }
  ]
}

const sleep_running = {
  name: 'running',
  title: 'Run',
  widget: 'navtab',
  children: generic_run_menu('gk_debug')
}


