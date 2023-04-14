
const pick_helices = {
  children: [
    {
      name: 'helical_tube_outer_diameter',
      title: 'Tube diameter (A): ',
      widget: 'range',
      default:200, 
      range_min: 100, 
      range_max: 1000, 
      range_step: 10,
      help: 'Outer diameter (in Angstroms) of helical tubes. \
This value should be slightly larger than the actual width of the tubes.',
    },
    {
      name: 'helical_nr_asu',
      title: 'Number of unique asymmetrical units:',
      widget: 'range',
      default: 1, 
      range_min: 1, 
      range_max: 100, 
      range_step: 1,
      help: 'Number of unique helical asymmetrical units in each segment box. This integer should not be less than 1. The inter-box distance (pixels) = helical rise (Angstroms) * number of asymmetrical units / pixel size (Angstroms). \
The optimal inter-box distance might also depend on the box size, the helical rise and the flexibility of the structure. In general, an inter-box distance of ~10% * the box size seems appropriate.',
    },
    {
      name: 'helical_rise',
      title: 'Helical rise (A):',
      widget: 'range',
      default:-1, 
      range_min: 0, 
      range_max: 100, 
      range_step: 0.01,
      help: `Helical rise in Angstroms. (Please click '?' next to the option above for details about how the inter-box distance is calculated.)`,
    },
    {
      name: 'helical_tube_kappa_max',
      title: 'Maximum curvature (kappa): ',
      widget: 'range',
      default:0.1, 
      range_min: 0.05, 
      range_max: 0.5, 
      range_step: 0.01,
      help: `Maximum curvature allowed for picking helical tubes.
Kappa = 0.3 means that the curvature of the picked helical tubes should not be larger than 30% the curvature of a circle (diameter = particle mask diameter). \
Kappa ~ 0.05 is recommended for long and straight tubes (e.g. TMV, VipA/VipB and AChR tubes) while 0.20 ~ 0.40 seems suitable for flexible ones (e.g. ParM and MAVS-CARD filaments).`,
    },
    {
      name: 'helical_tube_length_min',
      title: 'Minimum length (A): ',
      widget: 'range',
      default:-1, 
      range_min: 100, 
      range_max: 1000, 
      range_step: 10,
      help: 'Minimum length (in Angstroms) of helical tubes for auto-picking. \
Helical tubes with shorter lengths will not be picked. Note that a long helical tube seen by human eye might be treated as short broken pieces due to low FOM values or high picking threshold.',
    },
  ]
}

const class2d_helix_tabs = {
  widget: 'navtab',
  children: [
    {
      name: 'helical_tube_outer_diameter',
      title: 'Tube diameter (A):',
      widget: 'range',
      default:  200, 
      range_min: 100, 
      range_max: 1000, 
      range_step: 10, 
      help: `Outer diameter (in Angstroms) of helical tubes.
  This value should be slightly larger than the actual width of the tubes. You may want to copy the value from previous particle extraction job.
  If negative value is provided, this option is disabled and ordinary circular masks will be applied. Sometimes '--dont_check_norm' option is useful to prevent errors in normalisation of helical segments.`
    },
    {
      name: 'do_bimodal_psi',
      title: 'Do bimodal angular searches?',
      widget: 'bool',
      default:  true, 
      help: `Do bimodal search for psi angles? \
  Set to Yes if you want to classify 2D helical segments with priors of psi angles. The priors should be bimodal due to unknown polarities of the segments. \
  Set to No if the 3D helix looks the same when rotated upside down. If it is set to No, ordinary angular searches will be performed.\n\nThis option will be invalid if you choose not to perform image alignment on 'Sampling' tab.`
    },
    {
      name: 'range_psi',
      title: 'Angular search range - psi (deg):',
      widget: 'range',
      default: 6, 
      range_min: 3, 
      range_max: 30, 
      range_step: 1, 
      help: `Local angular searches will be performed \
  within +/- the given amount (in degrees) from the psi priors estimated through helical segment picking. \
  A range of 15 degrees is the same as sigma = 5 degrees. Note that the ranges of angular searches should be much larger than the sampling.\
  \n\nThis option will be invalid if you choose not to perform image alignment on 'Sampling' tab.`
    },
    {
      name: 'do_restrict_xoff',
      title: 'Restrict helical offsets to rise:',
      widget: 'bool',
      default:  true, 
      help: 'Set to Yes if you want to restrict the translational offsets along the helices to the rise of the helix given below. Set to No to allow free (conventional) translational offsets.'
    },
    {
      name: 'helical_rise',
      title: 'Helical rise (A):',
      widget: 'range',
      default:  4.75, 
      range_min: -1, 
      range_max: 100, 
      range_step: 1, 
      help: 'The helical rise (in Angstroms). Translational offsets along the helical axis will be limited from -rise/2 to +rise/2, with a flat prior.'
    }
  ]
};

const class3d_helix = {
  widget: 'navtab',
  children: [
  {
    name: 'do_helix',
    title: 'Do helical reconstruction?',
    widget: 'bool',
    default: false,
    help: ` If set to Yes, then perform 3D helical reconstruction.`
  },
  {
    name: 'helical_tube_inner_diameter',
    title: 'Tube diameter - inner (A):',
    widget: 'float',
    default: -1,
    help: `Inner and outer diameter (in Angstroms) of the reconstructed helix spanning across Z axis. \
Set the inner diameter to negative value if the helix is not hollow in the center. The outer diameter should be slightly larger than the actual width of helical tubes because it also decides the shape of 2D \
particle mask for each segment. If the psi priors of the extracted segments are not accurate enough due to high noise level or flexibility of the structure, then set the outer diameter to a large value.`
  },
  {
    name: 'helical_tube_outer_diameter',
    title: 'Tube diameter - outer (A):',
    widget: 'float',
    default: -1,
    help: `Inner and outer diameter (in Angstroms) of the reconstructed helix spanning across Z axis. \
Set the inner diameter to negative value if the helix is not hollow in the center. The outer diameter should be slightly larger than the actual width of helical tubes because it also decides the shape of 2D \
particle mask for each segment. If the psi priors of the extracted segments are not accurate enough due to high noise level or flexibility of the structure, then set the outer diameter to a large value.`
  },
  {
    name: 'range_rot',
    title: 'Angular search range - rot (deg):',
    widget: 'float',
    default: -1,
    help: ` Local angular searches will be performed \
within +/- of the given amount (in degrees) from the optimal orientation in the previous iteration. The default negative value means that no local searches will be performed. \
A Gaussian prior will be applied, so that orientations closer to the optimal orientation \
in the previous iteration will get higher weights than those further away.\n\nThese ranges will only be applied to the \
rot, tilt and psi angles in the first few iterations (global searches for orientations) in 3D helical reconstruction. \
Values of 9 or 15 degrees are commonly used. Higher values are recommended for more flexible structures and more memory and computation time will be used. \
A range of 15 degrees means sigma = 5 degrees.\n\nThese options will be invalid if you choose to perform local angular searches or not to perform image alignment on 'Sampling' tab.`
  },
  {
    name: 'range_tilt',
    title: 'Angular search range - tilt (deg):',
    widget: 'float',
    default: 15,
    help: ` Local angular searches will be performed \
within +/- the given amount (in degrees) from the optimal orientation in the previous iteration. \
A Gaussian prior (also see previous option) will be applied, so that orientations closer to the optimal orientation \
in the previous iteration will get higher weights than those further away.\n\nThese ranges will only be applied to the \
rot, tilt and psi angles in the first few iterations (global searches for orientations) in 3D helical reconstruction. \
Values of 9 or 15 degrees are commonly used. Higher values are recommended for more flexible structures and more memory and computation time will be used. \
A range of 15 degrees means sigma = 5 degrees.\n\nThese options will be invalid if you choose to perform local angular searches or not to perform image alignment on 'Sampling' tab.`
  },
  {
    name: 'range_psi',
    title: 'Angular search range - psi (deg):',
    widget: 'float',
    default: 10,
    help: ` Local angular searches will be performed \
within +/- the given amount (in degrees) from the optimal orientation in the previous iteration. \
A Gaussian prior (also see previous option) will be applied, so that orientations closer to the optimal orientation \
in the previous iteration will get higher weights than those further away.\n\nThese ranges will only be applied to the \
rot, tilt and psi angles in the first few iterations (global searches for orientations) in 3D helical reconstruction. \
Values of 9 or 15 degrees are commonly used. Higher values are recommended for more flexible structures and more memory and computation time will be used. \
A range of 15 degrees means sigma = 5 degrees.\n\nThese options will be invalid if you choose to perform local angular searches or not to perform image alignment on 'Sampling' tab.`
  },

  {
    name: 'do_apply_helical_symmetry',
    title: 'Apply helical symmetry?',
    widget: 'bool',
    default: true,
    help: ` If set to Yes, helical symmetry will be applied in every iteration. Set to No if you have just started a project, helical symmetry is unknown or not yet estimated.`
  },
  {
    name: 'helical_nr_asu',
    title: 'Number of unique asymmetrical units:',
    widget: 'range',
    default: 1, 
    range_min: 1, 
    range_max: 100, 
    range_step: 1,
    help: ` Number of unique helical asymmetrical units in each segment box. If the inter-box distance (set in segment picking step) \
is 100 Angstroms and the estimated helical rise is ~20 Angstroms, then set this value to 100 / 20 = 5 (nearest integer). This integer should not be less than 1. The correct value is essential in measuring the \
signal to noise ratio in helical reconstruction.`
  },
  {
    name: 'helical_twist_initial',
    title: 'Initial helical twist (deg):',
    widget: 'float',
    default: 0,
    help: `Initial helical symmetry. Set helical twist (in degrees) to positive value if it is a right-handed helix. \
Helical rise is a positive value in Angstroms. If local searches of helical symmetry are planned, initial values of helical twist and rise should be within their respective ranges.`
  },
  {
    name: 'helical_rise_initial',
    title: 'Initial helical rise (A):',
    widget: 'float',
    default: 0,
    help: ` Initial helical symmetry. Set helical twist (in degrees) to positive value if it is a right-handed helix. \
Helical rise is a positive value in Angstroms. If local searches of helical symmetry are planned, initial values of helical twist and rise should be within their respective ranges.`
  },
  {
    name: 'helical_z_percentage',
    title: 'Central Z length (%):',
    widget: 'range',
    default: 30., 
    range_min: 5., 
    range_max: 80., 
    range_step: 1.,
    help: ` Reconstructed helix suffers from inaccuracies of orientation searches. \
The central part of the box contains more reliable information compared to the top and bottom parts along Z axis, where Fourier artefacts are also present if the \
number of helical asymmetrical units is larger than 1. Therefore, information from the central part of the box is used for searching and imposing \
helical symmetry in real space. Set this value (%) to the central part length along Z axis divided by the box size. Values around 30% are commonly used.`
  },
  {
    name: 'do_local_search_helical_symmetry',
    title: 'Do local searches of symmetry?',
    widget: 'bool',
    default: false,
    help: ` If set to Yes, then perform local searches of helical twist and rise within given ranges.`
  },
  {
    name: 'helical_twist_min',
    title: 'Helical twist search (deg) - Min:',
    widget: 'float',
    default: 0,
    help: ` Minimum, maximum and initial step for helical twist search. Set helical twist (in degrees) \
to positive value if it is a right-handed helix. Generally it is not necessary for the user to provide an initial step (less than 1 degree, 5~1000 samplings as default). But it needs to be set manually if the default value \
does not guarantee convergence. The program cannot find a reasonable symmetry if the true helical parameters fall out of the given ranges. Note that the final reconstruction can still converge if wrong helical and point group symmetry are provided.`
  },
  {
    name: 'helical_twist_max',
    title: 'Helical twist search (deg) - Max:',
    widget: 'float',
    default: 0,
    help: ` Minimum, maximum and initial step for helical twist search. Set helical twist (in degrees) \
to positive value if it is a right-handed helix. Generally it is not necessary for the user to provide an initial step (less than 1 degree, 5~1000 samplings as default). But it needs to be set manually if the default value \
does not guarantee convergence. The program cannot find a reasonable symmetry if the true helical parameters fall out of the given ranges. Note that the final reconstruction can still converge if wrong helical and point group symmetry are provided.`
  },
  {
    name: 'helical_twist_inistep',
    title: 'Helical twist search (deg) - Step:',
    widget: 'float',
    default: 0,
    help: ` Minimum, maximum and initial step for helical twist search. Set helical twist (in degrees) \
to positive value if it is a right-handed helix. Generally it is not necessary for the user to provide an initial step (less than 1 degree, 5~1000 samplings as default). But it needs to be set manually if the default value \
does not guarantee convergence. The program cannot find a reasonable symmetry if the true helical parameters fall out of the given ranges. Note that the final reconstruction can still converge if wrong helical and point group symmetry are provided.`
  },
  {
    name: 'helical_rise_min',
    title: 'Helical rise search (A) - Min:',
    widget: 'float',
    default: 0,
    help: ` Minimum, maximum and initial step for helical rise search. Helical rise is a positive value in Angstroms. \
Generally it is not necessary for the user to provide an initial step (less than 1% the initial helical rise, 5~1000 samplings as default). But it needs to be set manually if the default value \
does not guarantee convergence. The program cannot find a reasonable symmetry if the true helical parameters fall out of the given ranges. Note that the final reconstruction can still converge if wrong helical and point group symmetry are provided.`
  },
  {
    name: 'helical_rise_max',
    title: 'Helical rise search (A) - Max:',
    widget: 'float',
    default: 0,
    help: ` Minimum, maximum and initial step for helical rise search. Helical rise is a positive value in Angstroms. \
Generally it is not necessary for the user to provide an initial step (less than 1% the initial helical rise, 5~1000 samplings as default). But it needs to be set manually if the default value \
does not guarantee convergence. The program cannot find a reasonable symmetry if the true helical parameters fall out of the given ranges. Note that the final reconstruction can still converge if wrong helical and point group symmetry are provided.`
  },
  {
    name: 'helical_rise_inistep',
    title: 'Helical rise search (A) - Step:',
    widget: 'float',
    default: 0,
    help: ` Minimum, maximum and initial step for helical rise search. Helical rise is a positive value in Angstroms. \
Generally it is not necessary for the user to provide an initial step (less than 1% the initial helical rise, 5~1000 samplings as default). But it needs to be set manually if the default value \
does not guarantee convergence. The program cannot find a reasonable symmetry if the true helical parameters fall out of the given ranges. Note that the final reconstruction can still converge if wrong helical and point group symmetry are provided.`
  },
  {
    name: 'helical_range_distance',
    title: 'Range factor of local averaging:',
    widget: 'range',
    default: -1., 
    range_min: 1., 
    range_max: 5., 
    range_step: 0.1,
    help: ` Local averaging of orientations and translations will be performed within a range of +/- this value * the box size. Polarities are also set to be the same for segments coming from the same tube during local refinement. \
Values of ~ 2.0 are recommended for flexible structures such as MAVS-CARD filaments, ParM, MamK, etc. This option might not improve the reconstructions of helices formed from curled 2D lattices (TMV and VipA/VipB). Set to negative to disable this option.`
  },
  {
    name: 'keep_tilt_prior_fixed',
    title: 'Keep tilt-prior fixed:',
    widget: 'bool',
    default: true,
    help: ` If set to yes, the tilt prior will not change during the optimisation. If set to No, at each iteration the tilt prior will move to the optimal tilt value for that segment from the previous iteration.`
  },
]
};

const mask_helix = [
  {
    name: 'do_helix',
    title: 'Mask a 3D helix?',
    widge: 'bool',
    default:  false,
    help: `Generate a mask for 3D helix which spans across Z axis of the box.`,
  },
  {
    name: 'helical_z_percentage',
    title: 'Central Z length (%):',
    widget: 'range',
    default:  30., 
    range_min: 5., 
    range_max: 80., 
    range_step: 1.,
    help: `Reconstructed helix suffers from inaccuracies of orientation searches. \
The central part of the box contains more reliable information compared to the top and bottom parts along Z axis. Set this value (%) to the central part length along Z axis divided by the box size. Values around 30% are commonly used but you may want to try different lengths.`,
  },
];

const helix_tabs = [
  {
    name: 'methods',
    icon: 'bi-wrench-adjustable',
    title: 'Tools',
    widget: 'navtab',
    default:  true, 
    children: [
      {
        name: 'helix',
        title: 'Manual Picking',
        widget: 'fieldset',
        children: [
          {
            name: 'do_pick_helical_segments',
            title: 'Pick 2D helical segments',
            widget: 'radio',
            option: '--do_pick_helical_segments',
            group: 'picking',
            help: 'Set to Yes if you want to pick 2D helical segments.',
            on_click: (ev) => w_navtab_update({settings: pick_helices})
          },
          {
            name: 'do_amyloid',
            title: 'Pick amyloid segments',
            widget: 'radio',
            option: '--do_amyloid',
            group: 'picking',
            help: 'Set to Yes if you want to use the algorithm that was developed specifically for picking amyloids.',
            on_click: (ev) => w_navtab_update({settings: pick_helices})
          },
        ]
      },
      {
        name: 'h_extract',
        title: 'Helix extraction',
        widget: 'fieldset',
        children: [
          {
            name:'io',
            title: 'Extract helices',
            widget: 'radio',
          },
        ]
      },
      {
        name: 'helix',
        title: 'Classification',
        widget: 'fieldset',
        children: [
          {
            name: 'do_pick_helical_segments',
            title: '2D classification of helices',
            widget: 'radio',
            option: '--do_pick_helical_segments',
            group: 'picking',
            help: 'Set to Yes if you want to pick 2D helical segments.',
            on_click: (ev) => w_navtab_update({settings: pick_helices})
          },
          {
            name: 'do_pick_helical_segments',
            title: '3D classification of helices',
            widget: 'radio',
            option: '--do_pick_helical_segments',
            group: 'picking',
            help: 'Set to Yes if you want to pick 2D helical segments.',
            on_click: (ev) => w_navtab_update({settings: pick_helices})
          },
        ]
      },
      {
        name: 'helix',
        title: 'Mask',
        widget: 'fieldset',
        children: [
          {
            name: 'do_pick_helical_segments',
            title: 'Mask creation of 3D helical volume',
            widget: 'radio',
            option: '--do_pick_helical_segments',
            group: 'picking',
            help: 'Set to Yes if you want to pick 2D helical segments.',
            on_click: (ev) => w_navtab_update({settings: pick_helices})
          },
        ]
      },
    ]
  },
  {
    name: 'io',
    icon: 'bi-arrow-down-up',
    title: 'I/O',
    widget: 'navtab',
    children: autopick_io
  },
  {
    name: 'display',
    icon: 'bi-palette',
    title: 'Display',
    widget: 'navtab',
    children: autopick_display
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
      {
        name: 'queue_settings',
        title:  'Queue settings',
        widget: 'fieldset',
        children: [
          {
            name: 'submit_queue',
            title:  'Submit to queue?',
            widget: 'bool',
          },
          {
            name: 'queue_name',
            title:  'Queue name',
            widget: 'text',
          },
          {
            name: 'queue_command',
            title:  'Queue submit command',
            widget: 'text',
          },
          {
            name: 'submit_script',
            title:  'Standard submission script',
            widget: 'text',
          },
          {
            name: 'min_core',
            title:  'Minimum dedicated cores per node',
            default: 4,
            widget: 'int',
          },
        ]
      },
      {
        name: 'misc',
        title:  'Misc.',
        widget: 'fieldset',
        children: [
          {
            name: 'extra_args',
            title:  'Additional arguments',
            default: '',
            widget: 'text',
          },
          {
            name: 'alias',
            title:  'Job alias',
            widget: 'text',
          },
        ]
      },
      {
        name: 'extra_args',
        title:  'Run',
        widget: 'fieldset',
        children: [
          {
            name: 'schedule',
            title:  'Schedule',
            widget: 'button',
          },
          {
            name: 'command',
            title:  'Check command',
            widget: 'button',
          },
          {
            name: 'run',
            title:  'Run!',
            widget: 'button',
          },
          {
            name: 'continue',
            title:  'Continue',
            widget: 'button',
          },
        ]
      },
    ]
  }
];


