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
  constructor(server, mode='single',parent=document.body) {
    console.log('Create...');
    this.server = server;
    this.parent = parent;
    this.mode = mode;
    this.files = [];
    this.dialog = parent.querySelector('dialog.filechooser');
    if (!this.dialog) {
      this.dialog = h('dialog.filechooser',
        {
          props: {
            'aria-labelledby' : 'dialog_title',
            'aria-describedby': "dialog_description"
          }
        }
      );
    }
    this.dialog.replaceChildren(...this._createChildren());
    document.body.appendChild(this.dialog);
  }
  
  select_file(target,fullfilename,mode='single') {
    const parent = target.closest('li');
    if (this.mode === 'single') {
      if (!parent.classList.contains('selected') ) {
        // Remove all the other selections
        const ulist = target.closest('ul');
        for (const item of ulist.children) {
          item.classList.remove('selected');
        }
      }
    }
    // Update `selected` status
    if (parent.classList.contains('selected')) {
      parent.classList.remove('selected');
    }
    else {
      parent.classList.add('selected');
      /*parent.appendChild(h('i.bi.bi-check2-square.check',{style:{color: '#eee'}}));*/
    }

    console.log('select',fullfilename);
  }

  async update_path(path,filter_files) {
    // Step #1 - Split
    const dirs = path.split('/');
    
    // Step #2 - Init
    let parent = this.dialog.querySelector('.path');

    // Step #3 - Build path buttons for navigating thru directories  
    const folder_path = [
      h('a',
        {
          props: {href: '#'},
          dataset: {path:dirs[0]},
          on: {
            click: (ev) => this.update_path(ev.target.closest('a').dataset.path)
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
            click: (ev) => this.update_path(ev.target.dataset.path)
          }
        },
        dir
        )
      );
      return accu;
    },folder_path);
    parent.replaceChildren(...children);
    
    // Step #4 - Get from server the files 
    let content = await this.browse_dir(path);
    content = JSON.parse(content);
    // HACK console.log(content);
    
    // Step #5 - Fill panel `filetree with folders first and then files
    parent = document.querySelector('dialog .filetree ul');

    // Step # 5.2 - Add Folders
    let folders = content.dirs.sort().map( dir => {
      const child = h('li',[
        h('a.folder',
          {
            props: {href: '#'},
            dataset: {path:`${path}/${dir}`},
            on: {
              click: (ev) => this.update_path(`${path}/${dir}`)
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

    // Step # 5.3 - Add Files
    let files = content.files.sort().map( (file,index) => {
      const extension = file.split('.').pop();
      const icon_extension = FileChooser.extensions_and_icons[extension] || 'bi-file-earmark';
      const child = h('li',
        {
          dataset: {path: fullpath,file:file},
        },
      [
        h('a.file',
          {
            props: {href: '#'},
            dataset: {path: fullpath,file:file},
            on: {
              click: (ev) => this.select_file(ev.target,`${path}/${file}`)
            }
          },
          [
            h(`i.bi.${icon_extension}`),
            h('span.filename',file),
            h('span.size_bytes',content.stats[index].size_in_bytes.toString()),
            h('span.mdate',content.stats[index].mdate),
            h('i.bi.bi-check2-square'),
          ]
        )
      ]);
      return child;
    });

    parent.replaceChildren(...folders,...files);
  }

  async browse_dir(path,hidden=true) {
     if (!this.server.connected) {
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
    
      this.server.send(JSON.stringify(cli));
      const response = await this.server.receive();
      return response;
    }
  }
  
  
  fc_sortby(param) {
    return (ev) => {
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
  }
  
  /**
   * Open Dialog and set events for various header buttons
   */
  openDialog(ev) {

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
      this.dialog.close();
      this.dialog.removeEventListener("keydown", trapFocus);
    };

    const sortby = (ev) => {
      const sortparams = ev.target.closest('sortby').querySelectorAll('.menuitemselected');
      
      e.preventDefault();
    };

    const infofile = (ev) => {
      const sortparams = ev.target.closest('sortby').querySelectorAll('.menuitemselected');
      
      e.preventDefault();
    };


    //************* M A I N ******************
    let filter_files = ev.target.dataset.filter;
    let inputfile = ev.target.dataset.inputfile;
    
    // Set Title
    this.dialog.querySelector('#dialog_title').innerText = ev.target.dataset.title || 'File Chooser';
    
    const elements = this.dialog.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    // Open button...
    const openFileBtn = document.getElementById("open_file");

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
    
    // Close and Cancel buttons...
    const closeDialogBtn = this.dialog.querySelector("#close_dialog");
    closeDialogBtn.addEventListener("click", closeDialog);
    this.dialog.querySelector('#cancel').addEventListener("click", closeDialog);

    // Show modal
    this.dialog.showModal();
    this.dialog.addEventListener("keydown", trapFocus);
    this.update_path('.', filter_files);
  };

  // Private
  static get extensions_and_icons() {
    return {
      csv: 'bi-file-earmark-spreadsheet',
      eer: 'bi-file-earmark-image',
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
    }
  };
  
  
  // Private
  _createChildren() {
  
    const multi = [];
    
    return [
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
      h('div.filehead',
        [h('span.fileheaditem','Name'),h('span.fileheaditem','Size'),h('span.fileheaditem','Date'),]
      ),
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
    ];
  }
} // End of class FileBrowser



const detect_prefix = (files) => {
  // Step #1 - Create all words
  words = [];
  for (let i of Array.from({length: files[0].length},(_,i) => i+1)) {
    words.push(files[0]);
  } 
}



/************* E VE N T S *******************/

/*
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
  };

  const infofile = (ev) => {
    const sortparams = ev.target.closest('sortby').querySelectorAll('.menuitemselected');
    
    e.preventDefault();
  };


  //************* M A I N *******************
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
*/




