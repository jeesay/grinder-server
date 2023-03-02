'''
  #*
 * mmCIF Parser
 * Jean-Christophe Taveau
 * 2021#11#15
 *#
'''



import star

def parseSTAR(txt):
  '''
    mmCIF Parser
  '''

  ## First Pass
  tokens = star.tokenize(txt);

  ## Second Pass - Parse
  data = star.parser(tokens);

  print('End');
  return data;
  
