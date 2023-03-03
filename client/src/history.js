
'use strict';


const create_history = (ev) => {
  console.log('create history table');
  if (!GRELION.jobs) {
    alert('Please connect to the ws server');
  }
  else {
    console.log(GRELION.jobs);
    let table = document.querySelector('#jhistory_body');
    table.innerHTML = '';
    // GRELION.config.datablocks[1].global.header.forEach(row => {});
    GRELION.jobs.forEach(row => {
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
                  on:{'click': (ev) => view(ev)} 
                },
                [h('i.bi.bi-eye')],
              ),
              h('a',
                {
                  props:{href:'#',title: 'Copy and create a new job'},
                  on:{'click': (ev) => copy(ev)} 
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

