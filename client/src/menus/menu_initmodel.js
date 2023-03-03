
const abinitio_io = [
  {
    name: 'fn_img',
    title:'Input images STAR file:',
    widget: 'file',
    filetype: 'NODE_PARTS_CPIPE',
    placeholder:'STAR files (*.star) Image stacks (not recommended, read help!) (*.{spi,mrcs})',
    help:`A STAR file with all images (and their metadata). \
In Gradient optimisation, it is very important that there are particles from enough different orientations. One only needs a few thousand to 10k particles. When selecting good 2D classes in the Subset Selection jobtype, use the option to select a maximum number of particles from each class to generate more even angular distributions for SGD.\
\n \n Alternatively, you may give a Spider/MRC stack of 2D images, but in that case NO metadata can be included and thus NO CTF correction can be performed, \
nor will it be possible to perform noise spectra estimation or intensity scale corrections in image groups. Therefore, running RELION with an input stack will in general provide sub-optimal results and is therefore not recommended!! Use the Preprocessing procedure to get the input STAR file in a semi-automated manner. Read the RELION wiki for more information.`,
  },
  {
    name: 'fn_cont',
    title:'Continue from here: ',
    widget: 'file',
    default: '', 
    placeholder: 'STAR Files (*_optimiser.star)',
    filetype:'CURRENT_ODIR',
    help:`Select the *_optimiser.star file for the iteration \
from which you want to continue a previous run. \
Note that the Output rootname of the continued run and the rootname of the previous run cannot be the same. \
If they are the same, the program will automatically add a '_ctX' to the output rootname, \
with X being the iteration from which one continues the previous run.`,
  },
];

const abinitio  = [
  {
    name: 'nr_iter',
    title:'Number of VDAM mini-batches:',
    widget: 'range',
    default: 200, 
    range_min: 50, 
    range_max: 500, 
    range_step: 10, 
    help: `How many iterations (i.e. mini-batches) to perform with the VDAM algorithm?`,
  },
  {
    name: 'tau_fudge',
    title:'Regularisation parameter T:',
    widget: 'range',
    default: 4 , 
    range_min: 0.1, 
    range_max: 10, 
    range_step: 0.1, 
    help: `Bayes law strictly determines the relative weight between \
the contribution of the experimental data and the prior. However, in practice one may need to adjust this weight to put slightly more weight on \
the experimental data to allow optimal results. Values greater than 1 for this regularisation parameter (T in the JMB2011 paper) put more \
weight on the experimental data. Values around 2-4 have been observed to be useful for 3D initial model calculations`,
  },
  {
    name: 'nr_classes',
    title:'Number of classes:',
    widget: 'range',
    default: 1, 
    range_min: 1, 
    range_max: 50, 
    range_step: 1, 
    help: `The number of classes (K) for a multi-reference ab initio SGD refinement. \
These classes will be made in an unsupervised manner, starting from a single reference in the initial iterations of the SGD, and the references will become increasingly dissimilar during the inbetween iterations.`,
  },
  {
    name: 'sym_name',
    title:'Symmetry:',
    widget: 'text',
    default: 'C1', 
    help: `The initial model is always generated in C1 and then aligned to and symmetrized with the specified point group. If the automatic alignment fails, please manually rotate run_itNNN_class001.mrc (NNN is the number of iterations) so that it conforms the symmetry convention.`,
  },
  {
    name: 'do_run_C1',
    title:'Run in C1 and apply symmetry later? ',
    widget: 'bool',
    default: true, 
    help: `If set to Yes, the gradient-driven optimisation is run in C1 and the symmetry orientation is searched and applied later. If set to No, the entire optimisation is run in the symmetry point group indicated above.`,
  },
  {
    name: 'particle_diameter',
    title:'Mask diameter (A):',
    widget: 'range',
    default: 200, 
    range_min: 0, 
    range_max: 1000, 
    range_step: 10, 
    help: `The experimental images will be masked with a soft \
circular mask with this diameter. Make sure this radius is not set too small because that may mask away part of the signal! \
If set to a value larger than the image size no masking will be performed.\n\n\
The same diameter will also be used for a spherical mask of the reference structures if no user-provided mask is specified.`,
  },
  {
    name: 'do_solvent',
    title:'Flatten and enforce non-negative solvent?',
    widget: 'bool',
    default: true, 
    help: `If set to Yes, the job will apply a spherical mask and enforce all values in the reference to be non-negative.`,
  },
  {
    name: 'do_zero_mask',
    title:'Mask individual particles with zeros?',
    widget: 'bool',
    default: true, 
    help: `If set to Yes, then in the individual particles, \
the area outside a circle with the radius of the particle will be set to zeros prior to taking the Fourier transform. \
This will remove noise and therefore increase sensitivity in the alignment and classification. However, it will also introduce correlations \
between the Fourier components that are not modelled. When set to No, then the solvent area is filled with random noise, which prevents introducing correlations.\
High-resolution refinements (e.g. ribosomes or other large complexes in 3D auto-refine) tend to work better when filling the solvent area with random noise (i.e. setting this option to No), refinements of smaller complexes and most classifications go better when using zeros (i.e. setting this option to Yes).`,
  },
  {
    name: 'do_ctf_correction',
    title:'Do CTF-correction?',
    widget: 'bool',
    default: true, 
    help: `If set to Yes, CTFs will be corrected inside the MAP refinement. \
The resulting algorithm intrinsically implements the optimal linear, or Wiener filter. \
Note that CTF parameters for all images need to be given in the input STAR file. \
The command 'relion_refine --print_metadata_labels' will print a list of all possible metadata labels for that STAR file. \
See the RELION Wiki for more details.\n\n Also make sure that the correct pixel size (in Angstrom) is given above!)`,
  },
  {
    name: 'ctf_intact_first_peak',
    title:'Ignore CTFs until first peak?',
    widget: 'bool',
    default: false, 
    help: `If set to Yes, then CTF-amplitude correction will \
only be performed from the first peak of each CTF onward. This can be useful if the CTF model is inadequate at the lowest resolution. \
Still, in general using higher amplitude contrast on the CTFs (e.g. 10-20%) often yields better results. \
Therefore, this option is not generally recommended: try increasing amplitude contrast (in your input STAR file) first!`,
  },
];


const compute = [
  {
    name: 'do_parallel_discio',
    title:'Use parallel disc I/O?',
    widget: 'bool',
    default: true, 
    help: `If set to Yes, all MPI followers will read their own images from disc. \
Otherwise, only the leader will read images and send them through the network to the followers. Parallel file systems like gluster of fhgfs are good at parallel disc I/O. NFS may break with many followers reading in parallel. If your datasets contain particles with different box sizes, you have to say Yes.`,
  },
  {
    name: 'nr_pool',
    title:'Number of pooled particles:',
    widget: 'range',
    default: 3, 
    range_min: 1, 
    range_max: 16, 
    range_step: 1, 
    help: `Particles are processed in individual batches by MPI followers. During each batch, a stack of particle images is only opened and closed once to improve disk access times. \
All particle images of a single batch are read into memory together. The size of these batches is at least one particle per thread used. The nr_pooled_particles parameter controls how many particles are read together for each thread. If it is set to 3 and one uses 8 threads, batches of 3x8=24 particles will be read together. \
This may improve performance on systems where disk access, and particularly metadata handling of disk access, is a problem. It has a modest cost of increased RAM usage.`,
  },
  {
    name: 'do_preread_images',
    title:'Pre-read all particles into RAM?',
    widget: 'bool',
    default: false, 
    help: `If set to Yes, all particle images will be read into computer memory, which will greatly speed up calculations on systems with slow disk access. However, one should of course be careful with the amount of RAM available. \
Because particles are read in float-precision, it will take ( N * box_size * box_size * 4 / (1024 * 1024 * 1024) ) Giga-bytes to read N particles into RAM. For 100 thousand 200x200 images, that becomes 15Gb, or 60 Gb for the same number of 400x400 particles. \
Remember that running a single MPI follower on each node that runs as many threads as available cores will have access to all available RAM. \n \n If parallel disc I/O is set to No, then only the leader reads all particles into RAM and sends those particles through the network to the MPI followers during the refinement iterations.`,
  },
  {
    name: 'scratch_dir',
    title:'Copy particles to scratch directory:',
    widget: 'text',
    default: 'default_scratch', 
    help: `If a directory is provided here, then the job will create a sub-directory in it called relion_volatile. If that relion_volatile directory already exists, it will be wiped. Then, the program will copy all input particles into a large stack inside the relion_volatile subdirectory. \
Provided this directory is on a fast local drive (e.g. an SSD drive), processing in all the iterations will be faster. If the job finishes correctly, the relion_volatile directory will be wiped. If the job crashes, you may want to remove it yourself.`,
  },
  {
    name: 'do_combine_thru_disc',
    title:'Combine iterations through disc?',
    widget: 'bool',
    default: false, 
    help: `If set to Yes, at the end of every iteration all MPI followers will write out a large file with their accumulated results. The MPI leader will read in all these files, combine them all, and write out a new file with the combined results. \
All MPI salves will then read in the combined results. This reduces heavy load on the network, but increases load on the disc I/O. \
This will affect the time it takes between the progress-bar in the expectation step reaching its end (the mouse gets to the cheese) and the start of the ensuing maximisation step. It will depend on your system setup which is most efficient.`,
  },

  {
    name: 'use_gpu',
    title:'Use GPU acceleration?',
    widget: 'bool',
    default: false, 
    help: `If set to Yes, the job will try to use GPU acceleration.`,
  },
  {
    name: 'gpu_ids',
    title:'Which GPUs to use:',
    widget: 'text',
    default: '', 
    help: `This argument is not necessary. If left empty, the job itself will try to allocate available GPU resources. You can override the default allocation by providing a list of which GPUs (0,1,2,3, etc) to use. MPI-processes are separated by ':', threads by ','. For example: '0,0:1,1:0,0:1,1'`,
  },
];

//////////////////////////////////

const abinitio_tabs = [
  {
    name: 'methods',
    icon: 'bi-wrench-adjustable',
    title: 'Methods',
    widget: 'navtab',
    children: [
      {
        name: 'auto',
        title: 'Ab initio',
        widget: 'fieldset',
        children: [
          {
            name: 'uscf',
            title: 'Relion Ab initio Model',
            option: '--do_log',
            widget: 'radio',
            group: 'abinitio',
            help: `TODO`,
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
    children: abinitio_io
  },
  {
    name: 'settings',
    icon: 'bi-tools',
    title: 'Settings',
    widget: 'navtab',
    children: abinitio
  },
  {
    name: 'compute',
    icon: 'bi-cpu',
    title: 'Compute',
    widget: 'navtab',
    children: compute
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
