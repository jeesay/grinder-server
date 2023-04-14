const helical = [
    {
      name:'do_extract_helix',
      title: 'Extract helical segments?',
      widget: 'bool',
      default: false,
      help: 'Set to Yes if you want to extract helical segments. RELION (.star), EMAN2 (.box) and XIMDISP (.coords) formats of tube or segment coordinates are supported.',
    },
    {
      name:'helical_tube_outer_diameter',
      title: 'Tube diameter (A): ',
      widget: 'range',
      default:200, 
      range_min: 100, 
      range_max: 1000, 
      range_step: 10,
      help: `Outer diameter (in Angstroms) of helical tubes. This value should be slightly larger than the actual width of helical tubes.`,
    },
    {
      name:'helical_bimodal_angular_priors',
      title: 'Use bimodal angular priors?',
      widget: 'bool',
      default: true,
      help: 'Normally it should be set to Yes and bimodal angular priors will be applied in the following classification and refinement jobs. \
Set to No if the 3D helix looks the same when rotated upside down.',
    },
    {
      name:'do_extract_helical_tubes',
      title: 'Coordinates are start-end only?',
      widget: 'bool',
      default: true,
      help: 'Set to Yes if you want to extract helical segments from manually picked tube coordinates (starting and end points of helical tubes in RELION, EMAN or XIMDISP format). \
Set to No if segment coordinates (RELION auto-picked results or EMAN / XIMDISP segments) are provided.',
    },
    {
      name:'do_cut_into_segments',
      title: 'Cut helical tubes into segments?',
      widget: 'bool',
      default: true,
      help: 'Set to Yes if you want to extract multiple helical segments with a fixed inter-box distance. \
If it is set to No, only one box at the center of each helical tube will be extracted.',
    },
    {
      name:'helical_nr_asu',
      title: 'Number of unique asymmetrical units:',
      widget: 'range',
      default:1, 
      range_min: 1, 
      range_max: 100, 
      range_step: 1,
      help: 'Number of unique helical asymmetrical units in each segment box. This integer should not be less than 1. The inter-box distance (pixels) = helical rise (Angstroms) * number of asymmetrical units / pixel size (Angstroms). \
The optimal inter-box distance might also depend on the box size, the helical rise and the flexibility of the structure. In general, an inter-box distance of ~10% * the box size seems appropriate.',
    },
    {
      name:'helical_rise',
      title: 'Helical rise (A):',
      widget: 'range',
      default:1, 
      range_min: 0, 
      range_max: 100, 
      range_step: 0.01,
      help: `Helical rise in Angstroms. (Please click '?' next to the option above for details about how the inter-box distance is calculated.)`,
    },
]

const extract_io = {
  widget: 'navtab',
  children: [
    {
      name:'star_mics',
      title: 'Micrograph STAR file:',
      widget: 'file',
      filetype: 'NODE_MICS_CPIPE',
      default: '',
      placeholder: 'Input STAR file (*.{star})',
      help: 'Filename of the STAR file that contains all micrographs from which to extract particles.',
    },
    // TO DOL set helical option for this
    {
      name:'coords_suffix',
      title: 'Input coordinates: ',
      widget: 'file',
      filetype: 'NODE_COORDS_CPIPE',
      default: '',
      placeholder: 'Input coordinates list file (*.star)',
      help: 'Starfile with a 2-column list of micrograph names and corresponding coordinate filenames (in .star, .box or as 2 or 3-column free text format)',
    },
  ]
};

const reset_offsets = [
  {
    name:'reset_off',
    title: 'Parameters',
    widget: 'fieldset',
    children: [
      {
        name:'do_reset_offsets',
        title: 'Reset the refined offsets to zero? ',
        widget: 'bool',
        default:false,
      help: 'If set to Yes, the input origin offsets will be reset to zero. This may be useful after 2D classification of helical segments, where one does not want neighbouring segments to be translated on top of each other for a subsequent 3D refinement or classification.',
      },
    ]
  }
];

const re_center = [
  {
    name:'recenter',
    title: 'Parameters',
    widget: 'fieldset',
    children: [
      {
        name:'recenter_x',
        title: 'Re-center on X-coordinate (in pix): ',
        widget: 'int',
        default: 0,
        help: 'Re-extract particles centered on this X-coordinate (in pixels in the reference)',
      },
      {
        name:'recenter_y',
        title: 'Re-center on Y-coordinate (in pix): ',
        widget: 'int',
        default: 0,
        help: 'Re-extract particles centered on this Y-coordinate (in pixels in the reference)',
      },
      {
        name:'recenter_z',
        title: 'Re-center on Z-coordinate (in pix): ',
        widget: 'int',
        default:0,
        help: 'Re-extract particles centered on this Z-coordinate (in pixels in the reference)',
      },
    ]
  }
];

const re_extract = [
  {
    name:'inputs',
    title: 'Input files',
    widget: 'fieldset',
    children: [
      {
        name:'star_mics',
        title: 'Micrograph STAR file:',
        widget: 'file',
        filetype: 'NODE_MICS_CPIPE',
        default: '',
        placeholder: 'Input STAR file (*.{star})',
        help: 'Filename of the STAR file that contains all micrographs from which to extract particles.',
      },
      {
        name:'fndata_reextract',
        title: 'Refined particles STAR file: ',
        widget: 'file',
        filetype: 'NODE_PARTS_CPIPE',
        default: '',
        placeholder: 'Input STAR file (*.{star})',
        help: 'Filename of the STAR file with the refined particle coordinates, e.g. from a previous 2D or 3D classification or auto-refine run.',
      },
    ]
  }
];


const re_extract_io = {
  widget: 'navtab',
  children: [...re_extract,...reset_offsets]
};

const re_extract_io_center = {
  widget: 'navtab',
  children: [...re_extract,...re_center]
};


const extract_settings = [
  {
    name:'extract_size',
    title: 'Particle box size (pix):',
    widget: 'range',
    default:128, 
    range_min: 64, 
    range_max: 512, 
    range_step: 8,
    help: 'Size of the extracted particles (in pixels). This should be an even number!',
  },
  {
    name:'do_invert',
    title: 'Invert contrast?',
    widget: 'bool',
    default:true,
    help: 'If set to Yes, the contrast in the particles will be inverted.',
  },
  {
    name:'do_float16',
    title: 'Write output in float16?',
    widget: 'bool',
    default:true ,
    help: 'If set to Yes, this program will write output images in float16 MRC format. This will save a factor of two in disk space compared to the default of writing in float32. Note that RELION and CCPEM will read float16 images, but other programs may not (yet) do so.',
  },
  {
    name:'do_norm',
    title: 'Particles normalization',
    widget: 'fieldset',  
    children: [
      {
        name:'do_norm',
        title: 'Normalize particles?',
        widget: 'switch',
        default:true,
        help: 'If set to Yes, particles will be normalized in the way RELION prefers it.',
      },
      {
        name:'bg_diameter',
        title: 'Diameter background circle (pix): ',
        widget: 'range',
        default:-1, 
        range_min: -1, 
        range_max: 600, 
        range_step: 10,
        help: 'Particles will be normalized to a mean value of zero and a standard-deviation of one for all pixels in the background area.\
    The background area is defined as all pixels outside a circle with this given diameter in pixels (before rescaling). When specifying a negative value, a default value of 75% of the Particle box size will be used.',
      },
      {
        name:'white_dust',
        title: 'Stddev for white dust removal: ',
        widget: 'range',
        default:-1, 
        range_min: -1, 
        range_max: 10, 
        range_step: 0.1,
        help: 'Remove very white pixels from the extracted particles. \
    Pixels values higher than this many times the image stddev will be replaced with values from a Gaussian distribution. \n \n Use negative value to switch off dust removal.',
      },
      {
        name:'black_dust',
        title: 'Stddev for black dust removal: ',
        widget: 'range',
        default:-1, 
        range_min: -1, 
        range_max: 10, 
        range_step: 0.1,
        help: 'Remove very black pixels from the extracted particles. \
    Pixels values higher than this many times the image stddev will be replaced with values from a Gaussian distribution. \n \n Use negative value to switch off dust removal.',
      },
    ]
  },
  {
    name:'rescale_panel',
    title: 'Rescale particles',
    widget: 'fieldset',
    children: [
      {
        name:'do_rescale',
        title: 'Rescale particles?',
        widget: 'switch',
        default:false,
        help: 'If set to Yes, particles will be re-scaled. Note that the particle diameter below will be in the down-scaled images.',
      },
      {
        name:'rescale',
        title: 'Re-scaled size (pixels): ',
        widget: 'range',
        default:128, 
        range_min: 64, 
        range_max: 512, 
        range_step: 8,
        help: 'The re-scaled value needs to be an even number',
      },
    ]
  },
  {
    name:'fom_panel',
    title: 'Figure of Merit',
    widget: 'fieldset',
    children: [
      {
        name:'do_fom_threshold',
        title: 'Use autopick FOM threshold?',
        widget: 'switch',
        default:false,
        help: 'If set to Yes, only particles with rlnAutopickFigureOfMerit values below the threshold below will be extracted.',
      },
      {
        name:'minimum_pick_fom',
        title: 'Minimum autopick FOM: ',
        widget: 'range',
        default:0, 
        range_min: -5, 
        range_max: 10, 
        range_step: 0.1,
        help: 'The minimum value for the rlnAutopickFigureOfMerit for particles to be extracted.',
      }
    ]
  }
];


const extract_tabs = [
  {
    name: 'methods',
    icon: 'bi-wrench-adjustable',
    title: 'Tools',
    widget: 'navtab',
    default:  true, 
    children: [
      {
        name: 'p_extract',
        title: 'Particle extraction',
        widget: 'fieldset',
        children: [
          {
            name:'io',
            title: 'Extract particles',
            widget: 'radio',
            on_click: (ev) => w_navtab_update({io: extract_io})
          },
          {
            name:'io',
            title: 'Re-extract refined particles',
            widget: 'radio',
            help: 'If set to Yes, relion uses a _data.star file from a previous 2D or 3D refinement to re-extract the particles in that refinement, possibly re-centered with their refined origin offsets. This is particularly useful when going from binned to unbinned particles.',
            on_click: (ev) => w_navtab_update({io: re_extract_io})
          },
          {
            name:'io',
            title: 'Re-extract refined particles with a particle re-centering',
            widget: 'radio',
            help: 'If set to Yes, the input coordinates will be re-centered according to the refined origin offsets in the provided _data.star file. The unit is pixel, not angstrom. The origin is at the center of the box, not at the corner.',
            on_click: (ev) => w_navtab_update({io: re_extract_io_center})
          },
        ]
      },
    ]
  },
  {
    name:'io',
    icon: 'bi-arrow-down-up',
    title: 'I/O',
    widget: 'navtab',
    children: []
  },
  {
    name:'settings',
    icon: 'bi-tools',
    title: 'Settings',
    widget: 'navtab',
    children: extract_settings
  },
  {
    name:'running',
    icon: 'bi-send',
    title: 'Running',
    widget: 'navtab',
    children: []
  },
  {
    name:'result',
    icon: 'bi-eye',
    title: 'Result',
    widget: 'navtab',
    children: []
  }
];

