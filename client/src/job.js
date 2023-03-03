
'use strict';

const view_job = (job) => {
  // From `job.json`
  

  document.querySelectorAll('aside ul li').forEach(ww => ww.classList.remove("active"));
  const w = document.querySelector(`aside #${job.widget}`);
  w.classList.add("active");
  // Create empty menus
  w_navtab(document.querySelector('section'),job.tabs);
  // Set the various parameters
}

const jobtypes = [
  {
    type: "relion.autopick.ref2d",
    widget: 'picking',
    gui: {
      main: picking_tabs
    }
  },
  {
    type: "relion.autopick.topaz.pick",
    widget: 'picking',
    gui: {
      main: picking_tabs
    }
  },
  {
    type: "relion.autopick.topaz.train",
    widget: 'picking',
    gui: {
      main: picking_tabs
    }
  },
  {
    type: "relion.class2d",
    widget: 'class2d',
    gui: {
      main: class2d_tabs
    }
  },
  {
    type: "relion.class3d",
    widget: 'class3d',
    gui: {
      main: class3d_tabs
    }
  },
  {
    type: "relion.ctffind.ctffind4",
    widget: 'ctf',
    gui: {
      main: ctf_tabs
    }
  },
  {
    type: "relion.ctfrefine",
    widget: 'ctf',
    gui: {
      main: ctf_tabs
    }
  },
  {
    type: "relion.ctfrefine.anisomag",
    widget: 'ctf',
    gui: {
      main: ctf_tabs
    }
  },
  {
    type: "relion.extract",
    gui: {
      main: extract_tabs
    }
  },
  {
    type: "relion.extract.reextract",
    gui: {
      main: extract_tabs
    }
  },
  {
    type: "relion.import.movies",
    widget: 'import',
    gui: {
      main: import_tabs,
      tabs: {settings: ugraph_settings}
    }
  },
  {
    type: "relion.import.other",
    widget: 'import',
    gui: {
      main: import_tabs,
      tabs: {settings: other_settings}
    }
  },
  {
    type: "relion.initialmodel",
    widget: 'abinitio',
    gui: {
      main: abinitio_tabs
    }
  },
  {
    type: "relion.joinstar.particles",
    widget: 'tools',
    gui: {
      main: tools_tabs
    }
  },
  {
    type: "relion.manualpick",
    widget: 'picking',
    gui: {
      main: picking_tabs
    }
  },
  {
    type: "relion.maskcreate",
    widget: 'tools',
    gui: {
      main: tools_tabs
    }
  },
  {
    type: "relion.motioncorr.own",
    widget: 'motioncorr',
    gui: {
      main: motioncor_tabs
    }
  },
  {
    type: "relion.polish",
    widget: 'postprocess',
    gui: {
      main: postprocess_tabs
    }
  },
  {
    type: "relion.polish.train",
    widget: 'postprocess',
    gui: {
      main: postprocess_tabs
    }
  },
  {
    type: "relion.postprocess",
    widget: 'postprocess',
    gui: postprocess_tabs
  },
  {
    type: "relion.refine3d",
    widget: 'refine3d',
    gui: {
      main: refine_tabs
    }
  },
  {
    type: "relion.select.interactive",
    widget: 'tools',
    gui: {
      main: tools_tabs
    }
  },
  {
    type: "relion.select.onvalue",
    widget: 'tools',
    gui: {
      main: tools_tabs
    }
  },
  {
    type: "relion.select.split",
    widget: 'tools',
    gui: {
      main: tools_tabs
    }
  }
]


