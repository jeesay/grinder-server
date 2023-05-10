

/*  "Multiple (2D or 3D) references (.star or .mrcs)", */

  
const mpi_settings = {
  name: 'nr_mpi',
  title: 'Number of MPI procs:',
  widget: 'range',
  default: 1, 
  range_min: 1, 
  range_max: 64, 
  range_step: 1, 
  help: `Number of MPI nodes to use in parallel. When set to 1, MPI will not be used. The maximum can be set through environment variable RELION_MPI_MAX.`
};

const thread_settings = {
  name: 'nr_threads',
  title: 'Number of threads:',
  widget: 'range',
  default: 1, 
  range_min: 1, 
  range_max: 16, 
  range_step: 1, 
  help: `Number of shared-memory (POSIX) threads to use in parallel. When set to 1, no multi-threading will be used. The maximum can be set through environment variable RELION_MTHREAD_MAX.`
};

// Pipeline_jobs.cpp lines 900-1015
const queue_settings = {
  name: 'do_queue',
  title:  'Submit to queue?',
  widget: 'switch',
  help: `If set to Yes, the job will be submit to a queue, otherwise \
the job will be executed locally. Note that only MPI jobs may be sent to a queue. The default can be set through the environment variable RELION_QUEUE_USE.`,
  children: [
    {
      name: 'queuename',
      title:  'Queue name',
      widget: 'text',
    },
    {
      name: 'qsub',
      title:  'Queue submit command',
      widget: 'text',
    },
    {
      name: 'qsubscript',
      title:  'Standard submission script',
      widget: 'text',
      help: `"Script Files (*.{csh,sh,bash,script})", ".",
"The template for your standard queue job submission script. \
Its default location may be changed by setting the environment variable RELION_QSUB_TEMPLATE. \
In the template script a number of variables will be replaced: \n \
XXXcommandXXX = relion command + arguments; \n \
XXXqueueXXX = The queue name; \n \
XXXmpinodesXXX = The number of MPI nodes; \n \
XXXthreadsXXX = The number of threads; \n \
XXXcoresXXX = XXXmpinodesXXX * XXXthreadsXXX; \n \
XXXdedicatedXXX = The minimum number of dedicated cores on each node; \n \
XXXnodesXXX = The number of requested nodes = CEIL(XXXcoresXXX / XXXdedicatedXXX); \n \
If these options are not enough for your standard jobs, you may define a user-specified number of extra variables: XXXextra1XXX, XXXextra2XXX, etc. \
The number of extra variables is controlled through the environment variable RELION_QSUB_EXTRA_COUNT. \
Their help text is set by the environment variables RELION_QSUB_EXTRA1, RELION_QSUB_EXTRA2, etc \
For example, setenv RELION_QSUB_EXTRA_COUNT 1, together with setenv RELION_QSUB_EXTRA1 \"Max number of hours in queue\" will result in an additional (text) ein the GUI \
Any variables XXXextra1XXX in the template script will be replaced by the corresponding value.\
Likewise, default values for the extra entries can be set through environment variables RELION_QSUB_EXTRA1_DEFAULT, RELION_QSUB_EXTRA2_DEFAULT, etc. \
But note that (unlike all other entries in the GUI) the extra values are not remembered from one run to the other.`
    },
    {
      name: 'min_dedicated',
      title:  'Minimum dedicated cores per node',
      default: 4,
      widget: 'int',
    },
  ]
};


const submit_settings = [
  {
    name: 'extra_args',
    title:  'Run',
    widget: 'toolbar',
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
    name: 'relion_cli',
    title:  'Check command',
    widget: 'details',
    children: []
  }
];


const compute_settings = [
  {
    name: 'disk',
    title: 'Disk access',
    widget: 'fieldset',
    children: [
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
    ]
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
  }
];

