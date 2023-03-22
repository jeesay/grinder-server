
const manual_pick = {
  widget: 'navtab',
  children: [
    {
      name: 'fn_in',
      title: 'Input micrographs:',
      widget: 'file',
      default: 'NODE_MICS_CPIPE',
      placeholder: 'Input micrographs (*.{star,mrc})',
      help: 'Input STAR file (with or without CTF information), OR a unix-type wildcard with all micrographs in MRC format (in this case no CTFs can be used).',
    },
    {
      name: 'diameter',
      title: 'Particle diameter (A):',
      widget: 'range',
      default:100, 
      range_min: 0, 
      range_max: 500, 
      range_step: 50,
      help: 'The diameter of the circle used around picked particles (in Angstroms). Only used for display.',
    },
    {
      name: 'micscale',
      title: 'Scale for micrographs:',
      widget: 'range',
      default:0.2, 
      range_min: 0.1, 
      range_max: 1, 
      range_step: 0.05,
      help: 'The micrographs will be displayed at this relative scale, i.e. a value of 0.5 means that only every second pixel will be displayed.',
    },
    {
      name: 'sigma_contrast',
      title: 'Sigma contrast:',
      widget: 'range',
      default:3, 
      range_min: 0, 
      range_max: 10, 
      range_step: 0.5,
      help: 'The micrographs will be displayed with the black value set to the average of all values MINUS this values times the standard deviation of all values in the micrograph, and the white value will be set \
to the average PLUS this value times the standard deviation. Use zero to set the minimum value in the micrograph to black, and the maximum value to white ',
    },
    {
      name: 'white_val',
      title: 'White value:',
      widget: 'range',
      default:0, 
      range_min: 0, 
      range_max: 512, 
      range_step: 16,
      help: 'Use non-zero values to set the value of the whitest pixel in the micrograph.',
    },
    {
      name: 'black_val',
      title: 'Black value:',
      widget: 'range',
      default:0, 
      range_min: 0, 
      range_max: 512, 
      range_step: 16,
      help: 'Use non-zero values to set the value of the blackest pixel in the micrograph.',
    },
    {
      name: 'lowpass',
      title: 'Lowpass filter (A)',
      widget: 'range',
      default:20, 
      range_min: 10, 
      range_max: 100, 
      range_step: 5,
      help: 'Lowpass filter that will be applied to the micrographs. Give a negative value to skip the lowpass filter.',
    },
    {
      name: 'highpass',
      title: 'Highpass filter (A)',
      widget: 'range',
      default:-1, 
      range_min: 100, 
      range_max: 1000, 
      range_step: 100,
      help: 'Highpass filter that will be applied to the micrographs. This may be useful to get rid of background ramps due to uneven ice distributions. Give a negative value to skip the highpass filter. Useful values are often in the range of 200-400 Angstroms.',
    },
    {
      name: 'angpix',
      title: 'Pixel size (A)',
      widget: 'range',
      default:-1, 
      range_min: 0.3, 
      range_max: 5, 
      range_step: 0.1,
      help: 'Pixel size in Angstroms. This will be used to calculate the filters and the particle diameter in pixels. If a CTF-containing STAR file is input, then the value given here will be ignored, and the pixel size will be calculated from the values in the STAR file. A negative value can then be given here.',
    },
  ]
}
const manual_pick_denoising = {
  widget: 'navtab',
  children: [
    {
      name: 'fn_in',
      title: 'Input micrographs:',
      widget: 'file',
      default: 'NODE_MICS_CPIPE',
      placeholder: 'Input micrographs (*.{star,mrc})',
      help: 'Input STAR file (with or without CTF information), OR a unix-type wildcard with all micrographs in MRC format (in this case no CTFs can be used).',
    },
    {
      name: 'diameter',
      title: 'Particle diameter (A):',
      widget: 'range',
      default:100, 
      range_min: 0, 
      range_max: 500, 
      range_step: 50,
      help: 'The diameter of the circle used around picked particles (in Angstroms). Only used for display.',
    },
    {
      name: 'micscale',
      title: 'Scale for micrographs:',
      widget: 'range',
      default:0.2, 
      range_min: 0.1, 
      range_max: 1, 
      range_step: 0.05,
      help: 'The micrographs will be displayed at this relative scale, i.e. a value of 0.5 means that only every second pixel will be displayed.',
    },
    {
      name: 'sigma_contrast',
      title: 'Sigma contrast:',
      widget: 'range',
      default:3, 
      range_min: 0, 
      range_max: 10, 
      range_step: 0.5,
      help: 'The micrographs will be displayed with the black value set to the average of all values MINUS this values times the standard deviation of all values in the micrograph, and the white value will be set \
to the average PLUS this value times the standard deviation. Use zero to set the minimum value in the micrograph to black, and the maximum value to white ',
    },
    {
      name: 'white_val',
      title: 'White value:',
      widget: 'range',
      default:0, 
      range_min: 0, 
      range_max: 512, 
      range_step: 16,
      help: 'Use non-zero values to set the value of the whitest pixel in the micrograph.',
    },
    {
      name: 'black_val',
      title: 'Black value:',
      widget: 'range',
      default:0, 
      range_min: 0, 
      range_max: 512, 
      range_step: 16,
      help: 'Use non-zero values to set the value of the blackest pixel in the micrograph.',
    },
    {
      name: 'highpass',
      title: 'Highpass filter (A)',
      widget: 'range',
      default:-1, 
      range_min: 100, 
      range_max: 1000, 
      range_step: 100,
      help: 'Highpass filter that will be applied to the micrographs. This may be useful to get rid of background ramps due to uneven ice distributions. Give a negative value to skip the highpass filter. Useful values are often in the range of 200-400 Angstroms.',
    },
    {
      name: 'angpix',
      title: 'Pixel size (A)',
      widget: 'range',
      default:-1, 
      range_min: 0.3, 
      range_max: 5, 
      range_step: 0.1,
      help: 'Pixel size in Angstroms. This will be used to calculate the filters and the particle diameter in pixels. If a CTF-containing STAR file is input, then the value given here will be ignored, and the pixel size will be calculated from the values in the STAR file. A negative value can then be given here.',
    },
    {
      name: 'do_topaz_denoise',
      title: 'OR: use Topaz denoising?',
      widget: 'bool',
      default:false,
      help: 'If set to true, Topaz denoising will be performed instead of lowpass filtering.',
    },
  ]
}

const autopick_display = [
  {
    name: 'do_startend',
    title: 'Pick start-end coordinates helices?',
    widget: 'bool',
    default:false,
    help: 'If set to true, start and end coordinates are picked subsequently and a line will be drawn between each pair',
  },
  {
    name: 'do_fom_threshold',
    title: 'Use autopick FOM threshold?',
    widget: 'bool',
    default:false,
    help: 'If set to Yes, only particles with rlnAutopickFigureOfMerit values below the threshold below will be extracted.',
  },
  {
    name: 'minimum_pick_fom',
    title: 'Minimum autopick FOM: ',
    widget: 'range',
    default:0, 
    range_min: -5, 
    range_max: 10, 
    range_step: 0.1,
    help: 'The minimum value for the rlnAutopickFigureOfMerit for particles to be extracted.',
  },
  {
    name: 'do_color',
    title: 'Blue<>red color particles?',
    widget: 'bool',
    default:false,
    help: 'If set to true, then the circles for each particles are coloured from red to blue (or the other way around) for a given metadatalabel. If this metadatalabel is not in the picked coordinates STAR file \
(basically only the rlnAutopickFigureOfMerit or rlnClassNumber) would be useful values there, then you may provide an additional STAR file (e.g. after classification/refinement below. Particles with values -999, or that are not in the additional STAR file will be coloured the default color: green',
  },
  {
    name: 'color_label',
    title: 'MetaDataLabel for color:',
    widget: 'text',
    default: 'rlnAutopickFigureOfMerit',
    help: 'The Metadata label of the value to plot from red<>blue. Useful examples might be: \n \
rlnParticleSelectZScore \n rlnClassNumber \n rlnAutopickFigureOfMerit \n rlnAngleTilt \n rlnLogLikeliContribution \n rlnMaxValueProbDistribution \n rlnNrOfSignificantSamples\n',
  },
  {
    name: 'fn_color',
    title: 'STAR file with color label: ',
    widget: 'file',
    default:'',
    default:'STAR file (*.star)',
    default:'.',
    default:`The program will figure out which particles in this STAR file are on the current micrograph and color their circles according to the value in the corresponding column.
Particles that are not in this STAR file, but present in the picked coordinates file will be colored green. If this field is left empty, then the color label (e.g. rlnAutopickFigureOfMerit) should be present in the coordinates STAR file.`,
  },
  {
    name: 'blue_value',
    title: 'Blue value: ',
    widget: 'range',
    default: 0., 
    range_min: 0., 
    range_max: 4., 
    range_step: 0.1,
    help: 'The value of this entry will be blue. There will be a linear scale from blue to red, according to this value and the one given below.',
  },
  {
    name: 'red_value',
    title: 'Red value: ',
    widget: 'range',
    default:2., 
    range_min: 0., 
    range_max: 4., range_step: 0.1,
    help: 'The value of this entry will be red. There will be a linear scale from blue to red, according to this value and the one given above.',
  },
];

const autopick_log = {
  widget: 'navtab',
  children: [
    {
      name: 'fn_input_autopick',
      title: 'Input micrographs for autopick:',
      widget: 'file',
      filetype: 'NODE_MICS_CPIPE',
      placeholder:'Input micrographs (*.{star})',
      help:'Input STAR file (preferably with CTF information) with all micrographs to pick from.',
    },
    {
      name: 'angpix',
      title: 'Pixel size in micrographs (A)',
      widget: 'range',
      default:-1, 
      range_min: 0.3, 
      range_max: 5, 
      range_step: 0.1,
      help: 'Pixel size in Angstroms. If a CTF-containing STAR file is input, then the value given here will be ignored, and the pixel size will be calculated from the values in the STAR file. A negative value can then be given here.',
    },
    {
      name: 'log_diam_min',
      title: 'Min. diameter for LoG filter (A)',
      widget: 'range',
      default:200, 
      range_min: 50, 
      range_max: 500, 
      range_step: 10,
      help: 'The smallest allowed diameter for the blob-detection algorithm. This should correspond to the smallest size of your particles in Angstroms.',
    },
    {
      name: 'log_diam_max',
      title: 'Max. diameter for LoG filter (A)',
      widget: 'range',
      default:250, 
      range_min: 50, 
      range_max: 500, 
      range_step: 10,
      help: 'The largest allowed diameter for the blob-detection algorithm. This should correspond to the largest size of your particles in Angstroms.',
    },
    {
      name: 'log_invert',
      title: 'Are the particles white?',
      widget: 'bool',
      default:false,
      help: 'Set this option to No if the particles are black, and to Yes if the particles are white.',
    },
    {
      name: 'log_maxres',
      title: 'Maximum resolution to consider (A)',
      widget: 'range',
      default:20, 
      range_min: 10, 
      range_max: 100, 
      range_step: 5,
      help: 'The Laplacian-of-Gaussian filter will be applied to downscaled micrographs with the corresponding size. Give a negative value to skip downscaling.',
    },
    {
      name: 'log_adjust_thr',
      title: 'Adjust default threshold (stddev):',
      widget: 'range',
      default:0, 
      range_min: -1., 
      range_max: 1., 
      range_step: 0.05,
      help: 'Use this to pick more (negative number -> lower threshold) or less (positive number -> higher threshold) particles compared to the default setting. The threshold is moved this many standard deviations away from the average.',
    },
    {
      name: 'log_upper_thr',
      title: 'Upper threshold (stddev):',
      widget: 'range',
      default:999., 
      range_min: 0., 
      range_max: 10., 
      range_step: 0.5,
      help: 'Use this to discard picks with LoG thresholds that are this many standard deviations above the average, e.g. to avoid high contrast contamination like ice and ethane droplets. Good values depend on the contrast of micrographs and need to be interactively explored; for low contrast micrographs, values of ~ 1.5 may be reasonable, but the same value will be too low for high-contrast micrographs.',
    },

  ]
}


const autopick_io = [
  {
    name: 'fn_input_autopick',
    title: 'Input micrographs for autopick:',
    widget: 'file',
    filetype: 'NODE_MICS_CPIPE',
    placeholder: 'Input micrographs (*.{star})',
    default:'Input STAR file (preferably with CTF information) with all micrographs to pick from.',
  },
  {
    name: 'angpix',
    title: 'Pixel size in micrographs (A)',
    widget: 'range',
    default:-1, 
    range_min: 0.3, 
    range_max: 5, 
    range_step: 0.1,
    help: 'Pixel size in Angstroms. If a CTF-containing STAR file is input, then the value given here will be ignored, and the pixel size will be calculated from the values in the STAR file. A negative value can then be given here.',
  },
  {
    name: 'continue_manual',
    title: 'OR: continue manually?',
    widget: 'bool',
    default:false,
    help: 'If set to Yes, an Autopick job can be continued as a manualpick job, so that incorrect picks can be corrected interactively.',
  },
];

const autopick_topaz_train = {
  widget: 'navtab',
  children: [
    {
      name: 'fn_topaz_exec',
      title: 'Topaz executable',
      widget: 'text',
      default: 'default_location',
      help: 'The location of the Topaz executable. If you need to activate conda environment, please make a wrapper shell script to do so and specify it. You can control the default of this field by setting environment variable RELION_TOPAZ_EXECUTABLE.',
    },
    {
      name: 'topaz_train_picks',
      title: 'Input picked coordinates for training:',
      widget: 'file',
      filetype: 'NODE_COORDS_CPIPE',
      default: '',
      placeholder: 'Input micrographs (*.{star})',
      default: 'Input STAR file (preferably with CTF information) with all micrographs to pick from.',
    },
    {
      name: 'do_topaz_train_parts',
      title: 'OR train on a set of particles? ',
      widget: 'bool',
      default:false,
      help: 'If set to Yes, the input Coordinates above will be ignored. Instead, one uses a _data.star file from a previous 2D or 3D refinement or selection to use those particle positions for training.',
    },
    {
      name: 'topaz_train_parts',
      title: 'Particles STAR file for training: ',
      widget: 'file',
      filetype: 'NODE_PARTS_CPIPE',
      default: '',
      placeholder: 'Input STAR file (*.{star})',
      help: 'Filename of the STAR file with the particle coordinates to be used for training, e.g. from a previous 2D or 3D classification or selection.',
    },
  ]
};

const autopick_topaz = {
  widget: 'navtab',
  children: [
    {
      name: 'do_topaz_pick',
      title: 'Perform topaz picking?',
      default: false,
      help: 'Set this option to Yes if you want to use a topaz model for autopicking.',
    },
    {
      name: 'topaz_particle_diameter',
      title: 'Particle diameter (A) ',
      default:-1, 
      range_min: 0, 
      range_max: 2000, 
      range_step: 20,
      help: 'Diameter of the particle (to be used to infer topaz downscale factor and particle radius)',
    },
    {
      name: 'topaz_nr_particles',
      title: 'Nr of particles per micrograph: ',
      default:-1, 
      range_min: 0, 
      range_max: 2000, 
      range_step: 20,
      help: 'Expected average number of particles per micrograph',
    },
    {
      name: 'topaz_model',
      title: 'Trained topaz model: ',
      widget: 'file',
      placeholder: 'SAV Files (*.sav)',
      default: '.',
      help: 'Trained topaz model for topaz-based picking. Use on job for training and a next job for picking. Leave this empty to use the default (general) model.',
    },
    {
      name: 'topaz_other_args',
      widget: 'Additional topaz arguments:',
      default: '',
      help: 'These additional arguments will be passed onto all topaz programs.',
    },
  ]
}

const autopick_matching_3d = [
    {
      name: 'do_ref3d',
      title: '"OR: provide a 3D reference?',
      default:false,
      help: 'Set this option to Yes if you want to provide a 3D map, which will be projected into multiple directions to generate 2D references.',
    },
    {
      name: 'fn_ref3d_autopick',
      title: '3D reference:',
      filetype: 'NODE_MAP_CPIPE',
      default: '',
      placeholder: 'Input reference (*.{mrc})',
      help: 'Input MRC file with the 3D reference maps, from which 2D references will be made by projection. Note that the absolute greyscale needs to be correct, so only use maps created by RELION itself from this data set.',
    },
    {
      name: 'ref3d_symmetry',
      title: 'Symmetry:',
      widget: 'text',
      default: 'C1',
      help: 'Symmetry point group of the 3D reference. Only projections in the asymmetric part of the sphere will be generated.',
    },
    {
      name: 'ref3d_sampling',
      title: '3D angular sampling:',
      widget: 'select',
      default:0,
      help: `There are only a few discrete angular samplings possible because we use the HealPix library to generate the sampling of the first two Euler angles on the sphere.
The samplings are approximate numbers and vary slightly over the sphere.

For autopicking, 30 degrees is usually fine enough, but for highly symmetrical objects one may need to go finer to adequately sample the asymmetric part of the sphere.`,
      children: []
    },
];

const autopick_matching_2d = [
    {
      name: 'do_refs',
      title: 'Use reference-based template-matching?',
      default:false,
      help: 'If set to Yes, 2D or 3D references, as defined on the References tab will be used for autopicking.',
    },
    {
      name: 'fn_refs_autopick',
      title: '2D references:',
      default: 'NODE_2DIMGS_CPIPE',
      default: '',
      placeholder: 'Input references (*.{star,mrcs})',
      help: 'Input STAR file or MRC stack with the 2D references to be used for picking. Note that the absolute greyscale needs to be correct, so only use images created by RELION itself, e.g. by 2D class averaging or projecting a RELION reconstruction.',
    },
];

const autopick_matching = [
    {
      name: 'lowpass',
      title: 'Lowpass filter references (A)',
      widget: 'range',
      default:20, 
      range_min: 10, 
      range_max: 100, 
      range_step: 5,
      help: 'Lowpass filter that will be applied to the references before template matching. Do NOT use very high-resolution templates to search your micrographs. The signal will be too weak at high resolution anyway, and you may find Einstein from noise.... Give a negative value to skip the lowpass filter.',
    },
    {
      name: 'highpass',
      title: 'Highpass filter (A)',
      widget: 'range',
      default:-1, 
      range_min: 100, 
      range_max: 1000, 
      range_step: 100,
      help: 'Highpass filter that will be applied to the micrographs. This may be useful to get rid of background ramps due to uneven ice distributions. Give a negative value to skip the highpass filter.  Useful values are often in the range of 200-400 Angstroms.',
    },
    {
      name: 'angpix_ref',
      title: 'Pixel size in references (A)',
      widget: 'range',
      default:-1, 
      range_min: 0.3, 
      range_max: 5, 
      range_step: 0.1,
      help: 'Pixel size in Angstroms for the provided reference images. This will be used to calculate the filters and the particle diameter in pixels. If a negative value is given here, the pixel size in the references will be assumed to be the same as the one in the micrographs, i.e. the particles that were used to make the references were not rescaled upon extraction.',
    },
    {
      name: 'psi_sampling_autopick',
      title: 'In-plane angular sampling (deg)',
      widget: 'range',
      default:5, 
      range_min: 1, 
      range_max: 30, 
      range_step: 1,
      help: 'Angular sampling in degrees for exhaustive searches of the in-plane rotations for all references.',
    },
    {
      name: 'do_invert_refs',
      title: 'References have inverted contrast?',
      default:true,
      help: 'Set to Yes to indicate that the reference have inverted contrast with respect to the particles in the micrographs.',
    },
    {
      name: 'do_ctf_autopick',
      title: 'Are References CTF corrected?',
      default:true,
      help: `Set to Yes if the references were created with CTF-correction inside RELION.
      
      If set to Yes, the input micrographs can only be given as a STAR file, which should contain the CTF information for each micrograph.`,
    },
    {
      name: 'do_ignore_first_ctfpeak_autopick',
      title: 'Ignore CTFs until first peak?',
      default:false,
      help: 'Set this to Yes, only if this option was also used to generate the references.',
    },
];

const autopick_settings = [
    {
      name: 'threshold_autopick',
      title: 'Picking threshold:',
      widget: 'range',
      default: 0.05, 
      range_min: 0, 
      range_max: 1., 
      range_step: 0.01,
      help: `Use lower thresholds to pick more particles (and more junk probably).
This option is ignored in the Laplacian-of-Gaussian picker. Please use 'Adjust default threshold' in the 'Laplacian' tab instead.`,
    },
    {
      name: 'mindist_autopick',
      title: 'Minimum inter-particle distance (A):',
      widget: 'range',
      default: 100, 
      range_min: 0, 
      range_max: 1000, 
      range_step: 20,
      help: `Particles closer together than this distance will be consider to be a single cluster. From each cluster, only one particle will be picked.
      
This option takes no effect for picking helical segments. The inter-box distance is calculated with the number of asymmetrical units and the helical rise on 'Helix' tab. This option is also ignored in the Laplacian-of-Gaussian picker. The inter-box distance is calculated from particle diameters.`,
    },
    {
      name: 'maxstddevnoise_autopick',
      title: 'Maximum stddev noise:',
      widget: 'range',
      default:1.1, 
      range_min: 0.9, 
      range_max: 1.5, 
      range_step: 0.02,
      help: 'This is useful to prevent picking in carbon areas, or areas with big contamination features. Peaks in areas where the background standard deviation in the normalized micrographs is higher than this value will be ignored. Useful values are probably in the range 1.0 to 1.2. Set to -1 to switch off the feature to eliminate peaks due to high background standard deviations.\
\n\nThis option is ignored in the Laplacian-of-Gaussian picker.',
    },
    {
      name: 'minavgnoise_autopick',
      title: 'Minimum avg noise:',
      widget: 'range',
      default:-999., 
      range_min: -2, 
      range_max: 0.5, 
      range_step: 0.05,
      help: `This is useful to prevent picking in carbon areas, or areas with big contamination features. Peaks in areas where the background standard deviation in the normalized micrographs is higher than this value will be ignored. Useful values are probably in the range -0.5 to 0. Set to -999 to switch off the feature to eliminate peaks due to low average background densities.
      
This option is ignored in the Laplacian-of-Gaussian picker.`,
    },
    {
      name: 'do_write_fom_maps',
      title: 'Write FOM maps?',
      default:false,
      help: 'If set to Yes, intermediate probability maps will be written out, which (upon reading them back in) will speed up tremendously the optimization of the threshold and inter-particle distance parameters. However, with this option, one cannot run in parallel, as disc I/O is very heavy with this option set.',
    },
    {
      name: 'do_read_fom_maps',
      title: 'Read FOM maps?',
      default:false,
      help: 'If written out previously, read the FOM maps back in and re-run the picking to quickly find the optimal threshold and inter-particle distance parameters',
    },
    {
      name: 'shrink',
      title: 'Shrink factor:',
      widget: 'range',
      default:0, 
      range_min: 0, 
      range_max: 1, 
      range_step: 0.1,
      help: 'This is useful to speed up the calculations, and to make them less memory-intensive. The micrographs will be downscaled (shrunk) to calculate the cross-correlations, and peak searching will be done in the downscaled FOM maps. When set to 0, the micrographs will de downscaled to the lowpass filter of the references, a value between 0 and 1 will downscale the micrographs by that factor. Note that the results will not be exactly the same when you shrink micrographs!\
\n\nIn the Laplacian-of-Gaussian picker, this option is ignored and the shrink factor always becomes 0.',
    },
];


const picking_tabs = [
  {
    name: 'tools',
    icon: 'bi-wrench-adjustable',
    title: 'Tools',
    widget: 'navtab',
    default:  true, 
    children: [
      {
        name: 'manual',
        title: 'Manual Picking',
        widget: 'fieldset',
        children: [
          {
            name: 'pick_lowpass',
            title: 'Manual Picking with Low-pass filtering',
            widget: 'radio',
            option: '--do_movies',
            group: 'motioncor',
            help: '',
            on_click: (ev) => w_navtab_update({settings: manual_pick})
          },
          {
            name: 'pick_denoise',
            title: 'Manual Picking with Topaz denoising',
            widget: 'radio',
            option: '--do_topaz_denoise',
            group: 'motioncor',
            help: 'If set to true, Topaz denoising will be performed instead of lowpass filtering.',
            on_click: (ev) => w_navtab_update({settings: manual_pick_denoising})
          }

        ]
      },
      {
        name: 'auto',
        title: 'Auto Picking',
        widget: 'fieldset',
        children: [
          {
            name: 'do_log',
            title: 'Autopicking with Laplacian-of-Gaussian',
            option: '--do_log',
            widget: 'radio',
            group: 'picking',
            help: `If set to Yes, a Laplacian-of-Gaussian blob detection will be used (you can then leave the 'References' field empty. The preferred way to autopick is by setting this to no and providing references that were generated by 2D classification from this data set in RELION. The Laplacian-of-Gaussian method may be useful to kickstart a new data set. Please note that some options in the autopick tab are ignored in this method. See help messages of each option for details.`,
            on_click: (ev) => w_navtab_update({settings: autopick_log})
          },
          {
            name: 'do_refs',
            title: 'Autopicking by template matching from 2D references',
            option: '--do_micrographs',
            widget: 'radio',
            group: 'picking',
            help: 'Set this to Yes if you plan to use the UCSF implementation. The UCSF-implementation needs a GPU but uses only one CPU thread.',
            on_click: (ev) => w_navtab_update({settings: ucsf_settings})
          },
          {
            name: 'do_ref3D',
            title: 'Autopicking by template matching from a 3D reference',
            option: '--do_micrographs',
            widget: 'radio',
            group: 'picking',
            help: 'Set this option to Yes if you want to provide a 3D map, which will be projected into multiple directions to generate 2D references.',
            on_click: (ev) => w_navtab_update({settings: ucsf_settings})
          },
        ]
      },
      {
        name: 'auto_topaz',
        title: 'Auto Picking by Topaz',
        widget: 'fieldset',
        children: [

          {
            name: 'do_topaz_train',
            title: 'Step #1: Training from input coordinates (default)',
            option: '--topaz_train',
            widget: 'radio',
            group: 'picking',
            help: 'Set this option to Yes if you want to train a topaz model.',
            on_click: (ev) => w_navtab_update({settings: autopick_topaz_train})
          },
          {
            name: 'do_topaz_train_parts',
            title: 'Step #1: Training from set of particles ',
            option: '--topaz_train_parts',
            widget: 'radio',
            group: 'picking',
            help: 'Set this option to Yes if you want to train a topaz model.',
            on_click: (ev) => w_navtab_update({settings: autopick_topaz_train})
          },
          {
            name: 'do_topaz_pick',
            title: 'Step #2 - Picking',
            option: '--do_topaz_pick',
            widget: 'radio',
            group: 'picking',
            help: 'Set this to Yes if you plan to use the UCSF implementation. The UCSF-implementation needs a GPU but uses only one CPU thread.',
            on_click: (ev) => w_navtab_update({settings: autopick_topaz})
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
    children: autopick_io
  },
  {
    name: 'display',
    icon: 'bi-palette',
    title: 'Display',
    widget: 'navtab',
    children: autopick_display
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
      ...submit_settings
    ]
  }
];


