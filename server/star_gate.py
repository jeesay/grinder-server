
import star

class Block:
  def __init__(self,dic):
    self.db = dic
    
  def id(self):
    return self.db['id']
    
  def table(self):
    if 'table' in self.db.keys():
      return Table(self.db['table'])
    return None
    
  def value_of(self,category,attr='value'):
    return self.db[category][attr]

class Table:
  def __init__(self,dic):
    self.table = dic
    
  def headers(self):
    return self.table['header']
    
  def rows(self):
    return self.table['rows']
    
  def row(self,i):
    return self.table['rows'][i]
    
  def column(self,headname):
    i = self.headers().index(headname)
    col = []
    for row in self.table['rows']:
      col.append(row[i])
    return col
    
    
class StarGate:
  def __init__(self,filename):
    self.data = {}
    with open(filename) as f:
      self.data = StarGate.parseSTAR(f.read())

  def datablock(self,blockname):
    for db in self.data['datablocks']:
      if db['id'] == blockname:
        return Block(db)
    return None

  def table_of(self,blockname):
    for db in self.data['datablocks']:
      if db['id'] == blockname and db['table']:
        return db
    return None
    
  def parseSTAR(txt):
    ## First Pass
    tokens = star.tokenize(txt);
    ## Second Pass - Parse
    return star.parser(tokens);

