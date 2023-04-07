//  GRINDER - Graphical user interface of RelIoN and DataminER
//  Copyright (C) 2023  Jean-Christophe Taveau
//
//  This file is part of GRINDER
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with GRINDER. If not, see <http://www.gnu.org/licenses/>.
//
// Authors : Texier Louis

/** Close the dialog and send request to apply the action
 *
 * @param {HTMLElement} el Dialog box
 * @param {String} action Type of action to apply
 */
 
 const browse_dir = async (path,hidden=true) => {
   if (!GRINDER.server.connected) {
    alert('Please connect to the ws server');
  }
  else {
   // Step #1 - Get default_pipeline.json of Project
    let cli = {
      action: {
        tool: 'BROWSE',
        args: `--i ${path} ${(hidden) ? '--hidden true' : ''}`
      }
    };
  
    GRINDER.server.send(JSON.stringify(cli));
    const response = await GRINDER.server.receive();
    return response;
 }
}

const select_file = (target,fullfilename) => {
  const parent = target.closest('li');
  if (parent.classList.contains('selected')) {
    parent.classList.remove('selected');
    parent.removeChild(parent.lastChild);
  }
  else {
    parent.classList.add('selected');
    parent.appendChild(h('i.bi.bi-check2-square.check',{style:{color: '#eee'}}));
  }

  console.log('select',fullfilename);
}

const update_path = async (path) => {
  // Split
  const dirs = path.split('/');
  // Init
  let parent = document.querySelector('dialog .path');
  
  const folder_path = [
    h('a',
      {
        props: {href: '#'},
        dataset: {path:dirs[0]},
        on: {
          click: (ev) => update_path(ev.target.closest('a').dataset.path)
       } 
      },
      [
        h('i.bi.bi-house-door')
      ]
    )
  ];
  
  // Build
  let fullpath = '.';
  let children = dirs.slice(1).reduce( (accu,dir) => {
    fullpath += '/' + dir;
    accu.push(h('i.bi.bi-chevron-right'));
    accu.push(h('a',
      {
        props: {href: '#'},
        dataset: {path:fullpath},
        on: {
          click: (ev) => update_path(ev.target.dataset.path)
        }
      },
      dir
      )
    );
    return accu;
  },folder_path);
  parent.replaceChildren(...children);
  
  // Step #2 - Fill panel `filetree with folders first and then files
  content = await browse_dir(path);
  content = JSON.parse(content);
  console.log(content);
  parent = document.querySelector('dialog .filetree ul');
  folders = content.dirs.sort().map( dir => {
    const child = h('li',[
      h('a',
        {
          props: {href: '#'},
          dataset: {path:dir},
          on: {
            click: (ev) => update_path(`${path}/${dir}`)
          }
        },
        [
          h('i.bi.bi-folder-fill'),
          h('span',dir)
        ]
      )
    ]);
    return child;
  });
  
  const extensions={
    jpeg: 'bi-file-earmark-image',
    jpg: 'bi-file-earmark-image',
    json: 'bi-filetype-json',
    mrc: 'bi-file-earmark-image',
    mrcs: 'bi-files',
    pdf: 'bi-file-pdf',
    png: 'bi-file-earmark-image',
    star: 'bi-file-earmark-medical',
    tif: 'bi-file-earmark-image',
    tiff: 'bi-file-earmark-image',
  };
  files = content.files.sort().map( file => {
    const extension = file.split('.').pop();
    const icon_extension = extensions[extension] || 'bi-file';
    const child = h('li',[
      h('a',
        {
          props: {href: '#'},
          dataset: {path:file},
          on: {
            click: (ev) => select_file(ev.target,`${path}/${file}`)
          }
        },
        [
          h(`i.bi.${icon_extension}`),
          h('span',file)
        ]
      )
    ]);
    return child;
  });

  parent.replaceChildren(...folders,...files);
}


/************* E VE N T S *******************/

const openDialog = (ev) => {

  const trapFocus = (e) => {
    if (e.key === "Tab") {
      const tabForwards = !e.shiftKey && document.activeElement === lastElement;
      const tabBackwards = e.shiftKey && document.activeElement === firstElement;
      if (tabForwards) {
        // only TAB is pressed, not SHIFT simultaneously
        // Prevent default behavior of keydown on TAB (i.e. focus next element)
        e.preventDefault();
        firstElement.focus();
      } else if (tabBackwards) {
        // TAB and SHIFT are pressed simultaneously
        e.preventDefault();
        lastElement.focus();
      }
    }
  };
    
  let dialog = document.querySelector("dialog");
  dialog.querySelector('#dialog_title').innerText = ev.target.dataset.title;
  
  const elements = dialog.querySelectorAll(
    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = elements[0];
  const lastElement = elements[elements.length - 1];

  const openDialogBtn = document.getElementById("open_dialog");
  const closeDialogBtn = document.getElementById("close_dialog");
  dialog.showModal();
  dialog.addEventListener("keydown", trapFocus);
  update_path('.');
};

const closeDialog = (e) => {
  e.preventDefault();
  dialog.close();
  dialog.removeEventListener("keydown", trapFocus);
  openDialogBtn.focus();
};


/************* M A I N *******************/


openDialogBtn.addEventListener("click", openDialog);
closeDialogBtn.addEventListener("click", closeDialog);
    
