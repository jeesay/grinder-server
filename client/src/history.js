
'use strict';


const create_history = (ev) => {
  console.log('create history table');
  if (!GRELION.config) {
    alert('Please connect to the ws server');
  }
  else {
    console.log(GRELION.config.datablocks[1].global);
    let table = document.querySelector('#jhistory_body');
    table.innerHTML = '';
    // GRELION.config.datablocks[1].global.header.forEach(row => {});
    GRELION.config.datablocks[1].table.rows.forEach(row => {
      const job_id = row[0].match(/\d{3}/g).join("");
      table.appendChild(
        h('tr.jhistory_row',
          [
            h('td.jhistory_cell', 
              [
                h('span',job_id),(row[3] === 'Failed') ? h('i.bi.bi-exclamation-triangle-fill') : h('i.bi.bi-check-circle')
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
            h('td.jhistory_cell', row[2]),
            h('td.jhistory_cell', row[2]),
            h('td.jhistory_cell', row[1]),
            h('td.jhistory_cell', row[0])
          ]
        )
      );
    });
  }
}

