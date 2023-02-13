
hidden_name = ".gui_ctffind";

const generic = [
  {
    name: 'input_star_mics',
    title: 'Input micrographs STAR file:',
    widget: 'file',
    filetype: 'NODE_MICS_CPIPE',
    placeholder: 'STAR files (*.star)',
    help: `A STAR file with all micrographs to run CTFFIND or Gctf on`,
  },
  {
    name: 'use_noDW',
    title: 'Use micrograph without dose-weighting?',
    widget: 'bool',
    default: false',
    help: `If set to Yes, the CTF estimation will be done using the micrograph without dose-weighting as in rlnMicrographNameNoDW (_noDW.mrc from MotionCor2). If set to No, the normal rlnMicrographName will be used.`,
  },

  {
    name: 'do_phaseshift',
    title: 'Estimate phase shifts?',
    widget: 'bool',
    default: false',
    help: `If set to Yes, CTFFIND4 will estimate the phase shift, e.g. as introduced by a Volta phase-plate`,
  },
  {
    name: 'phase_min',
    title: 'Phase shift (deg) - Min:',
    widget: 'float',
    default: 0,
    help: `Minimum, maximum and step size (in degrees) for the search of the phase shift`,
  },
  {
    name: 'phase_max',
    title: 'Phase shift (deg) - Max:',
    widget: 'float',
    default: 180,
    help: `Minimum, maximum and step size (in degrees) for the search of the phase shift`,
  },
  {
    name: 'phase_step',
    title: 'Phase shift (deg) - Step:',
    widget: 'float',
    default: 10',
    help: `Minimum, maximum and step size (in degrees) for the search of the phase shift`,
  },
  {
    name: 'dast',
    title: 'Amount of astigmatism (A):',
    widget: 'range',
    default: 100, 
    range_min: 0, 
    range_max: 2000, 
    range_step: 100,
    help: `CTFFIND's dAst parameter, GCTFs -astm parameter`,
  },
];

// CTFFIND options
// Check for environment variable RELION_CTFFIND_EXECUTABLE
const ctffind4 = [
  {
    name: 'use_ctffind4',
    title: 'Use CTFFIND-4.1?',
    widget: 'bool',
    default: false',

  },
  {
    name: 'use_given_ps',
    title: 'Use power spectra from MotionCorr job?',
    widget: 'bool',
    default: true',
    help: `If set to Yes, the CTF estimation will be done using power spectra calculated during motion correction. You must use this option if you used float16 in motion correction.`,
  },
  {
    name: 'fn_ctffind_exe',
    title: 'CTFFIND-4.1 executable:',
    widget: 'bool',
    default: std::string(default_location)',
    help: `*',
    help: `.',
    help: `Location of the CTFFIND (release 4.1 or later) executable. You can control the default of this field by setting environment variable RELION_CTFFIND_EXECUTABLE, or by editing the first few lines in src/gui_jobwindow.h and recompile the code.`,
  },
  {
    name: 'slow_search',
    title: 'Use exhaustive search?',
    widget: 'bool',
    default: false',
    help: `If set to Yes, CTFFIND4 will use slower but more exhaustive search. This option is recommended for CTFFIND version 4.1.8 and earlier, but probably not necessary for 4.1.10 and later. It is also worth trying this option when astigmatism and/or phase shifts are difficult to fit.`,
  },
  {
    name: 'box',
    title: 'FFT box size (pix):',
    widget: 'bool',
    default: 512, 64, 1024, 8',
    help: `CTFFIND's Box parameter`,
  },
  {
    name: 'resmin',
    title: 'Minimum resolution (A):',
    widget: 'bool',
    default: 30, 10, 200, 10',
    help: `CTFFIND's ResMin parameter`,
  },
  {
    name: 'resmax',
    title: 'Maximum resolution (A):',
    widget: 'bool',
    default: 5, 1, 20, 1',
    help: `CTFFIND's ResMax parameter`,
  },
  {
    name: 'dfmin',
    title: 'Minimum defocus value (A):',
    widget: 'bool',
    default: 5000, 0, 25000, 1000',
    help: `CTFFIND's dFMin parameter`,
  },
  {
    name: 'dfmax',
    title: 'Maximum defocus value (A):',
    widget: 'bool',
    default: 50000, 20000, 100000, 1000',
    help: `CTFFIND's dFMax parameter`,
  },
  {
    name: 'dfstep',
    title: 'Defocus step size (A):',
    widget: 'bool',
    default: 500, 200, 2000, 100,"CTFFIND's FStep parameter`,
  },

  {
    name: 'ctf_win',
    title: 'Estimate CTF on window size (pix) ',
    widget: 'bool',
    default: -1, -16, 4096, 16',
    help: `If a positive value is given, a squared window of this size at the center of the micrograph will be used to estimate the CTF. This may be useful to exclude parts of the micrograph that are unsuitable for CTF estimation, e.g. the labels at the edge of phtographic film. \n \n The original micrograph will be used (i.e. this option will be ignored) if a negative value is given.`,
  },
];

const gctf = [
  {
    name: 'fn_gctf_exe',
    title: 'Gctf executable:',
    widget: 'text',
    default: 'default_location',
    help: `Location of the Gctf executable. You can control the default of this field by setting environment variable RELION_GCTF_EXECUTABLE, or by editing the first few lines in src/gui_jobwindow.h and recompile the code.`,
  },
  {
    name: 'do_ignore_ctffind_params',
    title: `Ignore 'Searches' parameters?`,
    widget: 'bool',
    default: true',
    help: `If set to Yes, all parameters EXCEPT for phase shift search and its ranges on the 'Searches' tab will be ignored, and Gctf's default parameters will be used (box.size=1024; min.resol=50; max.resol=4; min.defocus=500; max.defocus=90000; step.defocus=500; astigm=1000) \n \
\nIf set to No, all parameters on the CTFFIND tab will be passed to Gctf.`,
  },
  {
    name: 'do_EPA',
    title: 'Perform equi-phase averaging?',
    widget: 'bool',
    default: false',
    help: `If set to Yes, equi-phase averaging is used in the defocus refinement, otherwise basic rotational averaging will be performed.`,
  },
  {
    name: 'other_gctf_args',
    title: 'Other Gctf options:',
    widget: 'bool',
    default: std::string("")',
    help: `Provide additional gctf options here.`,
  },
  {
    name: 'gpu_ids',
    title: 'Which GPUs to use:',
    widget: 'bool',
    default: std::string("")',
    help: `This argument is not necessary. If left empty, the job itself will try to allocate available GPU resources. You can override the default allocation by providing a list of which GPUs (0,1,2,3, etc) to use. MPI-processes are separated by ':', threads by ','. `,
  },
];

const ctfrefine = [
  // I/O
  {
    name: 'fn_data',
    title: 'Particles (from Refine3D):',
    filetype: 'NODE_PARTS_CPIPE',
    placeholder: 'STAR files (*.star)',
    help: `The input STAR file with the metadata of all particles.`,
  },
  {
    name: 'fn_post',
    title: 'Postprocess STAR file:',
    filetype: 'OUTNODE_POST',
    placeholder : 'STAR files (postprocess.star)',
    help: `The STAR file generated by a PostProcess job. \
The mask used for this postprocessing will be applied to the unfiltered half-maps and should encompass the entire complex. The resulting FSC curve will be used for weighting the different frequencies. \n \n Note that for helices it is common practice to use a mask only encompassing the central 30% or so of the box. \
This gives higher resolution estimates, as it disregards ill-defined regions near the box edges. However, for ctf_refine it is better to use a mask encompassing (almost) the entire box, as otherwise there may not be enough signal.`,
  },
  {
    name: 'minres',
    title: 'Minimum resolution for fits (A):',
    widget: 'range',
    default: 30, 
    range_min: 8, 
    range_max: 40, 
    range_step: 1, 
    help: `The minimum spatial frequency (in Angstrom) used in the beamtilt fit.`,
  },

// Defocus fit
  {
    name: 'do_ctf',
    title: 'Perform CTF parameter fitting?',
    widget: 'bool',
    default: true, 
    help: `If set to Yes, then relion_ctf_refine will be used to estimate the selected parameters below.`,
  },
  {
    name: 'fitting',
    widget: 'select',
    help: 'Perform CTF parameter fitting',
    children: [
      {
        name: 'no_fitting',
        title: 'No CTF parameter fitting', 
        widget: 'options',
        option: 'job_ctffit_options', 
        default: true, 
        help: `If set to Yes, then relion_ctf_refine will be used to estimate the selected parameters below.`
      },
      {
        name: 'do_defocus',
        title: 'Fit defocus?', 
        widget: 'options',
        option: 'job_ctffit_options', 
        default: 0, 
        help: `If set to per-particle or per-micrograph, then relion_ctf_refine will estimate defocus values.`,
      },
      {
        name: 'do_astig',
        title: 'Fit astigmatism?", job_ctffit_options, 0, "If set to per-particle or per-micrograph, then relion_ctf_refine will estimate astigmatism.`,
      },
      {
        name: 'do_bfactor',
        title: 'Fit B-factor?", job_ctffit_options, 0, "If set to per-particle or per-micrograph, then relion_ctf_refine will estimate B-factors that describe the signal falloff.`,
      },
      {
        name: 'do_phase',
        title: 'Fit phase-shift?", job_ctffit_options, 0, "If set to per-particle or per-micrograph, then relion_ctf_refine will estimate (VPP?) phase shift values.`,
      },
    ]
  },

  // aberrations
  {
    name: 'do_aniso_mag',
    title: 'Estimate (anisotropic) magnification?',
    widget: 'bool',
    default: false, 
    help: `If set to Yes, then relion_ctf_refine will also estimate the (anisotropic) magnification per optics group. \
This option cannot be done simultaneously with higher-order aberration estimation. It's probably best to estimate the one that is most off first, and the other one second. It might be worth repeating the estimation if both are off.`,
  },
  {
    name: 'do_tilt',
    title: 'Estimate beamtilt?',
    widget: 'bool',
    default: false, 
    help: `If set to Yes, then relion_ctf_refine will also estimate the beamtilt per optics group. This option is only recommended for data sets that extend beyond 4.5 Angstrom resolution.`,
  },
  {
    name: 'do_trefoil',
    title: 'Also estimate trefoil?',
    widget: 'bool',
    default: false, 
    help: `If set to Yes, then relion_ctf_refine will also estimate the trefoil (3-fold astigmatism) per optics group. This option is only recommended for data sets that extend beyond 3.5 Angstrom resolution.`,
  },
  {
    name: 'do_4thorder',
    title: 'Estimate 4th order aberrations?',
    widget: 'bool',
    default: false, 
    help: `If set to Yes, then relion_ctf_refine will also estimate the Cs and the tetrafoil (4-fold astigmatism) per optics group. This option is only recommended for data sets that extend beyond 3 Angstrom resolution.`,
  },
}
]

const ctffind_tabs = [
  {
    name: 'class2d_tools',
    icon: 'bi-wrench-adjustable',
    title: 'Tools',
    widget: 'navtab',
    children: [
      {
        name: 'class2d_particles',
        title: 'CTF Estimation',
        widget: 'fieldset',
        children: [
          {
            name: 'use_ctffind4',
            title: 'CTF with CTFFIND 4.1',
            widget: 'radio',
            option: '--use_ctffind4',
            group: 'toolkit',
            help: `If set to Yes, the wrapper will use CTFFIND4 (version 4.1) for CTF estimation. This includes thread-support, calculation of Thon rings from movie frames and phase-shift estimation for phase-plate data.`,
            on_click: (ev) => w_navtab_update({settings: ctffind4})
          },
          {
            name: 'use_gctf',
            title: 'CTF with gctf',
            widget: 'radio',
            option: '--use_gctf',
            group: 'toolkit',
            help: `If set to Yes, Kai Zhang's Gctf program (which runs on NVIDIA GPUs) will be used instead of Niko Grigorieff's CTFFIND4.`,
            on_click: (ev) => w_navtab_update({settings: gctf})
          },
        ]
      },
      {
        name: 'class2d_particles',
        title: 'CTF Refinement',
        widget: 'fieldset',
        children: []
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
    name: 'compute',
    icon: 'bi-cpu',
    title: 'Compute',
    widget: 'navtab',
    children: compute_tabs
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
      {
        name: 'command',
        title:  'Check command',
        widget: 'details',
        children: []
      },
    ]
  }
];



