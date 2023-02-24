
// Sharpening
const sharpen = [
  {
    name: 'in_optimisation',
    title: 'Input optimisation set:', 
    widget: 'file',
    filetype: 'OUTNODE_TOMO_OPTIMISATION',
    placeholder: 'Optimisation set STAR file (*.star)',
    help:`Input tomo optimisation set. Half map files will be extracted. If half maps are specified below, then they will override the components in this optimisation set.`
  },
  {
    name: 'fn_in',
    title: 'One of the 2 unfiltered half-maps:',
    widget: 'file',
    filetype: 'NODE_HALFMAP_CPIPE',
    placeholder: 'MRC map files (*half1*.mrc)', 
    help: `Provide one of the two unfiltered half-reconstructions that were output upon convergence of a 3D auto-refine run.`
  },
  {
    name: 'fn_mask',
    title: 'Solvent mask:',
    widget: 'file',
    filetype: 'NODE_MASK_CPIPE',
    placeholder: 'Image Files (*.{spi,vol,msk,mrc})',
    help:`Provide a soft mask where the protein is white (1) and the solvent is black (0). Often, the softer the mask the higher resolution estimates you will get. A soft edge of 5-10 pixels is often a good edge width.`
  },
  {
    name: 'angpix',
    title: 'Calibrated pixel size (A)',
    widget: 'range',
    default: -1, 
    range_min: 0.3, 
    range_max: 5, 
    range_step: 0.1,
    help: `Provide the final, calibrated pixel size in Angstroms. This value may be different from the pixel-size used thus far, e.g. when you have recalibrated the pixel size using the fit to a PDB model. The X-axis of the output FSC plot will use this calibrated value.`
  },
  {
    name: 'do_auto_bfac',
    title: 'Estimate B-factor automatically',
    widget: 'bool',
    default: true,
    help: `If set to Yes, then the program will use the automated procedure described by Rosenthal and Henderson (2003, JMB) to estimate an overall B-factor for your map, and sharpen it accordingly. \
Note that your map must extend well beyond the lowest resolution included in the procedure below, which should not be set to resolutions much lower than 10 Angstroms. `
  },
  {
    name: 'autob_lowres',
    title: 'Lowest resolution for auto-B fit (A):',
    widget: 'range',
    default: 10, 
    range_min: 8, 
    range_max: 15, 
    range_step: 0.5,
    help: `This is the lowest frequency (in Angstroms) that will be included in the linear fit of the Guinier plot as described in Rosenthal and Henderson (2003, JMB). Dont use values much lower or higher than 10 Angstroms. If your map does not extend beyond 10 Angstroms, then instead of the automated procedure use your own B-factor.`
  },
  {
    name: 'do_adhoc_bfac',
    title: 'Use your own B-factor',
    widget: 'bool',
    default: false,
    help: `Instead of using the automated B-factor estimation, provide your own value. Use negative values for sharpening the map. \
This option is useful if your map does not extend beyond the 10A needed for the automated procedure, or when the automated procedure does not give a suitable value (e.g. in more disordered parts of the map).`
  },
  {
    name: 'adhoc_bfac',
    title: 'User-provided B-factor:', 
    widget: 'range',
    default: -1000, 
    range_min: -2000, 
    range_max: 0, 
    range_step: -50,
    help: `Use negative values for sharpening. Be careful: if you over-sharpen your map, you may end up interpreting noise for signal!`
  },
  {
    name: 'fn_mtf',
    title: 'MTF of the detector (STAR file)',
    widget: 'file',
    placeholder:'STAR Files (*.star)',
    help:`If you know the MTF of your detector, provide it here. Curves for some well-known detectors may be downloaded from the RELION Wiki. Also see there for the exact format \
\n If you do not know the MTF of your detector and do not want to measure it, then by leaving this entry empty, you include the MTF of your detector in your overall estimated B-factor upon sharpening the map.\
Although that is probably slightly less accurate, the overall quality of your map will probably not suffer very much.`
  },
  {
    name: 'mtf_angpix',
    title: 'Original detector pixel size:',
    widget: 'range',
    default: 1.0, 
    range_min: 0.3, 
    range_max: 2.0, 
    range_step: 0.1,
    help: `This is the original pixel size (in Angstroms) in the raw (non-super-resolution!) micrographs.`
  },
  {
    name: 'do_skip_fsc_weighting',
    title: 'Skip FSC-weighting',
    widget: 'bool',
    default: false,
    help: `If set to No (the default), then the output map will be low-pass filtered according to the mask-corrected, gold-standard FSC-curve. \
Sometimes, it is also useful to provide an ad-hoc low-pass filter (option below), as due to local resolution variations some parts of the map may be better and other parts may be worse than the overall resolution as measured by the FSC. \
In such cases, set this option to Yes and provide an ad-hoc filter as described below.`
  },
  {
    name: 'low_pass',
    title: 'Ad-hoc low-pass filter (A):',
    widget: 'range',
    default: 5,
    range_min: 1,
    range_max: 40,
    range_step: 1,
    help: `This option allows one to low-pass filter the map at a user-provided frequency (in Angstroms). When using a resolution that is higher than the gold-standard FSC-reported resolution, take care not to interpret noise in the map for signal...`
  },
]

// Local resolution


const post_settings = {
  widget: 'navtab',
  children: sharpen
}

const localres_settings = {
  widget: 'navtab',
  children: []
}

const postprocess_tabs = [
  {
    name: 'do_postprocess',
    title: 'Versions',
    icon: 'bi-file-earmark-text',
    widget: 'navtab',
    default:  true, 
    children: [
      {
        name: 'polish',
        title: 'Bayesian polishing',
        widget: 'radio',
        option: '--do_movies',
        group: 'postprocess',
        help: `If set to Yes, use RELION's own implementation of a MotionCor2-like algorithm by Takanori Nakane. Note that Takanori's program only runs on CPUs but uses multiple threads. Takanori's implementation is most efficient when the number of frames is divisible by the number of threads (e.g. 12 or 18 threads per MPI process for 36 frames). On some machines, setting the OMP_PROC_BIND environmental variable to TRUE accelerates the program.`,
        on_click: (ev) => w_navtab_update({settings: post_settings})
      },
      {
        name: 'sharpen',
        title: 'Sharpening (Relion postprocess)',
        option: '--do_micrographs',
        widget: 'radio',
        group: 'postprocess',
        help: 'Set this to Yes if you plan to use the UCSF implementation. The UCSF-implementation needs a GPU but uses only one CPU thread.',
        on_click: (ev) => w_navtab_update({settings: post_settings})
      },
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
      {
        widget: 'fieldset',
        title: 'Processes and Threads',
        children: [
          mpi_settings,
          thread_settings,
        ]
      },
      queue_settings,
      ...submit_settings
    ]
  }
];

