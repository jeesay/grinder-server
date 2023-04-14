JOBS = [
  {
    'type': "relion.import.movies",
    'gtype': "relion.import.movies.movies",
    'menu': 'import',
    'out_dir': 'Import/',
    'job_options': {
      'do_other': 'No',
      'do_raw': 'Yes',
      'is_multiframe': 'Yes',
    },
    'job_cli_tool': 'relion_import',
    'job_cli': {
      '00': '--do_movies',
      'optics_group_name': '--optics_group_name',
      'Cs': '--Cs',
      'Q0': '--Q0',
      'angpix': '--angpix',
      'beamtilt_x': '--beamtilt_x',
      'beamtilt_y': '--beamtilt_y',
      'fn_mtf': '--optics_group_mtf',
      'kV': '--kV',
      'other_args': '',
      'fn_in_raw': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile movies.star',
      '03': '--pipeline_control Import/${JOBID}/'
    },
    'job_process': {
      'min_dedicated': '--i',
      'do_queue': 'bool',
      'qsub': '--i',
      'qsubscript': '--i',
      'queuename': '--i',
    }
  },  {
    'type': "relion.import.movies",
    'gtype': "relion.import.movies.micrographs",
    'menu': 'import',
    'out_dir': 'Import/',
    'job_options': {
      'do_other': 'No',
      'do_raw': 'Yes',
      'is_multiframe': 'No',
    },
    'job_cli_tool': 'relion_import',
    'job_cli': {
      '00': '--do_micrographs',
      'optics_group_name': '--optics_group_name',
      'Cs': '--Cs',
      'Q0': '--Q0',
      'angpix': '--angpix',
      'beamtilt_x': '--beamtilt_x',
      'beamtilt_y': '--beamtilt_y',
      'fn_mtf': '--optics_group_mtf',
      'kV': '--kV',
      'other_args': '',
      'fn_in_raw': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile micrographs.star',
      '03': '--pipeline_control Import/${JOBID}/'
    },
    'job_process': {
      'min_dedicated': '--i',
      'do_queue': 'bool',
      'qsub': '--i',
      'qsubscript': '--i',
      'queuename': '--i',
    }
  },
  {
    'type': "relion.import.other",
    'gtype': 'relion.import.other.coords',
    'menu': 'import',
    'job_options': {
      'do_other': 'Yes',
      'do_raw': 'No',
      'node_type': "Particle coordinates (*.box, *_pick.star)"
    },
    'job_cli': {
      '00': '--do_coordinates',
      'fn_in_other': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile coords_suffix',
      '03': '--pipeline_control Import/${JOBID}/'
    }
  },
  {
    'type': "relion.import.other",
    'gtype': 'relion.import.other.particles',
    'menu': 'import',
    'job_options': {
      'do_other': 'Yes',
      'do_raw': 'No',
      'node_type': "Particles STAR file (.star)"
    },
    'job_cli': {
      '00': '--do_particles',
      'optics_group_particles': '--particles_optics_group_name',
      'fn_in_other': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile particles.star',
      '03': '--pipeline_control Import/${JOBID}/'
    }
  },
  {
    'type': "relion.import.other",
    'gtype': 'relion.import.other.multirefs',
    'menu': 'import',
    'job_options': {
      'do_other': 'Yes',
      'do_raw': 'No',
      'node_type': "Multiple (2D or 3D) references (.star or .mrcs)"
    },
    'job_cli': {
      '00': '--do_other',
      'optics_group_particles': '--particles_optics_group_name',
      'fn_in_other': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile particles.star',
      '03': '--pipeline_control Import/${JOBID}/'
    }
  },
  {
    'type': "relion.import.other",
    'gtype': 'relion.import.other.ref3D',
    'menu': 'import',
    'job_options': {
      'do_other': 'Yes',
      'do_raw': 'No',
      'node_type': "3D reference (.mrc)"
    },
    'job_cli': {
      '00': '--do_other',
      'optics_group_particles': '--particles_optics_group_name',
      'fn_in_other': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile particles.star',
      '03': '--pipeline_control Import/${JOBID}/'
    }
  },
  {
    'type': "relion.import.other",
    'gtype': 'relion.import.other.mask',
    'menu': 'import',
    'job_options': {
      'do_other': 'Yes',
      'do_raw': 'No',
      'node_type': "3D mask (.mrc)"
    },
    'job_cli': {
      '00': '--do_other',
      'fn_in_other': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile particles.star',
      '03': '--pipeline_control Import/${JOBID}/'
    }
  },
  {
    'type': "relion.import.other",
    'gtype': 'relion.import.other.micrographs_star',
    'menu': 'import',
    'job_options': {
      'do_other': 'Yes',
      'do_raw': 'No',
      'node_type': "Micrographs STAR file (.star)"
    },
    'job_cli': {
      '00': '--do_other',
      'fn_in_other': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile ${fn_in_other}',
      '03': '--pipeline_control Import/${JOBID}/'
    }
  },
  {
    'type': "relion.import.other",
    'gtype': 'relion.import.other.halfmap',
    'menu': 'import',
    'job_options': {
      'do_other': 'Yes',
      'do_raw': 'No',
      'node_type': "Unfiltered half-map (unfil.mrc)"
    },
    'job_cli': {
      '00': '--do_halfmaps',
      'optics_group_particles': '--particles_optics_group_name',
      'fn_in_other': '--i',
      '01': '--odir Import/${JOBID}/',
      '02': '--ofile particles.star',
      '03': '--pipeline_control Import/${JOBID}/'
    }
  },
  {
    'type': "relion.autopick.ref2d",
    'menu': 'picking',
  },
  {
    'type': "relion.autopick.topaz.pick",
    'menu': 'picking'
  },
  {
    'type': "relion.autopick.topaz.train",
    'menu': 'picking'
  },
  {
    'type': "relion.class2d",
    'menu': 'class2d',
    'subtypes': {
      '--grad': 'vdam',
      '--helix': 'helix',
      '--em': 'em'
    },
  },
  {
    'type': "relion.class3d",
    'menu': 'class3d'
  },
  {
    'type': "relion.ctffind.ctffind4",
    'menu': 'ctf'
  },
  {
    'type': "relion.ctfrefine",
    'menu': 'ctf'
  },
  {
    'type': "relion.ctfrefine.anisomag",
    'menu': 'ctf'
  },
  {
    'type': "relion.extract",
    'menu': 'extract'
  },
  {
    'type': "relion.extract.reextract",
    'menu': 'extract'
  },
  {
    'type': "relion.initialmodel",
    'menu': 'abinitio'
  },
  {
    'type': "relion.maskcreate",
    'menu': 'tools',
  },
  {
    'type': "relion.motioncorr.own",
    'menu': 'motioncorr',
  },
  {
    'type': "relion.polish",
    'menu': 'postprocess',
  },
  {
    'type': "relion.polish.train",
    'menu': 'postprocess',
  },
  {
    'type': "relion.postprocess",
    'menu': 'postprocess',
  },
  {
    'type': "relion.refine3d",
    'menu': 'refine3d',
  },
  {
    'type': "relion.select.interactive",
    'menu': 'tools',
  },
  {
    'type': "relion.select.onvalue",
    'menu': 'tools',
  },
  {
    'type': "relion.select.split",
    'menu': 'tools',
  }
]
