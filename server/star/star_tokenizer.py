#####################::: T O K E N I Z E R :::#####################


## Predicates
def isDataBlock(w):
  w[0:5] == 'data_'
  
def isTable(w):
  w == 'loop_'
  
def isFirst(symbol,w):
  return (w[0] == symbol)

def isComment(w):
  return isFirst('#',w)
  
def isToken(w):
  return isFirst('_',w)
  
def isMultiLine(w):
  return isFirst(';',w)

def isString(w):
  return isFirst('\'',w);

def isNumber(w):
  try:
    float_value = float(w)
  except ValueError:
    return False
    
  return True
   
def isEOL(w):
  return (w.match('\n') or []).length >= 2;

'''
def isSeparator(w):
  return w.split('').every( ch => [' ','\t'].includes(ch)) || w.split('').filter(ch => ch == '\n').length == 1;
'''

def isWord(w):
  return True

## Create Basic Token
def basicToken(typ):
  def func(w,i,array):
    return [{'type': typ,'v':w},i]
  return func
  
## Create Numeric Token
def numericToken (typ):
  def func(w,i,array):
    return [{'type': typ,'v':float(w)},i];

## Create StringToken using Recursion
def appendWord(predicate,array,j,str=''):
  word = array[++j]
  str += word
  if predicate(word) == False:
    return [j,str] 
  else: 
    return appendWord(predicate,array,j,str)


def stringToken(typ,predicate):
  def func(w,i,array) :
    [j,s] = appendWord(predicate,array,i,w);
    ## Remove leading delimiters
    v = str[1:]
    return [{'type': typ,'v': v},j];
  return func

keywords = [
  {
    'predicate': isDataBlock,
    'newToken': lambda w,i,array: [{'type': CIF.DATABLOCK,'v':w[5:]},i],
  },
  {
    'predicate': isTable,
    'newToken': basicToken(CIF.TABLE)
  },
  {
    'predicate': isComment,
    'newToken': stringToken(CIF.COMMENT,word => {
      if (!word) {
        return False;
      }
      else {
        return word[0] !== '\n';
      }
    })
  },
  {
    'predicate': isSeparator,
    'newToken': basicToken(CIF.SEPARATOR) 
  },
  {
    'predicate': isEOL,
    'newToken': basicToken(CIF.EOL) 
  },
  {
    'predicate': isToken,
    'newToken': basicToken(CIF.TOKEN)
  },
  {
    'predicate': isMultiLine,
    'newToken': stringToken(CIF.STRING, word => (word[0] !== ';') )
  },
  {
    'predicate': isNumber,
    'newToken': numericToken(CIF.NUMBER)
  },
  {
    'predicate': isString,
    'newToken': stringToken(CIF.STRING, word => word[word.length-1] !== '\'')
  },
  {
    'predicate': isWord,
    'newToken': basicToken(CIF.WORD) 
  }
];

def setToken = (words) => (index) => {
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
