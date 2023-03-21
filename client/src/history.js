
'use strict';


const create_history = async (ev) => {
  console.log('create history table');
  if (!GRINDER.server.connected) {
    alert('Please connect to the ws server');
  }
  else {
   // Step #1 - Get default_pipeline.json of Project
    let cli = {
      end:0,
      action: {
        tool: 'GRINDER.py',
        title:'project',
        args:'--get default_pipeline.json'
      }
    };
  
    GRINDER.server.send(JSON.stringify(cli));
    const response = await GRINDER.server.receive();
    console.log(response);
    GRINDER.jobs = JSON.parse(response);
    console.log('jobs',GRINDER.jobs);
    
    let table = document.querySelector('#jhistory_body');
    table.innerHTML = '';
    // GRINDER.config.datablocks[1].global.header.forEach(row => {});
    GRINDER.jobs.forEach(row => {
      const job_id = row.id;
      table.appendChild(
        h('tr.jhistory_row',
          [
            h('td.jhistory_cell', 
              [
                h('span',job_id),
                (row.steps > 1) ? h('i.bi.bi-arrow-clockwise',[h('sup',{},(row.steps - 1).toString())]) : '',
                (row.status === 'Failed') ? h('i.bi.bi-exclamation-triangle-fill') : h('i.bi.bi-check-circle')
              ]
            ),
            h('td.jhistory_cell', [
              h('a',
                {
                  props:{href:'#',title:'View'},
                  dataset: {
                    jid: row.id,
                    jtype: row.type,
                    jpath: row.path
                  },
                  on:{'click': (ev) => view_job(ev)} ,
                },
                [h('i.bi.bi-eye')],
              ),
              h('a',
                {
                  props:{href:'#',title: 'Copy and create a new job'},
                  on:{'click': (ev) => copy_job(ev)} 
                },
                [h('i.bi-clipboard-plus')],
              ),
              h('a',
                {
                  props:{href:'#', title: 'Move to Trash'},
                  on:{'click': (ev) => askTrash(ev.target.parentElement.parentElement.parentElement.children[4].textContent)} 
                },
                [h('i.bi-trash')],
              ),
            ]),
            h('td.jhistory_cell', row.path),
            h('td.jhistory_cell', row.alias),
            h('td.jhistory_cell', row.date),
            h('td.jhistory_cell', row.type)
          ]
        )
      );
    });
  }
}

