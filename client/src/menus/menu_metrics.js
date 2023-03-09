const locres_io = [
  {
    name: 'fn_in',
    title: 'One of the 2 unfiltered half-maps:',
    widget: 'file', 
    filetype: 'NODE_HALFMAP_CPIPE',
    default: '',
    placeholder: 'MRC map files (*half1*.mrc)',  
    help: `Provide one of the two unfiltered half-reconstructions that were output upon convergence of a 3D auto-refine run.`
  },
  {
    name: 'fn_mask',
    title: 'User-provided solvent mask:',
    widget: 'file',
    filetype: 'NODE_MASK_CPIPE',
    default: '',
    placeholder: 'Image Files (*.{spi,vol,msk,mrc})',
    help: `Provide a mask with values between 0 and 1 around all domains of the complex. ResMap uses this mask for local resolution calculation. RELION does NOT use this mask for calculation, but makes a histogram of local resolution within this mask.`
  },
  {
    name: 'angpix',
    title: 'Calibrated pixel size (A):',
    widget: 'range',
    default: 1, 
    range_min: 0.3, 
    range_max: 5, 
    range_step: 0.1,
    help: `Provide the final, calibrated pixel size in Angstroms. This value may be different from the pixel-size used thus far, e.g. when you have recalibrated the pixel size using the fit to a PDB model. The X-axis of the output FSC plot will use this calibrated value.`
  },
];

const locres_resmap = [
  // Check for environment variable RELION_RESMAP_TEMPLATE
  {
    name: 'fn_resmap',
    title: 'ResMap executable:',
    widget: 'text',
    default: 'default_location',
    help: `Location of the ResMap executable. You can control the default of this field by setting environment variable RELION_RESMAP_EXECUTABLE, or by editing the first few lines in src/gui_jobwindow.h and recompile the code. \n \n Note that the ResMap wrapper cannot use MPI.`
  },
  {
    name: 'pval',
    title: 'P-value:',
    widget: 'range',
    default: 0.05, 
    range_min: 0., 
    range_max: 1., 
    range_step: 0.01,
    help: `This value is typically left at 0.05. If you change it, report the modified value in your paper!`
  },
  {
    name: 'minres',
    title: 'Highest resolution (A): ',
    widget: 'range',
    default: 0., 
    range_min: 0., 
    range_max: 10., 
    range_step: 0.1,
    help: `ResMaps minRes parameter. By default (0), the program will start at just above 2x the pixel size`
  },
  {
    name: 'maxres',
    title: 'Lowest resolution (A): ',
    widget: 'range',
    default: 0., 
    range_min: 0., 
    range_max: 10., 
    range_step: 0.1,
    help: `ResMaps maxRes parameter. By default (0), the program will stop at 4x the pixel size`
  },
  {
    name: 'stepres',
    title: 'Resolution step size (A):',
    widget: 'range',
    default: 1., 
    range_min: 0.1, 
    range_max: 3, 
    range_step: 0.1,
    help: `ResMaps stepSize parameter.`
  },
];

const locres_relion = [
  //  
  {
    name: 'locres_sampling',
    title: 'Sampling rate (A):',
    widget: 'range',
    default: 25, 
    range_min: 5, 
    range_max: 50, 
    range_step: 5,
    help: `The local-resolution map will be calculated every so many Angstroms, by placing soft spherical masks on a cubic grid with this spacing. Very fine samplings (e.g. < 15A?) may take a long time to compute and give spurious estimates!`
  },
  {
    name: 'randomize_at',
    title: 'Frequ. for phase-randomisation (A): ',
    widget: 'range',
    default: 10., 
    range_min: 5, 
    range_max: 20., 
    range_step: 1,
    help: `From this frequency onwards, the phases for the mask-corrected FSC-calculation will be randomized. Make sure this is a lower resolution (i.e. a higher number) than the local resolutions you are after in your map.`
  },
  {
    name: 'adhoc_bfac',
    title: 'User-provided B-factor:',
    widget: 'range',
    default: -100, 
    range_min: -500, 
    range_max: 0, 
    range_step: -25,
    help: `Probably, the overall B-factor as was estimated in the postprocess is a useful value for here. Use negative values for sharpening. Be careful: if you over-sharpen your map, you may end up interpreting noise for signal!`
  },
  {
    name: 'fn_mtf',
    title: 'MTF of the detector (STAR file):',
    widget: 'file',
    default: '',
    placeholder: 'STAR Files (*.star)',
    help: `The MTF of the detector is used to complement the user-provided B-factor in the sharpening. If you don't have this curve, you can leave this field empty.`
  },
];

const locres_io_tab = {
  widget: 'navtab',
  children: locres_io
}

const locres_resmap_tab = {
  widget: 'navtab',
  children: locres_resmap
}

const locres_relion_tab = {
  widget: 'navtab',
  children: locres_relion
}

const metrics_tabs = [
  {
    name: 'tools',
    title: 'Tools',
    icon: 'bi-wrench-adjustable',
    widget: 'navtab',
    default:  true, 
    children: [
      {
        name: 'locres',
        title: 'Local Resolution',
        widget: 'fieldset',
        children: [
          {
            name: 'do_resmap_locres',
            title: 'Local Resolution with Resmap',
            widget: 'radio',
            option: '--do_resmap_locres',
            group: 'toolkit',
            help: `If set to Yes, then ResMap will be used for local resolution estimation.\n \n Note that the ResMap wrapper cannot use MPI.`,
            on_click: (ev) => w_navtab_update({io: locres_io_tab,settings: locres_resmap_tab})
          },
          {
            name: 'do_relion_locres',
            title: 'Local Resolution with Relion (Experimental)',
            widget: 'radio',
            option: '--do_relion_locres',
            group: 'toolkit',
            help: `If set to Yes, then relion_postprocess will be used for local-resolution estimation. This program basically performs a series of post-processing operations with a small soft, spherical mask that is moved over the entire map, while using phase-randomisation to estimate the convolution effects of that mask. \
\n \n The output relion_locres.mrc map can be used to color the surface of a map in UCSF Chimera according to its local resolution. The output relion_locres_filtered.mrc is a composite map that is locally filtered to the estimated resolution. \
This is a developmental feature in need of further testing, but initial results indicate it may be useful. \n \n Note that only this program can use MPI, the ResMap wrapper cannot use MPI.`,
            on_click: (ev) => w_navtab_update({io: locres_io_tab, settings: locres_relion_tab})
          }
        ]
      },
    ]
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
    children: []
  }
];

