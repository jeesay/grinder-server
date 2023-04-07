
'use strict';

const jobtypes = [
  {
    type: "relion.autopick.ref2d",
    widget: 'picking',
    main_panel: () => picking_tabs
  },
  {
    type: "relion.autopick.topaz.pick",
    widget: 'picking',
    main_panel: () => picking_tabs
  },
  {
    type: "relion.autopick.topaz.train",
    widget: 'picking',
    main_panel: () => picking_tabs
  },
  {
    type: "relion.class2d",
    widget: 'class2d',
    subtypes: {
      '--grad': 'vdam',
      '--helix': 'helix',
      '--em': 'em'
    },
    main_panel: () => class2d_tabs
  },
  {
    type: "relion.class3d",
    widget: 'rec3d',
    tool: 'rec3d_xxx',
    main_panel: () => rec3d_tabs,
    update: (args) => {
      document.querySelector(`#class3d_particles`).checked = true;
      w_navtab_update({io: class3d_io_tab, settings: class3d_tab, optim: class3d_optim_tab});
    }
  },
  {
    type: "relion.ctffind.ctffind4",
    widget: 'ctf',
    main_panel: () => ctf_tabs
  },
  {
    type: "relion.ctfrefine",
    widget: 'ctf',
    main_panel: () => ctf_tabs
  },
  {
    type: "relion.ctfrefine.anisomag",
    widget: 'ctf',
    main_panel: () => ctf_tabs
  },
  {
    type: "relion.extract",
    widget: 'extract',
    main_panel: () => extract_tabs
  },
  {
    type: "relion.extract.reextract",
    widget: 'extract',
    main_panel: () => extract_tabs
  },
  {
    type: "relion.import.movies",
    widget: 'import',
    main_panel: () => import_tabs,
//      tabs: {settings: ugraph_settings}
  },
  {
    type: "relion.import.other",
    widget: 'import',
    main_panel: () => import_tabs,
//      tabs: {settings: other_settings}
  },
  {
    type: "relion.initialmodel",
    widget: 'abinitio',
    main_panel: () => abinitio_tabs
  },
  {
    type: "relion.joinstar.particles",
    widget: 'tools',
    main_panel: () => tools_tabs
  },
  {
    type: "relion.manualpick",
    widget: 'picking',
    main_panel: () => picking_tabs
  },
  {
    type: "relion.maskcreate",
    widget: 'postprocess',
    main_panel: () => postprocess_tabs,
    tool: 'mask',
    update: (args) => w_navtab_update({io: mask_io_tab, settings: mask_settings_tab})
  },
  {
    type: "relion.motioncorr.own",
    widget: 'motioncorr',
    main_panel: () => motioncor_tabs
  },
  {
    type: "relion.polish",
    widget: 'postprocess',
    tool: 'polish_anisomag',
    main_panel: () => postprocess_tabs,
    update: (args) => w_navtab_update({io: polish_io_tab, settings: polish_ptcls_optim_settings})
  },
  {
    type: "relion.polish.train",
    widget: 'postprocess',
    tool: 'polish_train',
    main_panel: () => postprocess_tabs,
    update: (args) => w_navtab_update({io: polish_io_tab, settings: polish_train_settings})
  },
  {
    type: "relion.postprocess",
    widget: 'postprocess',
    tool: 'sharpen',
    main_panel: () => postprocess_tabs,
    update: (args) => {
      let flag = args.includes('--auto_bfac');
      w_navtab_update({io: post_io_settings, settings: post_settings(flag)});
    }
  },
  {
    type: "relion.refine3d",
    widget: 'refine3d',
    main_panel: () => refine_tabs
  },
  {
    type: "relion.select.interactive",
    widget: 'tools',
    main_panel: () => tools_tabs
  },
  {
    type: "relion.select.onvalue",
    widget: 'tools',
    main_panel: () => tools_tabs
  },
  {
    type: "relion.select.split",
    widget: 'tools',
    tool: 'split_xxx',
    main_panel: () => tools_tabs,
    update: (args) => {
      let flag = args.includes('--size_split');
      if (flag) {
        document.querySelector(`#split_e`).checked = true;
        w_navtab_update({io: select_io_settings, settings: split_size_ptcls_tab});
        let target = document.querySelector('#select_io_filetype');
        select_add({target});
      }
      else {
        document.querySelector(`#split_n`).checked = true;
        w_navtab_update({io: select_io_settings, settings: split_n_ptcls_tab});
        let target = document.querySelector('#select_io_filetype');
        select_add({target});
      }

    }
 
  }
];

console.log(jobtypes);

const set_job_params = (gui,json) => {
  // Check button in first tab (Tools)
  if (document.querySelector(`#${gui.tool}`)) {
      document.querySelector(`#${gui.tool}`).checked = true;
  }
  // Step #1: Get params and create the other tabs
  json.cli.forEach( cli => {
    const script = cli.script[0];
    const args = Object.keys(script.options).reduce( (accu,key) => `${accu} ${key} ${script.options[key]}\n`, '');

    // Update `Check command`
    document.querySelector('#relion_cli').appendChild(
      h('pre',`${cli.script[0].command}\n${args}`)
    );
    gui.update(args);
  });
  // Set the values in various tabs
  json.cli.forEach( cli => {
    const script = cli.script[0];
    Object.keys(cli.script[0].options).forEach(key => {
      console.log(key);
      let els = document.querySelectorAll(`[data-option~="${key}"]`);
      if (els) {
        console.log('Set...',key,cli.script[0].options[key]);
        els.forEach(el => {
          if (el.type === 'checkbox') {
            el.checked = cli.script[0].options[key];
          }
          else {
            el.value = cli.script[0].options[key];
            const len = el.value.length;
              
            // Mostly for Web Browsers
            if (el.setSelectionRange) {
                el.focus();
                el.setSelectionRange(len, len);
            }
          }
        });
      }
    })
  });
}


const view_job = async (ev) => {
  // From `job.json`
  const jinfo = ev.target.parentNode.dataset;
  const gui = jobtypes.filter( (j) => j.type === jinfo.jtype)[0];
  console.log(gui);
  // Reset
  document.querySelectorAll('aside ul li').forEach(ww => ww.classList.remove("active"));
  //
  const w = document.querySelector(`aside #${gui.widget}`);
  w.classList.add("active");
  // Create empty menus
  w_navtab(document.querySelector('section'),gui.main_panel());
  // Ask for the various parameters of this job
  GRINDER.server.send(
    JSON.stringify(
      {
        action: {
          tool: 'GET',
          source:'project',
          args:`${jinfo.jpath}/job.json`
        }
      }
    )
  );
  const response = await GRINDER.server.receive();
  // Set the various parameters
  set_job_params(gui,JSON.parse(response));
}

const copy_job = (ev) => {
  console.log(ev.target.dataset);
}

