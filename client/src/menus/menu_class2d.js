const em_algo = [
  {
    name: 'nr_iter_em',
    title: 'Number of EM iterations:',
    widget: 'range',
    default: 25, 
    range_min: 1, 
    range_max: 50, 
    range_step: 1, 
    help: 'Number of EM iterations to be performed. \
Note that the current implementation of 2D class averaging and 3D classification does NOT comprise a convergence criterium. \
Therefore, the calculations will need to be stopped by the user if further iterations do not yield improvements in resolution or classes. \n\n \
Also note that upon restarting, the iteration number continues to be increased, starting from the final iteration in the previous run. \
The number given here is the TOTAL number of iterations. For example, if 10 iterations have been performed previously and one restarts to perform \
an additional 5 iterations (for example with a finer angular sampling), then the number given here should be 10+5=15.'
  },
];

const vdam_algo = [
/*
  {
    name: 'do_grad',
    title: 'Use VDAM algorithm?',
    widget: 'bool',
    default: true, 
    help: 'If set to Yes, the faster VDAM algorithm will be used. This algorithm was introduced with relion-4.0. If set to No, then the slower EM algorithm needs to be used.'
  },
*/
  {
    name: 'nr_iter_grad',
      title: 'Number of VDAM mini-batches:',
    widget: 'range',
    default: 200, 
    range_min: 50, 
    range_max: 500, 
    range_step: 10, 
    help: 'Number of mini-batches to be processed using the VDAM algorithm. Using 200 has given good results for many data sets. Using 100 will run faster, at the expense of some quality in the results.'
  },
];

const class2d_io = [
  {
    name: 'fn_img',
    title: 'Input images STAR file:',
    widget: 'file',
    filetype: 'NODE_PARTS_CPIPE',
    placeholder: 'STAR files (*.star). Image stacks (not recommended, read help!) (*.{spi,mrcs})',
    help:`A STAR file with all images (and their metadata).

Alternatively, you may give a Spider/MRC stack of 2D images, but in that case NO metadata can be included and thus NO CTF correction can be performed,
nor will it be possible to perform noise spectra estimation or intensity scale corrections in image groups. Therefore, running RELION with an input stack will in general provide sub-optimal results and is therefore not recommended!! Use the Preprocessing procedure to get the input STAR file in a semi-automated manner. Read the RELION wiki for more information.`
  },
  {
    name: 'fn_cont',
    title: 'Continue from here:',
    widget: 'file',
    filetype: 'CURRENT_ODIR',
    default: '', 
    placeholder: 'STAR Files (*_optimiser.star)',
    help:  `Select the *_optimiser.star file for the iteration
from which you want to continue a previous run.
Note that the Output rootname of the continued run and the rootname of the previous run cannot be the same.
If they are the same, the program will automatically add a '_ctX' to the output rootname,
with X being the iteration from which one continues the previous run.`
  },
];

const class2d_ctf = {
  name: 'do_ctf_correction',
  title: 'Do CTF-correction?',
  widget: 'switch',
  default: true, 
  help:`If set to Yes, CTFs will be corrected inside the MAP refinement.
    The resulting algorithm intrinsically implements the optimal linear, or Wiener filter.
    Note that CTF parameters for all images need to be given in the input STAR file.
    The command 'relion_refine --print_metadata_labels' will print a list of all possible metadata labels for that STAR file.
    See the RELION Wiki for more details.\n\n Also make sure that the correct pixel size (in Angstrom) is given above!)`,
  children: [
    {
      name: 'ctf_intact_first_peak',
      title: 'Ignore CTFs until first peak?',
      widget: 'bool',
      default: false, 
      help: `If set to Yes, then CTF-amplitude correction will \
    only be performed from the first peak of each CTF onward. This can be useful if the CTF model is inadequate at the lowest resolution. \
    Still, in general using higher amplitude contrast on the CTFs (e.g. 10-20%) often yields better results. \
    Therefore, this option is not generally recommended: try increasing amplitude contrast (in your input STAR file) first!`
    },
  ]
}

const class2d_sampling = {
  name: 'dont_skip_align',
  title: 'Perform image alignment?',
  widget: 'switch',
  default: true,
  help: `If set to No, then rather than 
  performing both alignment and classification, only classification will be performed. This allows the use of very focused masks.
  This requires that the optimal orientations of all particles are already stored in the input STAR file. `,
  children: [
    {
      name: 'psi_sampling',
      title: 'In-plane angular sampling:',
      widget: 'range',
      default: 6., 
      range_min: 0.5, 
      range_max: 20, 
      range_step: 0.5, 
      help: 'The sampling rate for the in-plane rotation angle (psi) in degrees. \
  Using fine values will slow down the program. Recommended value for most 2D refinements: 5 degrees.\n\n \
  If auto-sampling is used, this will be the value for the first iteration(s) only, and the sampling rate will be increased automatically after that.'
    },
    {
      name: 'offset_range',
      title: 'Offset search range (pix):',
      widget: 'range',
      default: 5, 
      range_min: 0, 
      range_max: 30, 
      range_step: 1, 
      help: 'Probabilities will be calculated only for translations \
  in a circle with this radius (in pixels). The center of this circle changes at every iteration and is placed at the optimal translation \
  for each image in the previous iteration.\n\n \
  If auto-sampling is used, this will be the value for the first iteration(s) only, and the sampling rate will be increased automatically after that.'
    },
    {
      name: 'offset_step',
      title: 'Offset search step (pix):',
      widget: 'range',
      default: 1, 
      range_min: 0.1, 
      range_max: 5, 
      range_step: 0.1, 
      help: 'Translations will be sampled with this step-size (in pixels).\
  Translational sampling is also done using the adaptive approach. \
  Therefore, if adaptive=1, the translations will first be evaluated on a 2x coarser grid.\n\n \
  If auto-sampling is used, this will be the value for the first iteration(s) only, and the sampling rate will be increased automatically after that.'
    },
    {
      name: 'allow_coarser',
      title: 'Allow coarser sampling?',
      widget: 'bool',
      default: false, 
      help: 'If set to Yes, the program will use coarser angular and translational samplings if the estimated accuracies of the assignments is still low in the earlier iterations. This may speed up the calculations.'
    },
  ]
};

const class2d_optim_k = [
  {
    name: 'nr_classes',
    title: 'Number of classes:',
    widget: 'range',
    default: 1, 
    range_min: 1, 
    range_max: 50, 
    range_step: 1, 
    help: `The number of classes (K) for a multi-reference refinement. \
These classes will be made in an unsupervised manner from a single reference by division of the data into random subsets during the first iteration.`
  },
  {
    name: 'tau_fudge',
    title: 'Regularisation parameter T:',
    widget: 'range',
    default: 2 , 
    range_min: 0.1, 
    range_min: 10, 
    range_min: 0.1, 
    help: `Bayes law strictly determines the relative weight between \
the contribution of the experimental data and the prior. However, in practice one may need to adjust this weight to put slightly more weight on \
the experimental data to allow optimal results. Values greater than 1 for this regularisation parameter (T in the JMB2011 paper) put more \
weight on the experimental data. Values around 2-4 have been observed to be useful for 3D refinements, values of 1-2 for 2D refinements. \
Too small values yield too-low resolution structures; too high values result in over-estimated resolutions, mostly notable by the apparition of high-frequency noise in the references.`
  }
];

const class2d_optim_ptcls = [
  {
    name: 'particle_diameter',
    title: 'Mask diameter (A):',
    widget: 'range',
    default: 200, 
    range_min: 0, 
    range_max: 1000, 
    range_step: 10, 
    help: 'The experimental images will be masked with a soft \
circular mask with this diameter. Make sure this radius is not set too small because that may mask away part of the signal! \
If set to a value larger than the image size no masking will be performed.\n\n\
The same diameter will also be used for a spherical mask of the reference structures if no user-provided mask is specified.'
  },
  {
    name: 'do_zero_mask',
    title: 'Mask individual particles with zeros?',
    widget: 'bool',
    default: true, 
    help: 'If set to Yes, then in the individual particles, \
the area outside a circle with the radius of the particle will be set to zeros prior to taking the Fourier transform. \
This will remove noise and therefore increase sensitivity in the alignment and classification. However, it will also introduce correlations \
between the Fourier components that are not modelled. When set to No, then the solvent area is filled with random noise, which prevents introducing correlations.\
High-resolution refinements (e.g. ribosomes or other large complexes in 3D auto-refine) tend to work better when filling the solvent area with random noise (i.e. setting this option to No), refinements of smaller complexes and most classifications go better when using zeros (i.e. setting this option to Yes).'
  },
  {
    name: 'highres_limit',
    title: 'Limit resolution E-step to (A):',
    widget: 'range',
    default:  -1, 
    range_min: -1, 
    range_max: 20, 
    range_step: 1, 
    help: 'If set to a positive number, then the expectation step (i.e. the alignment) will be done only including the Fourier components up to this resolution (in Angstroms). \
This is useful to prevent overfitting, as the classification runs in RELION are not to be guaranteed to be 100% overfitting-free (unlike the 3D auto-refine with its gold-standard FSC). In particular for very difficult data sets, e.g. of very small or featureless particles, this has been shown to give much better class averages. \
In such cases, values in the range of 7-12 Angstroms have proven useful.'
  },
  {
    name: 'do_center',
    title: 'Center class averages?',
    widget: 'bool',
    default: true, 
    help: 'If set to Yes, every iteration the class average images will be centered on their center-of-mass. This will only work for positive signals, so the particles should be white.'
  }
];

const class2d_optim_em = {
  name: 'optimizer',
  title: 'Optimisation',
  widget: 'fieldset',
  children: [
    ...class2d_optim_k,
    ...em_algo,
    ...class2d_optim_ptcls
  ]
};

const class2d_optim_vdam = {
  name: 'optimizer',
  title: 'Optimisation',
  widget: 'fieldset',
  children: [
    ...class2d_optim_k,
    ...vdam_algo,
    ...class2d_optim_ptcls
  ]
};

const class2d_ptcls_em_tab = {
  widget: 'navtab',
  children: [
    class2d_ctf,
    class2d_optim_em,
    class2d_sampling,
  ]
}

const class2d_ptcls_vdam_tab = {
  widget: 'navtab',
  children: [
    class2d_ctf,
    class2d_optim_vdam,
    class2d_sampling,
  ]
}


const compute_tab = [
  {
    name: 'do_parallel_discio',
    title: 'Use parallel disc I/O?',
    widget: 'bool',
    default: true, 
    help: 'If set to Yes, all MPI followers will read images from disc. \
Otherwise, only the leader will read images and send them through the network to the followers. Parallel file systems like gluster of fhgfs are good at parallel disc I/O. NFS may break with many followers reading in parallel. If your datasets contain particles with different box sizes, you have to say Yes.'
  },
  {
    name: 'nr_pool',
    title: 'Number of pooled particles:',
    widget: 'range',
    default: 3, 
    range_min: 1, 
    range_max: 16, 
    range_step: 1, 
    help: 'Particles are processed in individual batches by MPI followers. During each batch, a stack of particle images is only opened and closed once to improve disk access times. \
All particle images of a single batch are read into memory together. The size of these batches is at least one particle per thread used. The nr_pooled_particles parameter controls how many particles are read together for each thread. If it is set to 3 and one uses 8 threads, batches of 3x8=24 particles will be read together. \
This may improve performance on systems where disk access, and particularly metadata handling of disk access, is a problem. It has a modest cost of increased RAM usage.'
  },
  {
    name: 'do_preread_images',
    title: 'Pre-read all particles into RAM?',
    widget: 'bool',
    defaut: false, 
    help: 'If set to Yes, all particle images will be read into computer memory, which will greatly speed up calculations on systems with slow disk access. However, one should of course be careful with the amount of RAM available. \
Because particles are read in float-precision, it will take ( N * box_size * box_size * 4 / (1024 * 1024 * 1024) ) Giga-bytes to read N particles into RAM. For 100 thousand 200x200 images, that becomes 15Gb, or 60 Gb for the same number of 400x400 particles. \
Remember that running a single MPI follower on each node that runs as many threads as available cores will have access to all available RAM. \n \n If parallel disc I/O is set to No, then only the leader reads all particles into RAM and sends those particles through the network to the MPI followers during the refinement iterations.'
  },
  {
    name: 'scratch_dir',
    title: 'Copy particles to scratch directory:',
    widget: 'file',
    default: 'default_scratch', 
    help: 'If a directory is provided here, then the job will create a sub-directory in it called relion_volatile. If that relion_volatile directory already exists, it will be wiped. Then, the program will copy all input particles into a large stack inside the relion_volatile subdirectory. \
Provided this directory is on a fast local drive (e.g. an SSD drive), processing in all the iterations will be faster. If the job finishes correctly, the relion_volatile directory will be wiped. If the job crashes, you may want to remove it yourself.'
  },
  {
    name: 'do_combine_thru_disc',
    title: 'Combine iterations through disc?',
    widget: 'bool',
    default: false, 
    help: 'If set to Yes, at the end of every iteration all MPI followers will write out a large file with their accumulated results. The MPI leader will read in all these files, combine them all, and write out a new file with the combined results. \
All MPI salves will then read in the combined results. This reduces heavy load on the network, but increases load on the disc I/O. \
This will affect the time it takes between the progress-bar in the expectation step reaching its end (the mouse gets to the cheese) and the start of the ensuing maximisation step. It will depend on your system setup which is most efficient.'
  },
  {
    name: 'use_gpu',
    title: 'Use GPU acceleration?',
    widget: 'switch',
    default: false, 
    help: 'If set to Yes, the job will try to use GPU acceleration.',
    children: [
      {
        name: 'gpu_ids',
        title: 'Which GPUs to use:',
        widget: 'text',
        default: '', 
        help: `This argument is not necessary. If left empty, the job itself will try to allocate available GPU resources. You can override the default allocation by providing a list of which GPUs (0,1,2,3, etc) to use. MPI-processes are separated by ':', threads by ','. For example: '0,0:1,1:0,0:1,1'`
      },
    ]
  },
];


const class2d_io_tab = {
  widget: 'navtab',
  children: class2d_io
}

const class2d_tabs = [
  {
    name: 'methods',
    icon: 'bi-wrench-adjustable',
    title: 'Tools',
    widget: 'navtab',
    children: [
      {
        name: 'class2d_ptcls',
        title: 'Particles',
        widget: 'fieldset',
        children: [
          {
            name: 'do_em',
            title: '2D classification of Particles with EM algorithm',
            widget: 'radio',
            option: '--fn_model',
            group: 'toolkit',
            help: `If set to Yes, the slower expectation-maximization algorithm will be used. This was the default option in releases prior to 4.0-beta. If set to No, then one needs to use the (faster) VDAM (variable metric gradient descent with adaptive moments) algorithm below. will be used.`,
            on_click: (ev) => w_navtab_update({io: class2d_io_tab, settings: class2d_ptcls_em_tab})
          },
          {
            name: 'do_grad',
            title: '2D classification of Particles with VDAM algorithm',
            widget: 'radio',
            option: '--fn_model',
            group: 'toolkit',
            help: `If set to Yes, the faster VDAM algorithm will be used. This algorithm was introduced with relion-4.0. If set to No, then the slower EM algorithm needs to be used.`,
            on_click: (ev) => w_navtab_update({io: class2d_io_tab, settings: class2d_ptcls_vdam_tab})
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
    name: 'compute',
    icon: 'bi-cpu',
    title: 'Compute',
    widget: 'navtab',
    children: compute_tab
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
  },
  {
    name:'result',
    icon: 'bi-eye',
    title: 'Result',
    widget: 'navtab',
    children: []
  }
];

