


const motion_io = [
    {
      name: 'input_star_mics',
      title: 'Input movies STAR file:',
      widget: 'file', 
      filetype : 'NODE_MOVIES_CPIPE', 
      placeholder: 'STAR files (*.star)',
      help: 'A STAR file with all micrographs to run MOTIONCORR on',
    },
    {
      name: 'first_frame_sum',
      title: 'First frame for corrected sum:',
      widget: 'range',
      default: 1, 
      range_min: 1, 
      range_max: 32, 
      range_step: 1, 
      help: 'First frame to use in corrected average (starts counting at 1).',
    },
    {
      name: 'last_frame_sum',
      title: 'Last frame for corrected sum:',
      widget: 'range',
      default: -1, 
      range_min: 0, 
      range_max: 32, 
      range_step: 1, 
      help: `Last frame to use in corrected average. Values equal to or smaller than 0 mean 'use all frames`,
    },
    {
      name: 'eer_grouping',
      title: 'EER fractionation:',
      widget: 'range',
      default:  32, 
      range_min: 1, 
      range_max: 100, 
      range_step: 1, 
      help: `The number of hardware frames to group into one fraction. This option is relevant only for Falcon4 movies in the EER format. Note that all 'frames' in the GUI (e.g. first and last frame for corrected sum, dose per frame) refer to fractions, not raw detector frames. See https://www3.mrc-lmb.cam.ac.uk/relion/index.php/Image_compression#Falcon4_EER for detailed guidance on EER processing.`,
    },

]

const motion_writef16 = {
  name: 'motion_params',
  title: 'Ouput image file format',
  widget: 'fieldset',
  children: [
    {
      name: 'do_float16',
      title: 'Write output in float16',
      widget: 'bool',
      default: true ,
      help: `If set to Yes, RelionCor2 will write output images in float16 MRC format. This will save a factor of two in disk space compared to the default of writing in float32. Note that RELION and CCPEM will read float16 images, but other programs may not (yet) do so. For example, Gctf will not work with float16 images. Also note that this option does not work with UCSF MotionCor2. For CTF estimation, use CTFFIND-4.1 with pre-calculated power spectra (activate the 'Save sum of power spectra' option).`,
    }
  ]
};
  
const motion_settings = {
  name: 'motion_params',
  title: 'Parameters',
  widget: 'fieldset',
  children: [
    // Common arguments RELION and UCSF implementation
    {
      name: 'bfactor',
      title: 'Bfactor:',
      widget: 'range',
      default: 150, 
      range_min: 0, 
      range_max: 1500, 
      range_step: 50,
      help: 'The B-factor that will be applied to the micrographs.',
    },
    {
      name: 'patch_x',
      title: 'Number of patches X:',
      widget: 'int',
      default: 1,
      help: 'Number of patches (in X and Y direction) to apply motioncor2.',
    },
    {
      name: 'patch_y',
      title: 'Number of patches Y:',
      widget: 'int',
      default: 1,
      help: 'Number of patches (in X and Y direction) to apply motioncor2.',
    },
    {
      name: 'group_frames',
      title: 'Group frames:',
      widget: 'range',
      default: 1, 
      range_min: 1, 
      range_max: 5, 
      range_step: 1,
      help: 'Average together this many frames before calculating the beam-induced shifts.',
    },
    {
      name: 'bin_factor',
      title: 'Binning factor:',
      widget: 'range',
      default: 1, 
      range_min: 1, 
      range_max: 2, 
      range_step: 1,
      help: 'Bin the micrographs this much by a windowing operation in the Fourier Tranform. Binning at this level is hard to un-do later on, but may be useful to down-scale super-resolution images. Float-values may be used. Do make sure though that the resulting micrograph size is even.',
    },
    {
      name: 'fn_gain_ref',
      title: 'Gain-reference image:',
      widget: 'file',
      filter: '*.mrc',
      default: '.',
      help: 'Location of the gain-reference file to be applied to the input micrographs. Leave this empty if the movies are already gain-corrected.',
    },
    {
      name: 'gain_rot',
      title: 'Gain rotation:',
      widget: 'select', 
      default: 0,
      help: `Rotate the gain reference by this number times 90 degrees clockwise in relion_display. This is the same as -RotGain in MotionCor2. Note that MotionCor2 uses a different convention for rotation so it says 'counter-clockwise'. Valid values are 0, 1, 2 and 3.`,
      children: [
        {
          name:'no_rot',
          title: 'No rotation',
          widget: 'option',
          value: 0
        },
        {
          name:'rot_90',
          title: '90° rotation',
          widget: 'option',
          value: 1
        },
        {
          name:'rot_180',
          title: '180° rotation',
          widget: 'option',
          value: 2
        },
        {
          name:'rot_1270',
          title: '270° rotation',
          widget: 'option',
          value: 3
        },
      ]
    },
    {
      name: 'gain_flip',
      title: 'Gain flip:',
      widget: 'select', 
      default: 0,
      help: 'Flip the gain reference after rotation. This is the same as -FlipGain in MotionCor2. 0 means do nothing, 1 means flip Y (upside down) and 2 means flip X (left to right).',
      children: [
        {
          name:'no_flip',
          title: 'No flip',
          widget: 'option',
          value: 0
        },
        {
          name:'y_flip',
          title: 'Flip Y (upside down)',
          widget: 'option',
          value: 1
        },
        {
          name:'x_flip',
          title: 'Flip X (left to right)',
          widget: 'option',
          value: 2
        },
      ]
    },
  ]
};

const ucsf_exec = [
    // UCSF-wrapper
    {
      name: 'fn_motioncor2_exe',
      title: 'MOTIONCOR2 executable:',
      widget: 'text',
      default: 'default_location',
      help: 'Location of the MOTIONCOR2 executable. You can control the default of this field by setting environment variable RELION_MOTIONCOR2_EXECUTABLE, or by editing the first few lines in src/gui_jobwindow.h and recompile the code.',
    },
    {
      name: 'fn_defect',
      title: 'Defect file:',
      widget: 'file',
      help: `Location of a UCSF MotionCor2-style defect text file or a defect map that describe the defect pixels on the detector. Each line of a defect text file should contain four numbers specifying x, y, width and height of a defect region. A defect map is an image (MRC or TIFF), where 0 means good and 1 means bad pixels. The coordinate system is the same as the input movie before application of binning, rotation and/or flipping.
      Note that the format of the defect text is DIFFERENT from the defect text produced by SerialEM! One can convert a SerialEM-style defect file into a defect map using IMOD utilities e.g. "clip defect -D defect.txt -f tif movie.mrc defect_map.tif". See explanations in the SerialEM manual.

    Leave empty if you don't have any defects, or don't want to correct for defects on your detector.`,
    },
    {
      name: 'gpu_ids',
      title: 'Which GPUs to use:',
      widget: 'text',
      default: '0',
      help: `Provide a list of which GPUs (0,1,2,3, etc) to use. MPI-processes are separated by ':'. For example, to place one rank on device 0 and one rank on device 1, provide '0:1'.
Note that multiple MotionCor2 processes should not share a GPU; otherwise, it can lead to crash or broken outputs (e.g. black images) .`,
    },
    {
      name: 'other_motioncor2_args',
      title: 'Other MOTIONCOR2 arguments',
      widget: 'text',
      default: '',
      help: 'Additional arguments that need to be passed to MOTIONCOR2.',
     },
];
  
const dose_weight = {
    name: 'do_dose_weighting',
    title: 'Do dose-weighting?',
    widget: 'switch',
    default: true ,
    help: 'If set to Yes, the averaged micrographs will be dose-weighted.',
    children: [
      {
        name: 'do_save_noDW',
        title: 'Save non-dose weighted as well?',
        widget: 'bool',
        default: false,
        help: 'Aligned but non-dose weighted images are sometimes useful in CTF estimation, although there is no difference in most cases. Whichever the choice, CTF refinement job is always done on dose-weighted particles.',
      },
      {
        name: 'dose_per_frame',
        title: 'Dose per frame (e/A2):',
        widget: 'range',
        default: 1, 
        range_min: 0, 
        range_max: 5, 
        range_step: 0.2,
        help: 'Dose per movie frame (in electrons per squared Angstrom).',
      },
      {
        name: 'pre_exposure',
        title: 'Pre-exposure (e/A2):',
        widget: 'range',
        default: 0, 
        range_min: 0, 
        range_max: 5, 
        range_step: 0.5,
        help: 'Pre-exposure dose (in electrons per squared Angstrom).',
      },
      {
        name: 'do_save_ps',
        title: 'Save sum of power spectra?',
        widget: 'bool',
        default: true,
        help: 'Sum of non-dose weighted power spectra provides better signal for CTF estimation. The power spectra can be used by CTFFIND4 but not by GCTF. This option is not available for UCSF MotionCor2. You must use this option when writing in float16.',
      },
      {
        name: 'group_for_ps',
        title: 'Sum power spectra every e/A2:',
        widget: 'range',
        default: 4, 
        range_min: 0, 
        range_max: 10, 
        range_step: 0.5,
        help: 'McMullan et al (Ultramicroscopy, 2015) sugggest summing power spectra every 4.0 e/A2 gives optimal Thon rings',
       },
    ]
}


const relioncor2_settings = {
  children: [motion_writef16,motion_settings,dose_weight]
}

const relioncor2_nodose_settings = {
  children: [motion_writef16,motion_settings]
}

const ucsf_settings = {
  children: [...ucsf_exec, motion_settings,dose_weight]
}

const ucsf_nodose_settings = {
  children: [...ucsf_exec, motion_settings]
}

const motioncor_tabs = [
  {
    name: 'do_raw',
    title: 'Tools',
    icon: 'bi-wrench-adjustable',
    widget: 'navtab',
    default:  true, 
    children: [
      {
        name: 'motion',
        title: 'Relion Motioncor2-like implementation',
        widget: 'fieldset',
        children: [
          {
            name: 'relioncor2',
            title: 'Motion correction',
            widget: 'radio',
            option: '--do_movies',
            group: 'motioncor',
            help: `If set to Yes, use RELION's own implementation of a MotionCor2-like algorithm by Takanori Nakane. Note that Takanori's program only runs on CPUs but uses multiple threads. Takanori's implementation is most efficient when the number of frames is divisible by the number of threads (e.g. 12 or 18 threads per MPI process for 36 frames). On some machines, setting the OMP_PROC_BIND environmental variable to TRUE accelerates the program.`,
            on_click: (ev) => w_navtab_update({settings: relioncor2_settings})
          },
        ]
      },
      {
        name: 'motion',
        title: 'UCSF Implementation',
        widget: 'fieldset',
        children: [
          {
            name: 'uscf',
            title: 'UCSF MotionCor2 implementation',
            option: '--do_micrographs',
            widget: 'radio',
            group: 'motioncor',
            help: 'Set this to Yes if you plan to use the UCSF implementation. The UCSF-implementation needs a GPU but uses only one CPU thread.',
            on_click: (ev) => w_navtab_update({settings: ucsf_settings})
          },
        ]
      }
    ]
  },
  {
    name: 'io',
    icon: 'bi-arrow-down-up',
    title: 'I/O',
    widget: 'navtab',
    children: motion_io
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
        name: 'processes',
        title: 'Processes',
        widget: 'fieldset',
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




