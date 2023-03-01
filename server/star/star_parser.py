
#####################::: P A R S E R :::#####################

#
# Parsers
#
def parseComment(tok,obj):
  ## Reset if CIF.TABLE
  if (obj._admin_.state === CIF.TABLE) {
    obj._admin_.next = [CIF.TOKEN,CIF.TABLE];
    obj._admin_.state = CIF.NONE;
    obj._admin_.current = null;
  }


def parseEOL(tok,obj):
  print('parseEOL');
  ## Reset 
  obj._admin_.next = [CIF.DATABLOCK,CIF.TOKEN,CIF.TABLE];
  obj._admin_.state = CIF.NONE;
  obj._admin_.current = null;
  return obj;


def setHeader(cat,attr,obj) :
  obj_block = obj._admin_.datablock;
  if (cat in obj_block === False) {
    ## Create Table
    obj_block[cat] = {
      header: [],
      rows: [[]]
    };
  }
  obj_block[cat].header.push(attr);
  obj._admin_.current = cat; ## Current Category to fill in
  obj._admin_.next = [CIF.TOKEN,CIF.NUMBER,CIF.STRING,CIF.WORD];
  return obj;



 def parseNothing(tok,obj):
    '''
      * Parse nothing - Use for skipping token(s)
      *
      * @param {Token} - `tok` a token composed of 
      * @param {Object} - `obj` the Data Structure
      * @returns {object} - The UNmodified Data Structure
      *
      * @author Jean-Christophe Taveau
    '''
    #
    # do nothing


def setCategory(cat,attr,obj):
  '''
   * Set mmCIF Category
   *
   * @param {Token} - `tok` a token composed of 
   * @param {Object} - `obj` the Data Structure
   * @returns {object} - The modified Data Structure
   *
   * @author Jean-Christophe Taveau
  '''

  obj_block = obj._admin_.datablock;
  ## Create object if needed
  if (cat in obj_block === False) {
    obj_block[cat] = {};
  }
  obj_block[cat][attr] = 0;
  obj._admin_.next = [CIF.NUMBER,CIF.STRING,CIF.WORD];
  obj._admin_.current = cat;
  obj._admin_.attr = attr;
  return obj;



def parseToken(tok,obj):
  '''
   * Parse mmCIF Token: parseHead or parseCat depending of context (CIF.TABLE or CIF.TOKEN)
   *
   * @param {Object} - `tok` a token composed of a type `type` and a value `v`.
   * @param {Object} - `obj` the Data Structure.
   * @returns {object} - The modified Data Structure.
   *
   * @author Jean-Christophe Taveau
  '''
  
  ## Remove the leading underscore `_` and Split `category` and `attribute` 
  [cat,attr] = tok.v[1).split('.');
  if (!attr) {
    attr = (obj._admin_.state === CIF.TABLE) ? cat : 'value';
  }
  return (obj._admin_.state === CIF.TABLE) ? setHeader('table',attr,obj) : setCategory(cat,attr,obj);
}


def setRowValue(tok,obj):
  '''
   Parse mmCIF Value in Token or in Table: setRowValue or parseCat depending of context (CIF.TABLE or CIF.TOKEN)

   @param {Object} - `tok` a token composed of a type `type` and a value `v`.
   @param {Object} - `obj` the Data Structure.
   @returns {object} - The modified Data Structure.
   
   @author Jean-Christophe Taveau
 '''
 
  obj_block = obj._admin_.datablock;

  table = obj_block[obj._admin_.current];
  last = table.rows.length-1;
  if (table.rows[last].length >= table.header.length) {
    table.rows.push([]); ## Add a new row in the table
    last = table.rows.length-1; ## Update
  }
  table.rows[last].push(tok.v);
  obj._admin_.next = [CIF.STRING,CIF.WORD,CIF.NUMBER, CIF.EOL];
  return obj;


def setTokenValue(tok,obj):
  obj_block = obj._admin_.datablock;
##  print(obj._admin_.next,tok);
  obj_block[obj._admin_.current][obj._admin_.attr] = tok.v;
  obj._admin_.current = null;
  obj._admin_.attr = null;
  obj._admin_.next = [CIF.STRING,CIF.WORD,CIF.NUMBER, CIF.EOL];
  return obj;


const parseValue = (tok,obj) => {
  return (obj._admin_.state === CIF.TABLE) ? setRowValue(tok,obj) : setTokenValue(tok,obj);
}


def parseTable(tok,obj):
  '''
   * Parse mmCIF Table
   *
   * @param {Object} - `tok` a token composed of a type `type` and a value `v`.
   * @param {Object} - `obj` the Data Structure.
   * @returns {object} - The modified Data Structure.
   *
   * @author Jean-Christophe Taveau
 '''
  obj._admin_.state = CIF.TABLE;
  obj._admin_.next = [CIF.TOKEN];
  print(obj._admin_.state,'parseTable',tok);
  return obj;
}


def parseDataBlock(tok,obj):
  '''
   * Parse mmCIF DataBlock
   *
   * @param {Object} - `tok` a token composed of a type `type` and a value `v`.
   * @param {Object} - `obj` the Data Structure.
   * @returns {object} - The modified Data Structure.
   *
   * @author Jean-Christophe Taveau
   *
 '''
  print('new DB',tok.v);
  obj._admin_.next = [CIF.TOKEN,CIF.TABLE]; ## TOKEN, TABLE
  const db = {id: tok.v};
  obj.datablocks.push(db);
  obj._admin_.datablock = db;
  obj._admin_.current = null;
  obj._admin_.attr = null;

  print(obj);
  return obj;


#**
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
 *#
def parser (toks):
  setters = [
    parseNothing,parseNothing,parseComment,
    parseDataBlock,parseToken,parseTable,
    parseNothing,parseValue,parseValue,parseValue,parseEOL
  ];

  model = toks.reduce( (accu,tok) => {
    if (accu._admin_.next.includes(tok.type)) {
      return setters[tok.type](tok,accu);
    }
    return accu;
  },{_admin_: {next: [CIF.DATABLOCK],state: CIF.NONE}, datablocks: []});

  return model;


def parseSTAR(txt):
  '''
    mmCIF Parser
  '''

  ## First Pass
  tokens = tokenize(txt);

  ## Second Pass - Parse
  structure = parser(tokens);
  dee structure._admin_;
  print(structure);
  print('End');
  return structure;
