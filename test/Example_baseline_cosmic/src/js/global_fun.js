'use strict';

// Common functions for drawings

/* Create an element
 *
 * @param type {String} - type of the element
 * @returns an Element
 */
function create(type){
  let el = document.createElement(type);
  return el;
}

/* Append an element as a child
 *
 * @param parent {Number} - an SVGElement
 * @param child {Number} - an SVGElement
 * @returns an SVGElement
 */
function append(parent,child){
  parent.appendChild(child);
  return parent;
}

/*
 * Get or Set attribute
 * attribute(el,key) returns value
 * attribute(el,key,value) sets the attribute 'key' of 'el' with `value`
 */

function attribute(el,key,value=null){
  if (value === null){
    let valeur = el.getAttribute(key);
    return valeur;
  }
  else {
    el.setAttribute(key,value);
    return el;
  }
}


/* Set a collection of Attributes to 'el'
 * Array ["key0",value0,"key1",value1,...,"keyN",valueN]
 */

function attributes(el,array){
  for (let i=0;i<(array.length);i=i+2){
    el.setAttribute(array[i],array[i+1]);
  }
  return el;
}

/* Create an input element and a legend
 *
 * @param parent {HTMLElement} - an HTML Element
 * @param arr {arr} - array containing the data
 * @param header {String} - Name of the legend display
 */
function textField(parent,arr,header){
  let lab = create('label');
  lab = attribute(lab,'for',arr[0]);
  lab.innerHTML = header;
  append(parent,lab);
  let inp1 = create('input');
  inp1 = attributes(inp1,arr);
  append(parent,inp1);
}

/* Create a br element
 *
 * @param parent {HTMLElement} - an HTML Element
 */
function br(parent){
  let br = create('br');
  append(parent,br);
}

/* Create a button element
 *
 * @param parent {HTMLElement} - an HTML Element
 */
function button(parent){
  let but = create('button');
  but = attribute(but,'id','valid');
  but.innerHTML = 'Valid';
  append(parent,but);
}

/* Clear all children from an element
 *
 * @param parent {HTMLElement} - an HTML Element
 */
function clear(parent){
  let children = parent.children;
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
}

/* Display parameters for baseline
 */
function displayParamsBaseline(){
  let parent = document.getElementById("Display_parameters");
  clear(parent);

  br(parent);
  textField(parent,["id",'input','placeholder','baseline.py','value','baseline.py','required',true],"Input file : ");
  br(parent);
  textField(parent,["id",'param','placeholder','baseline.json','value','baseline.json','required',true],"Param file : ");
  br(parent);
  textField(parent,["id",'output','placeholder','snip.json','value','snip.json','required',true],"Output file : ");
  br(parent);
  textField(parent,["id",'name','placeholder','snip','value','snip','required',true],"Tool name : ");
  br(parent);
}

/* Display parameters for cosmic
 */
function displayParamsCosmic(){
  let parent = document.getElementById("Display_parameters");
  clear(parent);

  br(parent);
  textField(parent,["id",'input','placeholder','cosmic_ray.py','value','cosmic_ray.py','required',true],"Input file : ");
  br(parent);
  textField(parent,["id",'param','placeholder','cosmic.json','value','cosmic.json','required',true],"Param file : ");
  br(parent);
  textField(parent,["id",'output','placeholder','cosmic_data.json','value','cosmic_data.json','required',true],"Output file : ");
  br(parent);
}