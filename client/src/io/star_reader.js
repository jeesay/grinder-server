/*
 * mmCIF Parser
 * Jean-Christophe Taveau
 * 2021/11/15
 */

  // Constants for state
  const CIF = {
    NONE: 0,
    SEPARATOR: 1,
    COMMENT: 2,
    DATABLOCK: 3,
    TOKEN: 4,
    TABLE: 5,
    HEADER: 6,
    STRING: 7,
    WORD: 8,
    NUMBER: 9,
    EOL: 10
  };
  Object.freeze(CIF);
  

/////////////////////::: T O K E N I Z E R ::://///////////////////

/**
 * mmCIF Tokenizer
 */
const tokenize = (txt) => {

  // Predicates
  const isDataBlock = (w) => (w.slice(0,5) === 'data_');
  const isTable = (w) => (w === 'loop_');
  const isFirst = (symbol) => w => (w[0] === symbol);
  const isComment = isFirst('#');
  const isToken = isFirst('_');
  const isMultiLine = isFirst(';');
  const isString = isFirst('\'');
  const isNumber = (w) => (!isNaN(Number(w)));
  const isEOL = (w) => (w.match(/\n/g) || []).length >= 2;
  const isSeparator = (w) => w.split('').every( ch => [' ','\t'].includes(ch)) || w.split('').filter(ch => ch === '\n').length === 1;
  const isWord = (w) => true;
  
  // Create Basic Token
  const basicToken = (type) => (w,i,array) => [{type: type,v:w},i];
  
  // Create Numeric Token
  const numericToken = (type) => (w,i,array) => [{type: type,v:parseFloat(w)},i];
  
  // Create StringToken using Recursion
  const appendWord = (predicate,array,j,str='') => {
    let word = array[++j];
    str += word;
    return (predicate(word) === false) ? [j,str] : appendWord(predicate,array,j,str);
  }

  const stringToken = (type,predicate) => (w,i,array) => {
    let [j,str] = appendWord(predicate,array,i,w);
    // Remove leading delimiters
    const v = str.slice(1,str.length-1);
    return [{type,v},j];
  }

  const keywords = [
    {
      predicate: isDataBlock,
      newToken: (w,i,array) => [{type: CIF.DATABLOCK,v:w.slice(5)},i],
    },
    {
      predicate: isTable,
      newToken: basicToken(CIF.TABLE)
    },
    {
      predicate: isComment,
      newToken: stringToken(CIF.COMMENT,word => {
        if (!word) {
          return false;
        }
        else {
          return word[0] !== '\n';
        }
      })
    },
    {
      predicate: isSeparator,
      newToken: basicToken(CIF.SEPARATOR) 
    },
    {
      predicate: isEOL,
      newToken: basicToken(CIF.EOL) 
    },
    {
      predicate: isToken,
      newToken: basicToken(CIF.TOKEN)
    },
    {
      predicate: isMultiLine,
      newToken: stringToken(CIF.STRING, word => (word[0] !== ';') )
    },
    {
      predicate: isNumber,
      newToken: numericToken(CIF.NUMBER)
    },
    {
      predicate: isString,
      newToken: stringToken(CIF.STRING, word => word[word.length-1] !== '\'')
    },
    {
      predicate: isWord,
      newToken: basicToken(CIF.WORD) 
    }
  ];

  const setToken = (words) => (index) => {
    let w = words[index];
    // Get Token corresponding to keyword
    const toks = keywords.reduce( (accu,kw) => {
      // const newTok = iif(kw,w,index,words).newToken();
//      console.info(w);
      // HACK: EOL is replaced by SEPARATOR because tested before
      if (kw.predicate(w)) {
        accu.push(kw.newToken(w,index,words));
      }
      return accu;
    },[]);
    
    // Add new Token. Only the first one because the last one is always `CIF.WORD`
    return toks[0]; // keyword.newToken(w,index,words);
  };
  
  ///// M A I N /////
 
  const words = txt
    .replace(/#.*\n/g,'\n')
    .split(/(\s+)/);

//  console.log(words[words.length - 1]);
  
  let tokens = [];
  let index = 0;
  const setTokenAt = setToken(words);

  // TODO Use (tail) recursion
  while (index < words.length) {
    [tok,index] = setTokenAt(index);
    tokens.push(tok);
    index++;
  }
  console.info(tokens);
  return tokens;
}

/////////////////////::: P A R S E R ::://///////////////////

/**
 * Parsers
 */
const parseComment = (tok,obj) => {
  // Reset if CIF.TABLE
  if (obj._admin_.state === CIF.TABLE) {
    obj._admin_.next = [CIF.TOKEN,CIF.TABLE];
    obj._admin_.state = CIF.NONE;
    obj._admin_.current = null;
  }
}

const parseEOL = (tok,obj) => {
  console.log('parseEOL');
  // Reset 
  obj._admin_.next = [CIF.DATABLOCK,CIF.TOKEN,CIF.TABLE];
  obj._admin_.state = CIF.NONE;
  obj._admin_.current = null;
  return obj;
}

const setHeader = (cat,attr,obj) => {
  let obj_block = obj._admin_.datablock;
  if (cat in obj_block === false) {
    // Create Table
    obj_block[cat] = {
      header: [],
      rows: [[]]
    };
  }
  obj_block[cat].header.push(attr);
  obj._admin_.current = cat; // Current Category to fill in
  obj._admin_.next = [CIF.TOKEN,CIF.NUMBER,CIF.STRING,CIF.WORD];
  return obj;
}

/**
 * Parse nothing - Use for skipping token(s)
 *
 * @param {Token} - `tok` a token composed of 
 * @param {Object} - `obj` the Data Structure
 * @returns {object} - The UNmodified Data Structure
 *
 * @author Jean-Christophe Taveau
 */
 const parseNothing = (tok,obj) => obj;

/**
 * Set mmCIF Category
 *
 * @param {Token} - `tok` a token composed of 
 * @param {Object} - `obj` the Data Structure
 * @returns {object} - The modified Data Structure
 *
 * @author Jean-Christophe Taveau
 */
const setCategory = (cat,attr,obj) => {
  //
  let obj_block = obj._admin_.datablock;
  // Create object if needed
  if (cat in obj_block === false) {
    obj_block[cat] = {};
  }
  obj_block[cat][attr] = 0;
  obj._admin_.next = [CIF.NUMBER,CIF.STRING,CIF.WORD];
  obj._admin_.current = cat;
  obj._admin_.attr = attr;
  return obj;
}

/**
 * Parse mmCIF Token: parseHead or parseCat depending of context (CIF.TABLE or CIF.TOKEN)
 *
 * @param {Object} - `tok` a token composed of a type `type` and a value `v`.
 * @param {Object} - `obj` the Data Structure.
 * @returns {object} - The modified Data Structure.
 *
 * @author Jean-Christophe Taveau
 */
const parseToken = (tok,obj) => {
  // Remove the leading underscore `_` and Split `category` and `attribute` 
  let [cat,attr] = tok.v.slice(1).split('.');
  if (!attr) {
    attr = (obj._admin_.state === CIF.TABLE) ? cat : 'value';
  }
  return (obj._admin_.state === CIF.TABLE) ? setHeader('table',attr,obj) : setCategory(cat,attr,obj);
}

/**
 * Parse mmCIF Value in Token or in Table: setRowValue or parseCat depending of context (CIF.TABLE or CIF.TOKEN)
 *
 * @param {Object} - `tok` a token composed of a type `type` and a value `v`.
 * @param {Object} - `obj` the Data Structure.
 * @returns {object} - The modified Data Structure.
 *
 * @author Jean-Christophe Taveau
 */
const setRowValue = (tok,obj) => {
  let obj_block = obj._admin_.datablock;

  const table = obj_block[obj._admin_.current];
  let last = table.rows.length-1;
  if (table.rows[last].length >= table.header.length) {
    table.rows.push([]); // Add a new row in the table
    last = table.rows.length-1; // Update
  }
  table.rows[last].push(tok.v);
  obj._admin_.next = [CIF.STRING,CIF.WORD,CIF.NUMBER, CIF.EOL];
  return obj;
}

const setTokenValue = (tok,obj) => {
  let obj_block = obj._admin_.datablock;
//  console.log(obj._admin_.next,tok);
  obj_block[obj._admin_.current][obj._admin_.attr] = tok.v;
  obj._admin_.current = null;
  obj._admin_.attr = null;
  obj._admin_.next = [CIF.STRING,CIF.WORD,CIF.NUMBER, CIF.EOL];
  return obj;
}

const parseValue = (tok,obj) => {
  return (obj._admin_.state === CIF.TABLE) ? setRowValue(tok,obj) : setTokenValue(tok,obj);
}

/**
 * Parse mmCIF Table
 *
 * @param {Object} - `tok` a token composed of a type `type` and a value `v`.
 * @param {Object} - `obj` the Data Structure.
 * @returns {object} - The modified Data Structure.
 *
 * @author Jean-Christophe Taveau
 */
const parseTable = (tok,obj) => {
  obj._admin_.state = CIF.TABLE;
  obj._admin_.next = [CIF.TOKEN];
  console.log(obj._admin_.state,'parseTable',tok);
  return obj;
}

/**
 * Parse mmCIF DataBlock
 *
 * @param {Object} - `tok` a token composed of a type `type` and a value `v`.
 * @param {Object} - `obj` the Data Structure.
 * @returns {object} - The modified Data Structure.
 *
 * @author Jean-Christophe Taveau
 */
const parseDataBlock = (tok,obj) => {
  console.log('new DB',tok.v);
  obj._admin_.next = [CIF.TOKEN,CIF.TABLE]; // TOKEN, TABLE
  const db = {id: tok.v};
  obj.datablocks.push(db);
  obj._admin_.datablock = db;
  obj._admin_.current = null;
  obj._admin_.attr = null;

  console.log(obj);
  return obj;
}

/**
 * Parsers for the following tokens:
 *  - NONE: 0 ,
 *  - SEPARATOR: 1,
 *  - COMMENT: 2,
 *  - DATABLOCK: 3,
 *  - TOKEN: 4,
 *  - TABLE: 5,
 *  - HEADER: 6,
 *  - STRING: 7,
 *  - WORD: 8,
 *  - NUMBER: 9
 *  - EOL: 10
 */
const parser = (toks) => {
  const  setters = [parseNothing,parseNothing,parseComment,parseDataBlock,parseToken,parseTable,parseNothing,parseValue,parseValue,parseValue,parseEOL];

  const model = toks.reduce( (accu,tok) => {
    if (accu._admin_.next.includes(tok.type)) {
      return setters[tok.type](tok,accu);
    }
    return accu;
  },{_admin_: {next: [CIF.DATABLOCK],state: CIF.NONE}, datablocks: []});

  return model;
}

/**
 * mmCIF Parser
 */
const parseSTAR = (txt) => {

  // First Pass
  const tokens = tokenize(txt);

  // Second Pass - Parse
  let structure = parser(tokens);
  delete structure._admin_;
  console.log(structure);
  console.info('End');
  return structure;
}


