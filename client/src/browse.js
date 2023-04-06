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
 function answerYes(el,action){
  el.close();
  const event = {
   'end':0,
   'action': {
    'title':'Project',
    'name':"Project",
    'param':[],
    'algo':action,
    'script':'gk_project'
   }
  };
  GIMMICK.websocket.send(JSON.stringify(event));
 }
 
/** Close the dialog
 *
 * @param {HTMLElement} el Dialog box
 */
 function answerNo(el){
  el.close();
 }
 
/** Send a request to apply an action
 *
 * @param {String} action Type of action to apply
 */
 function checkProject(action){
   const event = {
    'end':0,
    'action': {
     'title':'Project',
     'name':"Project",
     'param':[],
     'algo':action,
     'script':'gk_project'
    }
   };
   GIMMICK.websocket.send(JSON.stringify(event));
 }
 
/** Send request to empty the Trash folder
 *
 */
 function emptyTrash(){
  const event = {
   'end':0,
   'action': {
    'title':'Job',
    'name':'Job',
    'param':[],
    'algo':'Empty',
    'script':'gk_workflow'
   }
  };
  GIMMICK.websocket.send(JSON.stringify(event));
 }
 
/** Send request to search the available projects
 *
 */
 function displayProjects(){
  const event = {
   'end':0,
   'action': {
    'title':'Project',
    'name':'Project',
    'param':[],
    'algo':'ls',
    'script':'gk_project'
   }
  };
  GIMMICK.websocket.send(JSON.stringify(event));
 }
 
/** Send a request to open a past project
 *
 * @param {Event} ev Event saved
 */
 function openProject(ev){
  let el = document.querySelectorAll('dialog#open');
  for (let element of el){
   element.close();
  }
  const event = {
   'end':0,
   'action': {
    'title':'Project',
    'name':ev.target.textContent,
    'param':[],
    'algo':'Open',
    'script':'gk_project'
   }
  };
  GIMMICK.websocket.send(JSON.stringify(event));
 }

/** Send request to search raw data
 *
 */
 function searchRawData(){
  const event = {
   'end':0,
   'action': {
    'title':'Search',
    'name':'RawData',
    'param':[],
    'algo':'RawData',
    'script':'gk_search'
   }
  };
  GIMMICK.websocket.send(JSON.stringify(event));
 }

/** Send request to search available directories
 *
 */
 function searchDir(){
  let el = document.querySelector("aside > ul > li.active");
  const event = {
   'end':0,
   'action': {
    'title':'Search',
    'name':el.textContent.replace(/ /g,""),
    'param':[],
    'algo':'Dir',
    'script':'gk_search'
   }
  };
  GIMMICK.websocket.send(JSON.stringify(event));
 }

/** Send request to search available data
 *
 * @param {Event} ev Event saved
 */
 function searchJsonFiles(ev){
  JOB.id = ev.target.textContent;
  const event = {
   'end':0,
   'action': {
    'title':'Search',
    'name':ev.target.textContent,
    'param':[],
    'algo':'Data',
    'script':'gk_search'
   }
  };
  GIMMICK.websocket.send(JSON.stringify(event));
 }

/** Send request to search job directories
 *
 * @param {Event} ev Event saved
 */
function searchToolDir(ev){
 const event = {
  'end':0,
  'action':{
   'title':'Search',
   'name':ev.target.textContent,
   'param':[],
   'algo':'DirAlgo',
   'script':'gk_search'
  }
 };
 GIMMICK.websocket.send(JSON.stringify(event));
}

/** Open dialog box with two buttons
 *
 * @param {String} text Text to display in the dialog
 * @param {String} action Type of action to apply
 */
const open_dialog = (filetree,action) => {
  let el = h('dialog#newProject',[
   h('header'),
   h('div#label',[
    h('label#text',filetree),
   ]),
   h('div#buttons',[
     h('div#but1.button',[
       h('button#yes',{on:{'click': (ev) => answerYes(el,action)}},"YES")
     ]),
     h('div#but2.button',[
       h('button#no',{on:{'click': (ev) => answerNo(el)}},"NO")
     ])
   ])
  ]);
  document.body.appendChild(el);
  el.showModal();
}

/** Open a dialog box with all project saved
 *
 * @param {Array} array Array containing title of the projects
 */
 function searchDialog(array){
  let el = h('dialog#open',{
    attrs:{'aria-labelledby':"dialog_title", 'aria-descibedby':'dialog_description'}
  },
  [
    h('div.header',[
      h('nav',[
         h('ul',[
           h('li',[
             h('span.title',"File explorer"),
             h('span.toolset',[
               h('a#close_dialog',{
                 attrs:{
                   href:"#"
                 },
                 on:{'click': (ev) => closeDialog(ev)}
               },
               [
                 h('i#cross.bi bi-x-square-fill')
               ])
             ])
           ])
         ])
       ])
     ]),

     h('div.main',[
      h('div#folders',[
        h('ul#displayFolders')
      ])
    ]),
   ]);

  document.body.appendChild(el);
  let ul = document.querySelectorAll("ul#displayFolders");
  let lastChild = ul[ul.length-1];
  for (let fold of array){
   let folder = h('li',[
    h('a',{
     attrs :{
      href:"#",
      onclick: 'openProject(event)'
     }
    },
    fold
    )
   ]);
   lastChild.appendChild(folder);
  }
  el.showModal();
 }
 
/** Close all dialog boxes
 *
 * @param {Event} ev Event saved
 */
 function closeDialog(ev){
  const dialogs = document.querySelectorAll('dialog');
  const dialog = dialogs[dialogs.length-1];
  dialog.close();
 }

/** Open a dialog box with all raw data
 *
 * @param {Array} array Array containing title of the files
 */
 function openRawDialog(array){
  let el = h('dialog#open',{
   attrs:{'aria-labelledby':"dialog_title", 'aria-descibedby':'dialog_description'}
   },
   [
    h('div.header',[
 
     h('nav',[
       h('ul',[
         h('li',[
           h('span.title',"File explorer"),
           h('span.toolset',[
             h('a#close_dialog',{
               attrs:{
                 href:"#"
               },
               on:{'click': (ev) => closeDialog(ev)}
             },
             [
               h('i#cross.bi bi-x-square-fill')
             ])
           ])
         ])
       ])
     ])
   ]),
 
   h('div.main',[
 
    h('div#folders',[
     h('ul',[
      h('li',[
       h('a',{
        attrs:{
         href:"#"
        }
       },
       "Raw_data"
       )
      ])
     ])
    ]),
 
    h('div#files',[
     h('ul#displayFiles')
    ])
 
   ])
  ]);
 
  document.body.appendChild(el);
 
  let ul = document.querySelectorAll("ul#displayFiles");
  let lastChild = ul[ul.length-1];
  for (let file of array){
   let f = h('li',[
    h('i#fileicon.bi bi-file-earmark-binary'),
    h('a',{
     attrs :{
      href:"#",
     },
     on:{'click': (ev) => setValueImport(ev)}
    },
    file
    )
   ]);
   lastChild.appendChild(f);
  }
  el.showModal();
 }

/** Update value of the import button
 *
 * @param {Event} ev Event saved
 */
 function setValueImport(ev){
  closeDialog(ev);
  let button = document.querySelector("button#Import");
  button.setAttribute("value",ev.target.textContent);
  let lab = document.querySelector("label#value");
  lab.textContent = ev.target.textContent;
 }
 
/** Open a dialog box with all available directories and data
 *
 * @param {Array} array Array containing title of the directories
 */
 function openDirDialog(array){
  let el = h('dialog#open',{
   attrs:{'aria-labelledby':"dialog_title", 'aria-descibedby':'dialog_description'}
   },
   [
     h('div.header',[
 
       h('nav',[
         h('ul',[
           h('li',[
             h('span.title',"File explorer"),
             h('span.toolset',[
               h('a#close_dialog',{
                 attrs:{
                   href:"#"
                 },
                 on:{'click': (ev) => closeDialog(ev)}
               },
               [
                 h('i#cross.bi bi-x-square-fill')
               ])
             ])
           ])
         ])
       ])
     ]),
 
     h('div.main',[
      h('div#folders',[
        h('ul#displayFolders')
      ]),
      h('div#folders',[
       h('ul#displayFoldersJobs',[
        h('li',[
         h('a')
        ])
       ])
      ]),
      h('div#files',[
       h('ul#displayFiles')
      ])
    ]),
   ]);
 
  document.body.appendChild(el);
  let ul = document.querySelectorAll("ul#displayFolders");
  let lastChild = ul[ul.length-1];
  for (let fold of array){
   let folder = h('li',[
    h('i#fileicon.bi bi-folder'),
    h('a',{
     attrs :{
      href:"#",
      onclick: 'searchToolDir(event)'
     }
    },
    fold
    )
   ]);
   lastChild.appendChild(folder);
  }

  if (Object.keys(WORKFLOW).length != 2){
   let folder = h('li',[
    h('i#fileicon.bi bi-folder'),
    h('a',{
     attrs :{
      href:"#",
      onclick: 'updateDialogWorkflow()'
     }
    },
    "Workflow"
    )
   ]);
   lastChild.appendChild(folder);
  }

  el.showModal();
 }

/** Update dialog when non real folder Workflow is opened
 * 
 */
function updateDialogWorkflow(){
 let ul = document.querySelectorAll("ul#displayFoldersJobs");
 let lastChild = ul[ul.length-1];
 clear(lastChild);

 for (let wjob of Object.keys(WORKFLOW)){
  if (wjob.includes("job_")){
   let id = wjob.split("_")[1];
   let path = WORKFLOW[wjob]["action"]["title"] + "/job_" + id;
   let folder = h('li',[
    h('i#fileicon.bi bi-folder-symlink'),
    h('a',{
     attrs :{
      href:'#',
      onclick: 'updateDialogWorkflowFile(event)'
     }
    },
    path
    )
   ]);
   lastChild.appendChild(folder);
  }
 }
}

/** Update the dialog with the non real json file
 * 
 * @param {Event} ev Event of the click
 */
function updateDialogWorkflowFile(ev){
 let ul = document.querySelectorAll("ul#displayFiles");
 let lastChild = ul[ul.length-1];
 clear(lastChild);
 let name = "File.json";

 let f = h('li',[
  h('i#fileicon.bi bi-file-earmark'),
  h('a',{
   attrs :{
    href:"#",
    id: ev.target.textContent,
    onclick: "setValueFileWorkflow(event)"
   }
  },
  name
  )
 ]);
 lastChild.appendChild(f);
}

/** Update the dialog box with files from the selected directories
 *
 * @param {Array} array Array containing title of the files
 */
 function updateDialog(array){
  let ul = document.querySelectorAll("ul#displayFiles");
  let lastChild = ul[ul.length-1];
  clear(lastChild);
  if (array.length == 1 && array[0] == ""){
   lastChild.textContent = "No file found";
  }
  else {
   for (let file of array){
    let f = h('li',[
     h('i#fileicon.bi bi-file-earmark-binary'),
     h('a',{
      attrs :{
       href:"#",
      },
      on:{'click': (ev) => setValueFile(ev)}
     },
     file
     )
    ]);
    lastChild.appendChild(f);
   }
  }
 }
  
 
/** Update value of load button
 *
 * @param {Event} ev Event saved
 */
 function setValueFile(ev){
  closeDialog(ev);
  let button = document.querySelector("button#load");
  button.setAttribute("value",ev.target.textContent);
  let lab = document.querySelector("label#value");
  lab.textContent = ev.target.textContent;
 }

/** Update value of load button when workflow is used
 * 
 * @param {Event} ev Event of the click
 */
function setValueFileWorkflow(ev){
 closeDialog(ev);
 let button = document.querySelector("button#load");
 let hiddenjob = (ev.target.id).split("/")[1];
 let path = hiddenjob.split("_")[0];
 let hiddenid = hiddenjob.split("_")[1];
 let id = `${GIMMICK.config.jobs_counter + parseInt(hiddenid) + 1}`;
 let file = (WORKFLOW[hiddenjob]['action']['param'][0]['data']).split("/")[1];
 path = path + "_" + id + "/" + file;

 button.setAttribute("value",path);
 let lab = document.querySelector("label#value");
 lab.textContent = file;
}


/** Update the dialog box with job folders
 * 
 * @param {Array} array Array containing title of the files
 */
 function updateDirTools(array){
  let files = document.querySelectorAll("ul#displayFiles");
  let child = files[files.length-1];
  clear(child);
  let ul = document.querySelectorAll("ul#displayFoldersJobs");
  let lastChild = ul[ul.length-1];
  clear(lastChild);
  for (let fold of array){
   let folder = h('li',[
    h('i#fileicon.bi bi-folder'),
    h('a',{
     attrs :{
      href:"#",
      onclick: 'searchJsonFiles(event)'
     }
    },
    fold
    )
   ]);
   lastChild.appendChild(folder);
  }
 }
Footer
© 2023 GitHub, Inc.
Footer navigation

  Terms
  Privacy
  Security
  Status
  Docs
  Contact GitHub
  Pricing
  API
  Training
  Blog
  About

gimmick/dialog.js at testing · jeesay/gimmick

