const GRINDER = {
  version: '0.1',
  server: new WSClient(),
  filetypes: {
    CURRENT_ODIR: {
      id: 100,
      dialog_title: 'Open file',
      path: ''
    },
    NODE_MOVIES_CPIPE: {
      id: 1,
      dialog_title: 'Open movie STAR file',
      placeholder: '*.star',
      filter: '.star',
      outnode: "MicrographMoviesData.star.relion",
      filterdir: '',
    },
    NODE_MICS_CPIPE: {
      id: 2,
      dialog_title: 'Open Micrographs STAR file',
      placeholder: '*.star',
      filter: '.star',
      outnode: "MicrographsData.star.relion"
    },
    NODE_2DIMGS_CPIPE: {
      id: 3,
      dialog_title: 'Open movie STAR file (*.star)',
      placeholder: '*.star',
      filter: '.star',
      outnode: ''
    },
    NODE_MAP_CPIPE: {
      id: 4,
      dialog_title: 'Open 3D reference',
      placeholder: '*.mrc',
      filter: '.mrc'
    },
    NODE_PARTS_CPIPE: {
      id: 5,
      dialog_title: "Open Particles STAR file",
      placeholder: '*.star',
      filter: '.star'
    },
    NODE_COORDS_CPIPE: {
      id: 6,
      dialog_title: "Open Particle coordinates",
      placeholder: "*.box, *_pick.star",
      filter: '.box,_pick.star'
    },
    NODE_COORDS_HELIX_CPIPE: {
      id: 7,
      dialog_title: "Open Particle coordinates",
      placeholder: "*.box, *_pick.star",
      filter: '.box,_pick.star'
    },
    NODE_PARTS_HELIX_CPIPE: {
      id: 8,
      dialog_title: "Open Particle coordinates",
      placeholder: "*.box, *_pick.star",
      filter: '.box,_pick.star'
    },
    NODE_OPTIMISER_CPIPE: {
      id: 9,
      dialog_title: "Open Particle coordinates",
      placeholder: "*.box, *_pick.star",
      filter: '.box,_pick.star',
      nodetype: "ProcessData.star.relion.optimiser"
    },
    NODE_MASK_CPIPE: {
      id: 10,
      dialog_title: "Open 3D mask",
      placeholder: "*.mrc",
      filter: '.mrc',
      nodetype: "Mask3D.mrc"
    },
    NODE_HALFMAP_CPIPE: {
      id: 11,
      dialog_title: "Open Unfiltered half-map",
      placeholder: "*unfil.mrc",
      filter: '.unfil.mrc',
      nodetype: "DensityMap.mrc.halfmap"
    },
    NODE_RESMAP_CPIPE: {
      id: 12,
      dialog_title: "Open Particle coordinates",
      placeholder: "*.box, *_pick.star",
      filter: '.box,_pick.star',
      nodetype: "Image3D.mrc.localresmap"
    },
    NODE_LOGFILE_CPIPE: {
      id: 13,
      dialog_title: "Open Particle coordinates",
      placeholder: "*.box, *_pick.star",
      filter: '.box,_pick.star',
      filterdir: '',
      nodetype: "LogFile.pdf.relion"
    }
  },
  folders: {
    OUTNODE_MOVIES_CPIPE      : "MicrographMoviesData.star.relion",
    OUTNODE_MICS_CPIPE        : "MicrographsData.star.relion",
    OUTNODE_2DIMGS_CPIPE      : "ImagesData.star.relion",
    OUTNODE_MAP_CPIPE         : "DensityMap.mrc",
    OUTNODE_PARTS_CPIPE       : "ParticlesData.star.relion",
    OUTNODE_COORDS_CPIPE      : "MicrographsCoords.star.relion",
    OUTNODE_COORDS_HELIX_CPIPE: "MicrographsCoords.star.relion.helixstartend",
    OUTNODE_PARTS_HELIX_CPIPE : "ParticlesData.star.relion.helicalsegments",
    OUTNODE_OPTIMISER_CPIPE   : "ProcessData.star.relion.optimiser",
    OUTNODE_MASK_CPIPE        : "Mask3D.mrc",
    OUTNODE_HALFMAP_CPIPE     : "DensityMap.mrc.halfmap",
    OUTNODE_RESMAP_CPIPE      : "Image3D.mrc.localresmap",
    OUTNODE_LOGFILE_CPIPE     : "LogFile.pdf.relion",

    OUTNODE_IMPORT_MOVIES     : "MicrographMoviesData.star.relion",
    OUTNODE_IMPORT_MICS       : "MicrographsData.star.relion",
    OUTNODE_IMPORT_COORDS     : "MicrographsCoords.star.relion",
    OUTNODE_IMPORT_PARTS      : "ParticlesData.star.relion",
    OUTNODE_IMPORT_2DIMG      : "ImagesData.star.relion",
    OUTNODE_IMPORT_MAP        : "DensityMap.mrc",
    OUTNODE_IMPORT_MASK       : "Mask3D.mrc",
    OUTNODE_IMPORT_HALFMAP    : "DensityMap.mrc.halfmap",
    OUTNODE_MOCORR_MICS       : "MicrographsData.star.relion.motioncorr",
    OUTNODE_MOCORR_LOG        : "LogFile.pdf.relion.motioncorr",
    OUTNODE_CTFFIND_MICS      : "MicrographsData.star.relion.ctf",
    OUTNODE_CTFFIND_LOG       : "LogFile.pdf.relion.ctffind",
    OUTNODE_MANPICK_MICS      : "MicrographsData.star.relion",
    OUTNODE_MANPICK_COORDS    : "MicrographsCoords.star.relion.manualpick",
    OUTNODE_AUTOPICK_COORDS   : "MicrographsCoords.star.relion.autopick",
    OUTNODE_AUTOPICK_LOG      : "LogFile.pdf.relion.autopick",
    OUTNODE_AUTOPICK_TOPAZMODEL:"ProcessData.sav.topaz.model", // to be added?
    OUTNODE_AUTOPICK_MICS     : "MicrographsData.star.relion",
    OUTNODE_EXTRACT_PARTS     : "ParticlesData.star.relion",
    OUTNODE_EXTRACT_PARTS_REEX: "ParticlesData.star.relion.reextract",
    OUTNODE_EXTRACT_COORDS_REEX:"MicrographsCoords.star.relion.reextract",
    OUTNODE_CLASS2D_PARTS     : "ParticlesData.star.relion.class2d",
    OUTNODE_CLASS2D_OPT       : "ProcessData.star.relion.optimiser.class2d",
    OUTNODE_SELECT_MICS       : "MicrographsData.star.relion",
    OUTNODE_SELECT_MOVS       : "MicrographMoviesData.star.relion",
    OUTNODE_SELECT_PARTS      : "ParticlesData.star.relion",
    OUTNODE_SELECT_OPT        : "ProcessData.star.relion.optimiser.autoselect",
    OUTNODE_SELECT_CLAVS      : "ImagesData.star.relion.classaverages",
    OUTNODE_INIMOD_MAP        : "DensityMap.mrc.relion.initialmodel",
    OUTNODE_CLASS3D_OPT       : "ProcessData.star.relion.optimiser.class3d",
    OUTNODE_CLASS3D_MAP       : "DensityMap.mrc.relion.class3d",
    OUTNODE_CLASS3D_PARTS     : "ParticlesData.star.relion.class3d",
    OUTNODE_REFINE3D_HALFMAP  : "DensityMap.mrc.relion.halfmap.refine3d",
    OUTNODE_REFINE3D_OPT      : "ProcessData.star.relion.optimiser.refine3d",
    OUTNODE_REFINE3D_MAP      : "DensityMap.mrc.relion.refine3d",
    OUTNODE_REFINE3D_PARTS    : "ParticlesData.star.relion.refine3d",
    OUTNODE_MULTIBODY_HALFMAP : "DensityMap.mrc.relion.halfmap.multibody",
    OUTNODE_MULTIBODY_PARTS   : "ParticlesData.star.relion.multibody",
    OUTNODE_MULTIBODY_OPT     : "ProcessData.star.relion.optimiser.multibody",
    OUTNODE_MULTIBODY_FLEXLOG : "LogFile.pdf.relion.flexanalysis",
    OUTNODE_MULTIBODY_SEL_PARTS:"ParticlesData.star.relion.flexanalysis.eigenselected",
    OUTNODE_MASK3D_MASK       : "Mask3D.mrc.relion",
    OUTNODE_SUBTRACT_SUBTRACTED:"ParticlesData.star.relion.subtracted",
    OUTNODE_SUBTRACT_REVERTED : "ParticlesData.star.relion",
    OUTNODE_LOCRES_OWN        : "Image3D.mrc.relion.localresmap",
    OUTNODE_LOCRES_RESMAP     : "Image3D.mrc.resmap.localresmap",
    OUTNODE_LOCRES_FILTMAP    : "DensityMap.mrc.relion.localresfiltered",
    OUTNODE_LOCRES_LOG        : "LogFile.pdf.relion.localres",
    OUTNODE_CTFREFINE_REFINEPARTS:"ParticlesData.star.relion.ctfrefine",
    OUTNODE_CTFREFINE_LOG     : "LogFile.pdf.relion.ctfrefine",
    OUTNODE_CTFREFINE_ANISOPARTS:"ParticlesData.star.relion.anisomagrefine",
    OUTNODE_POLISH_PARTS      : "ParticlesData.star.relion.polished",
    OUTNODE_POLISH_LOG        : "LogFile.pdf.relion.polish",
    OUTNODE_POLISH_PARAMS     : "ProcessData.txt.relion.polish.params",
    OUTNODE_POST              : "ProcessData.star.relion.postprocess",
    OUTNODE_POST_MAP          : "DensityMap.mrc.relion.postprocess",
    OUTNODE_POST_MASKED       : "DensityMap.mrc.relion.postprocess.masked",
    OUTNODE_POST_LOG          : "LogFile.pdf.relion.postprocess"
/* TODO
    OUTNODE_MANPICK_COORDS_HELIX:     "MicrographsCoords.star.relion.manualpick.helixstartend",
    OUTNODE_EXTRACT_PARTS_HELIX:      "ParticlesData.star.relion.helicalsegments",
    OUTNODE_EXTRACT_COORDS_HELIX:     "MicrographsCoords.star.relion.helixstartend",
    OUTNODE_CLASS2D_PARTS_HELIX:      "ParticlesData.star.relion.class2d.helicalsegments",
    OUTNODE_CLASS3D_PARTS_HELIX:      "ParticlesData.star.relion.class3d.helicalsegments",
    OUTNODE_REFINE3D_PARTS_HELIX:     "ParticlesData.star.relion.refine3d.helicalsegements",
*/
  }
};


/*
  OUTNODE_TOMO_OPTIMISATION : "ProcessData.star.relion.tomo.optimisation_set"
  OUTNODE_TOMO_TOMOGRAMS    : "ProcessData.star.relion.tomo.relion.tomogram_set"
  OUTNODE_TOMO_TRAJECTORIES : "ProcessData.star.relion.tomo.relion.trajectory_set"
  OUTNODE_TOMO_MANIFOLDS    : "ProcessData.star.relion.tomo.manifoldset"
  OUTNODE_TOMO_PARTS        : "Particles.star.relion.tomo"
  OUTNODE_TOMO_MAP          : "DensityMap.mrc.relion.tomo.subvolume"
  OUTNODE_TOMO_HALFMAP      : "DensityMap.mrc.relion.tomo.halfmap"
  OUTNODE_TOMO_POST         : "ProcessData.star.relion.tomo.postprocess"
  OUTNODE_TOMO_POST_LOG     : "LogFile.pdf.relion.tomo.postprocess"
  OUTNODE_TOMO_FRAMEALIGN_LOG      "LogFile.pdf.relion.tomo.framealign"
  OUTNODE_TOMO_CTFREFINE_LOG: "LogFile.pdf.relion.tomo.ctfrefine"
*/


 /**
 * Receive the response of the server and display the result on the HTML page
 * @param  {Websocket} websocket  Server

const receive = (websocket) => {
  websocket.addEventListener("message", (response) => {
    console.log(response);
    const msg = JSON.parse(response.data);

    console.log(`[message] Data received from server: ${msg}`);

    // Dispatch data
    if (event['data'] != null){
      let data = event['data']
      GRINDER.jobs = JSON.parse(msg);
    }
  });
}

 
// https://github.com/jcao219/websocket-async/blob/master/src/websocket-client.js
// 
const receive = function() {
  if (GRINDER.receiveDataQueue.length !== 0) {
    // We have a message ready.
    return Promise.resolve(GRINDER.receiveDataQueue.shift());
  }

  // Wait for the next incoming message and receive it.
  const receivePromise = new Promise((resolve, reject) => {
    GRINDER.receiveCallbacksQueue.push({ resolve, reject });
  });

  return receivePromise;
};
 */
 
 
/*
 * Run the WebSocket Client and try to connect to the python WebSocket server
*/
const connect_to_ws_server = async () => {
  const ip_address = document.getElementById('ws_server_ip').value;
  const port = document.getElementById('ws_port').value;

  // Open the WebSocket connection and register event handlers.
  await GRINDER.server.connect(`ws://${ip_address}:${port}/`);

  if (GRINDER.server.connected) {
      alert(`[Open] Connection established with server ws://${ip_address}:${port}/`);
      document.getElementById('connect').innerHTML = '<i class="bi bi-wifi"></i>Connected';
      document.getElementById('connect').style.color = 'lightgreen';
  }
  else {
      alert(`[Fail] Unable to connect to the server ws://${ip_address}:${port}/`);
  }

/*
//  GRINDER.websocket.onmessage = (event) => {};

  GRINDER.websocket.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      alert('[close] Connection died');
    }
  };

  GRINDER.websocket.onerror = function(error) {
    alert(`[error]`);
  };

   // Step #1 - Get default_pipeline.json of Project
    let cli = {
      end:0,
      action: {
        tool: 'grelion.py',
        title:'project',
        args:'--get default_pipeline.json'
      }
    };
    GRINDER.websocket.send(JSON.stringify(cli));

  receive(GRINDER.websocket);
*/
};

  
