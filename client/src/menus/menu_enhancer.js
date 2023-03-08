


const enhance_io = [
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
    {
      name: 'do_float16',
      title: 'Write output in float16',
      widget: 'bool',
      default: true ,
      help: `If set to Yes, RelionCor2 will write output images in float16 MRC format. This will save a factor of two in disk space compared to the default of writing in float32. Note that RELION and CCPEM will read float16 images, but other programs may not (yet) do so. For example, Gctf will not work with float16 images. Also note that this option does not work with UCSF MotionCor2. For CTF estimation, use CTFFIND-4.1 with pre-calculated power spectra (activate the 'Save sum of power spectra' option).`,
    }
];

const enhance_tabs = [
  {
    name: 'do_raw',
    title: 'Tools',
    icon: 'bi-wrench-adjustable',
    widget: 'navtab',
    default:  true, 
    children: [
      {
        name: 'motion',
        title: 'Deep Learning Enhancement',
        widget: 'fieldset',
        children: [
          {
            name: 'fn_metadata',
            title: 'Cryo-ZSSR: Multiple Image Super Resolution Using Deep Internal Learning',
            widget: 'radio',
            option: '--fn_model',
            group: 'toolkit',
            help: `Multiple Image Super Resolution Using Deep Internal Learning`,
            on_click: (ev) => w_navtab_update({io: select_io_settings,settings: select_meta_settings})
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
    children: enhance_io
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
      mpi_settings,
      thread_settings,
      queue_settings,
      ...submit_settings
    ]
  }
];




