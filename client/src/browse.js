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
 
class FileChooser {
  /**
   * mode: single, multi, series
   */
  constructor(mode='single',parent='body') {
    this.parent = parent;
    this.mode = mode;
    this.files = [];
    document.appendChild(_createHTML());
  }
  
  open(root,directories,files) {
    // Step #1
    // Step #2
  }
  
  update(root,directories,files) {
  
  }
  
  _create() {
  
    const multi = [];
    
    return h('dialog.browse',
      {
        props: {
          'aria-labelledby' : 'dialog_title',
          'aria-describedby': "dialog_description"
        }
      },
      [
        h('div.header',
          [
            h('nav',
            [
              h('ul',
                [
                  h('li#dialog_title'),
                  h('li',
                    [h('span.space')]
                  ),
                  h('li',
                    [
                      h('a',
                        {
                          props: {href:'#',title:'Sort By'}
                        },
                        [
                          h('i.bi.bi-sort-down-alt')
                        ]
                      )
                    ]
                  ),
                  h('li',
                    [
                      h('a',
                        {
                          props: {href:'#',title:'Refresh'}
                        },
                        [
                          h('i.bi.bi-arrow-clockwise')
                        ]
                      )
                    ]
                  ),
                  h('li',
                    [
                      h('a',
                        {
                          props: {href:'#',title:'Select All'}
                        },
                        [
                          h('i.bi.bi-check-all')
                        ]
                      )
                    ]
                  ),
                  h('li',
                    [
                      h('a',
                        {
                          props: {href:'#',title:'Information'}
                        },
                        [
                          h('i.bi.bi-info-circle')
                        ]
                      )
                    ]
                  ),
                  h('li',
                    [
                      h('a#close_dialog',
                        {
                          props: {href:'#',title:'Close Dialog'}
                        },
                        [
                          h('i.bi.bi-x-circle')
                        ]
                      )
                    ]
                  ),
                ]
              )
              ]
            )
          ]
        ),
        h('div.path'),
        h('div.filetree',[h('ul')]),
        h('footer',
          [
            h('a#open_file',
              {
                props: {href:'#',title:'Open file.s'}
              },
              'Open'
            ),
            h('a#cancel',
              {
                props: {href:'#',title:'Cancel'}
              },
              'Cancel'
            )
          ]
        )
      ]
    );
    
  }
} // End of class FileBrowser

const extensions_and_icons = {
  csv: 'bi-file-earmark-spreadsheet',
  gif: 'bi-file-earmark-image',
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
  tsv: 'bi-file-earmark-spreadsheet',
  txt: 'bi-file-earmark-text'
};
  
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

const select_file = (target,fullfilename,mode='single') => {
  const parent = target.closest('li');
  if (mode === 'single') {
    if (!parent.classList.contains('selected') ) {
      // Remove all the other selections
      const ulist = target.closest('ul');
      for (const item of ulist.children) {
        item.classList.remove('selected');
      }
    }
  }

  if (parent.classList.contains('selected')) {
    parent.classList.remove('selected');
    parent.removeChild(parent.lastChild);
  }
  else {
    parent.classList.add('selected');
    /*parent.appendChild(h('i.bi.bi-check2-square.check',{style:{color: '#eee'}}));*/
  }

  console.log('select',fullfilename);
}

const detect_prefix = (files) => {
  // Step #1 - Create all words
  words = [];
  for (let i of Array.from({length: files[0].length},(_,i) => i+1)) {
    words.push(files[0]);
  } 
}

const update_path = async (path,filter_files) => {
  // Step #1 - Split
  const dirs = path.split('/');
  
  // Step #2 - Init
  let parent = document.querySelector('dialog .path');

  // Step #3 - Build path buttons for navigating thru directories  
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
  
  // Step #4 - Fill panel `filetree with folders first and then files
  content = await browse_dir(path);
  content = JSON.parse(content);
  console.log(content);
  parent = document.querySelector('dialog .filetree ul');
  folders = content.dirs.sort().map( dir => {
    const child = h('li',[
      h('a',
        {
          props: {href: '#'},
          dataset: {path:`${path}/${dir}`},
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
  
  files = content.files.sort().map( file => {
    const extension = file.split('.').pop();
    const icon_extension = extensions_and_icons[extension] || 'bi-file-earmark';
    const child = h('li',
      {
        dataset: {path: fullpath,file:file},
      },
    [
      h('a',
        {
          props: {href: '#'},
          dataset: {path: fullpath,file:file},
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
    
  const closeDialog = (ev) => {
    ev.preventDefault();
    dialog.close();
    dialog.removeEventListener("keydown", trapFocus);
  };

  const sortby = (ev) => {
    const sortparams = ev.target.closest('sortby').querySelectorAll('.menuitemselected');
    
    e.preventDefault();
    dialog.close();
    dialog.removeEventListener("keydown", trapFocus);
  };


  /************* M A I N *******************/
  let filter_files = ev.target.dataset.filter;
  let inputfile = ev.target.dataset.inputfile;
  
  let dialog = document.querySelector("dialog");
  dialog.querySelector('#dialog_title').innerText = ev.target.dataset.title;
  
  const elements = dialog.querySelectorAll(
    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = elements[0];
  const lastElement = elements[elements.length - 1];

  // Open button...
  const openFileBtn = document.getElementById("open_file");
  const closeDialogBtn = document.getElementById("close_dialog");

  openFileBtn.addEventListener("click", (ev) => {
    const items = document.querySelectorAll('.filetree ul li');
    const files = [...items]
      .filter((el) => el.classList.contains('selected'))
      .map((el) => `${el.dataset.path}/${el.dataset.file}`);
    console.log(files,ev.target.dataset);
    const inputfileHTML = document.getElementById(inputfile);
    inputfileHTML.value = files[0];
    inputfileHTML.focus();
    inputfileHTML.scrollLeft = inputfileHTML.scrollWidth;   
    closeDialog(ev);
  });
  
  document.getElementById('cancel').addEventListener("click", closeDialog);
  closeDialogBtn.addEventListener("click", closeDialog);
  
  dialog.showModal();
  dialog.addEventListener("keydown", trapFocus);
  update_path('.', filter_files);
};

const fc_sortby = (param) => (ev) => {
  let param = ev.target.dataset.type;
  console.log(param);
  const els = ev.target.closest('#sortby').children;
  for (const el of els) {
    if (el.dataset.type == param) {
      el.classList.remove('menuitemselected');
      el.classList.add('menuitem');
    }
  }
  ev.target.classList.remove('menuitem');
  ev.target.classList.add('menuitemselected');
  
  // Sort files TODO
}


