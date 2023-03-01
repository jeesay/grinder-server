#####################::: T O K E N I Z E R :::#####################

  ## Predicates
  def isDataBlock(w):
    w[0:5] === 'data_'
    
  def isTable(w):
    w === 'loop_'
    
  def isFirst(symbol) => w => (w[0] === symbol);
  def isComment = isFirst('#');
  def isToken = isFirst('_');
  def isMultiLine = isFirst(';');
  def isString = isFirst('\'');
  def isNumber = (w) => (!isNaN(Number(w)));
  def isEOL = (w) => (w.match(#\n#g) || []).length >= 2;
  def isSeparator = (w) => w.split('').every( ch => [' ','\t'].includes(ch)) || w.split('').filter(ch => ch === '\n').length === 1;
  const isWord = (w) => True;
  
  ## Create Basic Token
  const basicToken = (type) => (w,i,array) => [{type: type,v:w},i];
  
  ## Create Numeric Token
  const numericToken = (type) => (w,i,array) => [{type: type,v:parseFloat(w)},i];
  
  ## Create StringToken using Recursion
  const appendWord = (predicate,array,j,str='') => {
     word = array[++j];
    str += word;
    return (predicate(word) === False) ? [j,str] : appendWord(predicate,array,j,str);
  }

  const stringToken = (type,predicate) => (w,i,array) => {
     [j,str] = appendWord(predicate,array,i,w);
    ## Remove leading delimiters
    const v = str[1,str.length-1);
    return [{type,v},j];
  }

  const keywords = [
    {
      predicate: isDataBlock,
      newToken: (w,i,array) => [{type: CIF.DATABLOCK,v:w[5)},i],
    },
    {
      predicate: isTable,
      newToken: basicToken(CIF.TABLE)
    },
    {
      predicate: isComment,
      newToken: stringToken(CIF.COMMENT,word => {
        if (!word) {
          return False;
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
    w = words[index];
    ## Get Token corresponding to keyword
    toks = keywords.reduce( (accu,kw) => {
      ## const newTok = iif(kw,w,index,words).newToken();
##      print(w);
      ## HACK: EOL is replaced by SEPARATOR because tested before
      if (kw.predicate(w)) {
        accu.push(kw.newToken(w,index,words));
      }
      return accu;
    },[]);
    
    ## Add new Token. Only the first one because the last one is always `CIF.WORD`
    return toks[0]; ## keyword.newToken(w,index,words);
  };

def tokenize(txt):
  '''
    mmCIF Tokenizer
  '''
  print('TOKENIZE')
  
  ##### M A I N #####
 
  words = txt
  clean = re.sub('#.*\n','\n',txt)
  words = re.split('(\s+)',clean);

  print(words[words.length - 1]);
  
  tokens = [];
  index = 0;
  setTokenAt = setToken(words);

  ## TODO Use (tail) recursion
  while (index < words.length) {
    [tok,index] = setTokenAt(index);
    tokens.push(tok);
    index++;
  }
  print(tokens);
  return tokens;
}
