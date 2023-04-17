const ugraph_settings = {
  name: 'raw_settings',
  title: 'Movies/mics',
  widget: 'navtab',
  help: 'Import Movies or Micrographs',
  children: [
    {
      name: 'inputs',
      title: 'Inputs',
      widget: 'fieldset',
      children: [
        {
          name: 'fn_in_raw',
          title: 'Raw input files:',
          widget: 'file',
          placeholder:  'Micrographs/*.tif',
          dialog_title:  'Open Movie or Image',
          filter: '.mrc,.mrcs,.tif,.tiff,.err' ,
          option: '--i',
          default:  '',
          help:  `Provide a Linux wildcard that selects all raw movies or micrographs to be imported. The path must be a relative path from the project directory. To import files outside the project directory, first make a symbolic link by an absolute path and then specify the link by a relative path. See the FAQ page on RELION wiki (https://www3.mrc-lmb.cam.ac.uk/relion/index.php/FAQs#What_is_the_right_way_to_import_files_outside_the_project_directory.3F) for details.")`
        },
  /*
  Unnecessary
        {
          name: 'is_multiframe',
          title: 'Are these multi-frame movies?',
          widget: 'bool',
          default:  true, 
          help: "Set to Yes for multi-frame movies, set to No for single-frame micrographs."
        },
  */
        {
          name: 'optics_group_name',
          widget: 'text',
          title: 'Optics group name:',
          option: '--optics_group_name',
          default:  'opticsGroup1',
          help:  'Name of this optics group. Each group of movies/micrographs with different optics characteristics for CTF refinement should have a unique name.'
        },
        {
          name: 'fn_mtf',
          title: 'MTF of the detector:',
          option: '--optics_group_mtf',
          widget: 'file',
          dialog_title:  'Open MTF File',
          filter: '.star' ,
          default:  '',
          placeholder:  'filename.star',
          filter:  '.',
          help:  `As of release-3.1, the MTF of the detector is used in the refinement stages of refinement.
      If you know the MTF of your detector, provide it here. Curves for some well-known detectors may be downloaded from the RELION Wiki. Also see there for the exact format.
      If you do not know the MTF of your detector and do not want to measure it, then by leaving this entry empty, you include the MTF of your detector in your overall estimated B-factor upon sharpening the map. Although that is probably slightly less accurate, the overall quality of your map will probably not suffer very much.

      Note that when combining data from different detectors, the differences between their MTFs can no longer be absorbed in a single B-factor, and providing the MTF here is important!`
        },
      ]
    },
    {
      name: 'params',
      title: 'Parameters',
      widget: 'fieldset',
      children: [
        {
          name: 'angpix',
          title: 'Pixel size (Angstrom):',
          option: '--angpix',
          widget: 'range',
          default:  1.4, 
          range_min: 0.5, 
          range_max: 3, 
          range_step: 0.1, 
          help: 'Pixel size in Angstroms.'
        },
        {
          name: 'kV',
          title: 'Voltage (kV):',
          widget: 'range',
          option: '--kV',
          default:  300, 
          range_min: 50, 
          range_max: 500, 
          range_step: 10, 
          help: 'Voltage the microscope was operated on (in kV)'
        },
        {
          name: 'Cs',
          title: 'Spherical aberration (mm):',
          option: '--Cs',
          default:  2.7, 
          widget: 'range',
          range_min: 0, 
          range_max: 8, 
          range_step: 0.1, 
          help: 'Spherical aberration of the microscope used to collect these images (in mm). Typical values are 2.7 (FEI Titan & Talos, most JEOL CRYO-ARM), 2.0 (FEI Polara), 1.4 (some JEOL CRYO-ARM) and 0.01 (microscopes with a Cs corrector)."'
        },
        {
          name: 'Q0',
          title: 'Amplitude contrast:',
          option: '--Q0',
          default:  0.1, 
          widget: 'range',
          range_min: 0, 
          range_max: 0.3, 
          range_step: 0.01, 
          help: 'Fraction of amplitude contrast. Often values around 10% work better than theoretically more accurate lower values..."'
        },
        {
          name: 'beamtilt_x',
          title: 'Beamtilt in X (mrad):',
          option: '--beamtilt_x',
          widget: 'range',
          default:  0.0, 
          range_min: -1.0, 
          range_max: 1.0, 
          range_step: 0.1, 
          help: 'Known beamtilt in the X-direction (in mrad). Set to zero if unknown.'
        },
        {
          name: 'beamtilt_y',
          title: 'Beamtilt in Y (mrad):',
          option: '--beamtilt_y',
          widget: 'range',
          default:  0.0, 
          range_min: -1.0, 
          range_max: 1.0, 
          range_step: 0.1, 
          help: 'Known beamtilt in the Y-direction (in mrad). Set to zero if unknown."'
        },
      ]
    }
  ]
};

const coords_settings = {
  name: 'coords_settings',
  title: 'Other Files',
  widget: 'navtab',
  help: 'Import Coordinates Files',
  children: [
    {
      name: 'fn_in_other',
      title: 'Input Coordinates files:',
      widget: 'file',
      dialog_title:  'Open Coordinates files',
      placeholder: '*._autopick.star, *.box',
      default:  '',
      help: `Select any coordinates file(s) to import.
      
  Note that for importing coordinate files, one has to give a Linux wildcard, where the *-symbol is before the coordinate-file suffix, e.g. if the micrographs are called mic1.mrc and the coordinate files mic1.box or mic1_autopick.star, one HAS to give '*.box' or '*_autopick.star', respectively.

  Also note that micrographs, movies and coordinate files all need to be in the same directory (with the same rootnames, e.g.mic1 in the example above) in order to be imported correctly.`
    },
    {
      name: 'optics_group_particles',
      title: 'Rename optics group for particles:',
      widget: 'text',
      default:  'opticsGroupNew1',
      help:  'Only for the import of a particles STAR file with a single, or no, optics groups defined: rename the optics group for the imported particles to this string.'
    },

  ]
};

const other_settings = {
  name: 'other_settings',
  title: 'Other Files',
  widget: 'navtab',
  help: 'Import Other Files',
  children: [
    {
      name: 'fn_in_other',
      title: 'Input file:',
      widget: 'file',
      default:  'ref.mrc',
      default:  'Input file (*.*)',
      default:  '.',
      help: `Select any file(s) to import.
      
  Note that for importing coordinate files, one has to give a Linux wildcard, where the *-symbol is before the coordinate-file suffix, e.g. if the micrographs are called mic1.mrc and the coordinate files mic1.box or mic1_autopick.star, one HAS to give '*.box' or '*_autopick.star', respectively.

  Also note that micrographs, movies and coordinate files all need to be in the same directory (with the same rootnames, e.g.mic1 in the example above) in order to be imported correctly. 3D masks or references can be imported from anywhere.

  Note that movie-particle STAR files cannot be imported from a previous version of RELION, as the way movies are handled has changed in RELION-2.0.

  For the import of a particle, 2D references or micrograph STAR file or of a 3D reference or mask, only a single file can be imported at a time.

  Note that due to a bug in a fltk library, you cannot import from directories that contain a substring  of the current directory, e.g. dont import from /home/betagal if your current directory is called /home/betagal_r2. In this case, just change one of the directory names.`
    },
    {
      name: 'optics_group_particles',
      title: 'Rename optics group for particles:',
      widget: 'text',
      default:  '',
      help:  'Only for the import of a particles STAR file with a single, or no, optics groups defined: rename the optics group for the imported particles to this string.'
    },

  ]
};


const import_tabs = [
  {
    name: 'do_raw',
    title: 'Files',
    icon: 'bi-file-earmark-text',
    job: 'relion.import',
    widget: 'navtab',
    default:  true, 
    children: [
      {
        name: 'do_raw',
        title: 'Movies/micrographs',
        widget: 'fieldset',
        children : [
          {
            name: 'do_movies',
            class: 'jobtype',
            job: 'relion.import.movies',
            title: 'Raw movies',
            widget: 'radio',
            option: '--do_movies',
            group: 'node_types',
            help: 'Set this to Yes if you plan to import raw movies',
            on_click: (ev) => w_navtab_update({settings: ugraph_settings})
          },
          {
            name: 'do_micrographs',
            class: 'jobtype',
            title: 'Raw micrographs',
            option: '--do_micrographs',
            widget: 'radio',
            group: 'node_types',
            help: 'Set this to Yes if you plan to import raw micrographs',
            on_click: (ev) => w_navtab_update({settings: ugraph_settings})
          },
          {
            name: 'other_ugraph_star',
            class: 'jobtype',
            title:  'Micrographs STAR file (.star)',
            group: 'node_types',
            widget: 'radio',
          },
        ]
      },
      // Others?
      {
        name: 'do_other',
        title: 'Particles',
        widget: 'fieldset',
        children : [
          {
            name: 'other_pctls_coords',
            class: 'jobtype',
            title:  'Particles coordinates (.box, *_pick.star)',
            group: 'node_types',
            widget: 'radio',
            on_click: (ev) => w_navtab_update({settings: coords_settings})
          },
          {
            name: 'other_pctls_star',
            class: 'jobtype',
            title:  'Particles STAR file (.star)',
            group: 'node_types',
            widget: 'radio',
          },
        ]
      },
      {
        name: 'do_ref',
        title: 'References',
        widget: 'fieldset',
        children : [
          {
            name: 'other_refs',
            class: 'jobtype',
            title:  'Multiple (2D or 3D) references (.star or .mrcs)',
            group: 'node_types',
            widget: 'radio',
          },
          {
            name: 'other_ref3d',
            class: '.jobtype',
            title:  '3D reference (.star)',
            widget: 'radio',
            group: 'node_types',
          },
        ]
      },
      {
        name: 'do_mask',
        title: 'Mask',
        widget: 'fieldset',
        children : [
          {
            name: 'other_mask',
            class: 'jobtype',
            title:  '3D mask (.mrc)',
            widget: 'radio',
            group: 'node_types',
          },
          {
            name: 'other_unfil',
            class: 'jobtype',
            title:  'Unfiltered half-mask (unfil.mrc)',
            widget: 'radio',
            group: 'node_types',
          },
        ]
      },
      // Others?
      {
        name: 'do_other',
        title: 'Other files',
        widget: 'fieldset',
        children : [
          {
            name: 'do_movies',
            class: 'jobtype',
            job: 'relion.import.mtf',
            title: 'MTF, Gain ref., Defect, etc.',
            widget: 'radio',
            option: '--do_movies',
            group: 'node_types',
            help: 'Set this to Yes if you plan to import MTF file',
            on_click: (ev) => w_navtab_update({settings: ugraph_settings})
          },
        ]
      }
    ]
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
      {
        name: 'misc',
        title:  'Misc.',
        widget: 'fieldset',
        children: [
          {
            name: 'extra_args',
            title:'Additional arguments',
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
      ...submit_settings,
    ]
  }
];


