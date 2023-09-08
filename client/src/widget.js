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


'use strict';

const w_label = (desc) => {
  // TODO
  return h('label',desc.title);
}

const w_option = (desc) => {
  // TODO
  return h('option',{
      props: {
        selected: desc.select,
        value: desc.value
      }
    },
    desc.title);
}

const w_h3 = (desc) => {
  // TODO
  return h('h3',desc.title);
}

const w_button = (desc) => {
  // TODO
  return h('div.row',
    [
      h('label',{attrs: {'for':desc.name}},desc.title),
      h('i.bi.bi-question-circle',{attrs:{title:desc.help}}),
      h(`button#${desc.name}`,
        {
          on: ('on_click' in desc) ? {click: desc.on_click} : {}
        },
        desc.title
      )
    ])
}

const w_switch = (desc) => {
  // TODO
  return h('fieldset.switch',
    [
      h('legend',w_switch_button(desc)),
      ...w_group(desc)
    ]
  );
}

const w_switch_button = (desc) => {
  return [
    h('label',desc.title),
    h('i.bi.bi-question-circle',{attrs:{title:desc.help}}),
    h('div.switch_button',
      [
        h(`input#${desc.name}_on_off.param`, 
          {
            attrs: {
              type:'checkbox',
              name:desc.name
            },
            props: {
              checked: (desc.default === true) ? true : false
            },
            on: {
              click: (ev) => {
                ev.target.checked ? false : true; 
                if (ev.target.checked) {
                  ev.target.closest('fieldset').classList.remove('inactive');
                  ev.target.closest('fieldset').disabled = false;
                }
                else { 
                  ev.target.closest('fieldset').classList.add('inactive');
                  ev.target.closest('fieldset').disabled = true;
                } 
              }
            }
          },
        ),
        h('label',
          {
            attrs: {'for':`${desc.name}_on_off`},
/*            on: {changed: (ev) => {console.log(ev.target); ev.target.disabled = !ev.target.disabled} } */
          },
          'Toggle'
        )
      ]
    )
  ]
}

const w_file = (desc) => {
  let ds = {inputfile: desc.name};
  if ('filetype' in desc) {
    ds.title = GRINDER.filetypes[desc.filetype].dialog_title;
    ds.filter = GRINDER.filetypes[desc.filetype].filter;
  }
  else {
    if ('dialog_title' in desc) {
      ds.title =  desc.dialog_title;
    }
    if ('filter' in desc) {
      ds.filter = desc.filter;
    }
  }
  
  return h('div.row',
    {
      style: (desc.status === 'hidden') ? {display: 'none'} : {display:'flex'}
    },
    [
      h('label',{attrs: {'for':desc.name}},desc.title),
      h('i.bi.bi-question-circle',{attrs:{title:desc.help}}),
      h(`input#${desc.name}.param`, 
        {
          attrs: {
            type:'text',
            value: desc.default,
            placeholder: desc.placeholder || '',
            name:desc.name
          },
          dataset: ('option' in desc) ? {option: desc.option} : {}
        }
      ),
      h('input#open_dialog.browse', 
        {
          attrs: {
            type:'button',
            value: 'Browse...',
          },
          dataset: ds,
          on: {
            click: (ev) => {const dialog = new FileChooser(GRINDER.server); dialog.openDialog(ev) }
          }
        }
      )
    ]
  );
}

const w_text = (desc) => h('div.row',
  [
    h('label',{attrs: {'for':desc.name}},desc.title),
    h('i.bi.bi-question-circle',{attrs:{title:desc.help}}),
    h(`input#${desc.name}.param`, 
      {
        attrs: {
          type:'text',
          value: desc.default,
          name:desc.name
        },
        dataset: ('option' in desc) ? {option: desc.option} : {}
      }
    )
  ]
);


const w_paragraph = (desc) => h('div.row',
  [
    h('label',{attrs: {'for':desc.name}},desc.title),
    h('i.bi.bi-question-circle',{attrs:{title:desc.help}}),
    h(`span#${desc.name}`, desc.content)
  ]
);



/*
  {
    name: 'poly_order',
    title: 'Polynomial Order',
    widget: 'int',
    default: 1,
    help: 'The polynomial order for fitting the baseline. Default is 1.'
  }
  Output:
  <label for="poly_order">Polynomial Order</label>
  <input name="poly_order" type="number" value=1></input> 
  <i class="bi bi-question-circle" title="help"></i>

*/
const w_int = (desc) => h('div.row',
  [
    h('label',{attrs: {'for':desc.name}},desc.title),
    h('i.bi.bi-question-circle',{attrs:{title:desc.help}}),
    h(`input#${desc.name}.param`, 
      {
        attrs: {
          type:'number',
          value: desc.default,
          lang:'en',
          name:desc.name
        },
        dataset: ('option' in desc) ? {option: desc.option} : {}
      }
    )
  ]
  );


const w_float = (desc) => {
  // TODO
  return w_int(desc);
}

const w_range = (desc) => h('div.row',
  [
    h('label',{attrs: {'for':desc.name}},desc.title),
    h('i.bi.bi-question-circle',{attrs:{title:desc.help}}),
    h('div.range_slider',
      {
        style: {display:'flex'}
      },
      [
        h(`input#${desc.name}.param`, 
          {
            attrs: {
              type:'range',
              min: desc.range_min,
              max: desc.range_max,
              step: desc.range_step,
              value: desc.default,
              name:desc.name
            },
            dataset: ('option' in desc) ? {option: desc.option} : {},
            on: {input: (ev) => {ev.target.nextElementSibling.value = ev.target.value} }
          }
        ),
        h('output.not-allowed', {dataset: ('option' in desc) ? {option: desc.option} : {} }, desc.default.toString()),
        h('a',
          {
            props:{href:'#',title:'Type Value'},
            on: {
              click: (ev) => {
                const slider = ev.target.closest(".range_slider");
                slider.style.display = 'none';
                slider.nextElementSibling.style.display = 'flex';
              } 
            }
          },
          [h('i.bi.bi-pencil-square')],
        ),
      ]
    ),
    h('div.range_text',
      {
        style: {display:'none'}
      },
      [
        h(`input#${desc.name}.param`, 
          {
            attrs: {
              type:'number',
              value: desc.default,
              step: desc.range_step,
              lang:'en',
              name:desc.name
            },
            dataset: ('option' in desc) ? {option: desc.option} : {}
          }
        ),
        h('a',
          {
            props:{href:'#',title:'Modify'},
            on: {
              click: (ev) => {
                const rtext = ev.target.closest(".range_text");
                rtext.style.display = 'none';
                rtext.previousElementSibling.style.display = 'flex';
              } 
            }

    //        on:{'click': (ev) => view(ev)} 
          },
          [h('i.bi.bi-sliders')],
        )
      ])
    ]
  );

const w_bool = (desc) => h('div.row',
  [
    h('label',{attrs: {'for':desc.name}},desc.title),
    h('i.bi.bi-question-circle',{attrs:{title:desc.help}}),
    h(`input#${desc.name}.param`, 
      {
        attrs: {
          type:'checkbox',
          name:desc.name
        },
        props: {
          checked: (desc.default === true) ? true : false
        },
        dataset: ('option' in desc) ? {option: desc.option} : {}
      }
    ),
  ]
  );

/*
  {
    name: 'poly',
    group: 'baseline_methods',
    title: 'Regular Polynomial',
    widget: 'radio',
    value: false,
    help: 'Regular Polynomial Method'
  }
  Output:
  <input type="radio" id="poly" name="baseline_methods" value="poly" checked />
  <label for="poly">Regular Polynomial</label> 
  <i class="bi bi-question-circle" title="Regular Polynomial Method"></i>
*/
const w_radio = (desc) => h('div.row',
  [
    h(`input#${desc.name}.param`, 
      {
        attrs: {
          type:'radio',
          name:desc.group,
          value:desc.name
        },
        props: {
          checked: (desc.default === true) ? true : false
        },
        dataset: ('option' in desc) ? {option: desc.option} : {},
        on: ('on_click' in desc) ? {click: desc.on_click} : {}
      }
    ),
    h('label',{attrs: {'for': desc.name}},desc.title + ' '),
    h('i.bi.bi-question-circle',{attrs: {title: desc.help}})
  ]
  );


const w_navtab = (parent,desc) => {
  // Remove all the previous children
  parent.innerHTML = '';
  // Step #1 Header
  desc.forEach( (child,i) => {
    console.log('TABS',child);
    const el = h(`article#${child.name}.tab`, 
      [
        h(`input#tab-${i+1}.tab-switch`, 
          {
            attrs: { 
              type:'radio',
              name:'css-tabs'
            },
            props: {
              checked: (i==0) ? true : false
            },
            on: ('on_click' in child) ? {click: child.on_click} : {}
          }
        ),
        h('label.tab-label',{attrs: {'for': `tab-${i+1}`}},[h(`i.bi.${child.icon}`),' ',child.title]),
        h('div.tab-content', 
          ('children' in child) ? w_group(child): []
        )
      ]
    );
    parent.appendChild(el);
  });
}

const w_select = (desc) => {
  return h('div.row',
  [
    h('label',{attrs: {'for': desc.name}},desc.title + ' '),
    h('i.bi.bi-question-circle',{attrs: {title: desc.help}}),
    h('div.select-dropdown',[
      h(`select#${desc.name}`,
        {
          on: ('on_change' in desc) ? {click: desc.on_change} : {}
        },
        w_group(desc),
       )
    ])
  ]);
}

const w_toolbar = (desc) => {
  console.log('toolbar',desc.title);
  return h('div.toolbar',desc.children.map( wdg => h('button',wdg.title)));
}

const w_fieldset = (desc) => {
  console.log('fieldset',desc.title);
  return h('fieldset',
    [
      h('legend',(desc.icon) ? [h(`i.bi.${desc.icon}`),desc.title] : desc.title),...w_group(desc)
    ]
  );
}

const w_details = (desc) => {
  console.log('details',desc.title);
  return h(`details#${desc.name}`,[h('summary',desc.title),...w_group(desc)]);
}

const w_table = (desc) => {
  console.log('table',desc.title);
  let components = [];
  if (desc.children?.[0]) {
    components.push(w_table_head(desc.children[0]));
  }
  if (desc.children?.[1]) {
    components.push(w_table_body(desc.children[1]));
  }
  return h(`table#${desc.name}`,components);
}

const w_table_head = (desc) => {
  console.log('table_head',desc.title);
  return  h(`thead#${desc.name}`,[h('tr',[...w_group(desc)])]);
}

const w_table_body = (desc) => {
  console.log('table_body',desc.title);
  return h(`tbody#${desc.name}`,[...w_group(desc)]);
}

const w_table_row = (desc) => {
  return h(`tr#${desc.name}`,[...w_group(desc)]);
}

const w_table_cell = (desc) => {
  return h(`td#${desc.name}`,desc.value);
}

const w_group = (desc) => {
  // Primitive Widgets
  const types = [
    'label','h3','button','bool','int','float','file','text','range',
    'radio','select','option','switch','fieldset','details',
    'table','thead','tbody','trow','tcell','toolbar','paragraph'];
  const creators = [
    w_label,w_h3,w_button,w_bool,w_int,w_float,w_file,w_text,w_range,
    w_radio,w_select,w_option,w_switch,
    w_fieldset,w_details,
    w_table,w_table_head,w_table_body,w_table_row,w_table_cell,w_toolbar,w_paragraph
  ];
  if ('children' in desc === false) {
    console.log(desc);
  }

  // Build HTML Elements
  const els =  desc.children.map( child => {
    if (types.indexOf(child.widget) !== -1) {
      return creators[types.indexOf(child.widget)](child);
    }
  });
  
  // Post-process for `switch` widget
  document.querySelectorAll('.switch').forEach(el => {
    const sbutton = el.querySelector('.switch_button input');
    if (sbutton.checked) {
      el.classList.remove('inactive');
      el.disabled = false;
    }
    else {
      el.classList.add('inactive');
      el.disabled = true;
    } 
  }) ;
  
  return els;
}

////////////////////: UPDATE :////////////////////

const w_navtab_update = (tab_contents) => {
  
  Object.keys(tab_contents).forEach(parent_id => {
    const content = document.querySelector(`article#${parent_id} .tab-content`);
    const desc = tab_contents[parent_id];
    // Update corresponding tab
    content.replaceChildren(...w_group(desc));
  });

}

////////////////////: EVENTS :////////////////////

const submit_command = (tool) => (ev) => {
  const els = document.querySelectorAll('section .param');
  const cli = Array.from(els).reduce( (accu,el) => {
    console.log(el.name,el.type,el.dataset.option,el.value,el.checked);
    if (el.type === 'radio' || el.type === 'checkbox') {
      return (el.checked) ? accu + ` ${el.dataset.option}` : accu;
    }
    else {
      return accu + ` ${el.dataset.option} ${el.value}`;
    }
  },tool);
  document.querySelector('button#submit').disabled = true;
  console.log(cli);
  const event = {
    end:0,
    action: {
      tool: tool,
      title:'sleep',
      args:cli
    } 
  };

  let field = document.querySelectorAll("article#running > div > fieldset")[1];
  let textdiv = document.createElement('div');
  field.appendChild(textdiv);
  console.log("Send");
  console.log(event);
  GRELION.websocket.send(JSON.stringify(event));
}
