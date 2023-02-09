# -*- coding: utf-8 -*-
"""
Read spectra in file format Wip
Based on Matlab package wit_io from ???

Created on March 5, 2021
@author: Hamza Jlajla
@author: Jean-Christophe Taveau


"""


import json
import numpy as np
import os
import struct
import sys
from PIL import Image

import wipUtils as wu
import wipData as wd


def spload(filename,inputs,saveBlocks=False):
  """
    @param inputs - A dictionary containing 
  """
  
  scans = []

  f = spopen(filename)
  if not f:
    return
    
  # Read all the blocks
  root = spread(f)
  
  # Save Blocks? Only for debugging
  if saveBlocks:
    path,extension = os.path.splitext(filename)
    writeBlocks(root,f'{path}_blocks.json')
    
  isCropped = inputs['cropped'] if 'cropped' in inputs else False 
  
  # Load each scan (spectra + bitmap)
  for i in inputs['scans']:
    scan = getScan(f,root,i['spectra'],i['bitmap'])
    scans.append(scan)
  return scans
  
  
def spopen(filename):
  """
    Open a file containing spectra
  """
  if os.path.exists(filename):
    f = open(filename, 'rb')
    magicHeader = f.read(8) # Read magic number
    if not magicHeader:
      return "Error: EOF reached during magic header."
    return f
  return None
  

def spread(file,bitmap=None,scan=None):
  """
    Read all the scans (n = -1) in the file or only the `n`th in the file.
    A scan contains the collection of spectra + metadata (various information, bitmap, etc.)
    @author Hamza Jlajla
    @author Jean-Christophe Taveau
  """

  # First Pass - Read all the tag(s)
  root = readAllBlocks(file)
  # Second Pass - Clean Blocks Tree
  root = cleanTree(root)
  return root


def readAllBlocks(f,filename = ''):
  """
    Read the whole data tree in file and build a JSON file
    @author Hamza Jlajla
    @author Jean-Christophe Taveau
  """
  #Read first tag
  rootName, rootType, rootStart, rootEnd = wu.readTag(f, 8)
  if rootType > 0:
    return "Error: First tag not a tag list"

  #Read tags within first tag
  root = {"name":"root","start": -1, "children":[]}
  readBlocks(f, root,rootStart, rootEnd, 1, None, None)
 
  return root

def writeBlocks(root,filename):
  if len(filename) > 0:
    fsencoding = sys.getfilesystemencoding()
    json.dump(root, open(filename,"w"), indent=2, ensure_ascii=False)
    

# Constants
TAGTYPES = ['wit','???','float64','float32','int64','int32','uint32','uint8','bool','string'];
TAGFORMAT = ['???','???','<d','<f','<L','<i','<I','B','?','c'];
NBYTES = [0,0,8,4,8,4,4,1,1,1]
IMGINDEX = ['Image','Line','Point','Array','Histogram','Time','Mask','Volume']



def readBlocks(f, parent,start, end, depth, indices, parentName): 
  if indices == None:
    indices = {}
  newIndex = -1
  pos = start
  while pos < end:
    tName, tType, tStart, tEnd = wu.readTag(f, pos)
    block = {}
    block["parent"] = parent["start"]
    block["name"] = str(tName,'utf-8')
    block["type"] = tType
    block["tagtype"] = TAGTYPES[tType]
    block["start"] = tStart
    block["end"] = tEnd

    if tType == 0:
      block["children"] = []
      indices, newIndexRet = readBlocks(f, block,tStart, tEnd, depth+1, indices, tName)
      if newIndexRet >= 0: # on rentre pas dans ce if parceque le new indexret ne change pas
        if parentName != b'TData' and tName != b'TData':
          indices[newIndexRet] = [tName, tType, tStart, tEnd]
        else:
          newIndex = newIndexRet
    else:
      dat = []
      f.seek(tStart)
      raw = f.read(tEnd-tStart)
      block["size"] = len(raw)
      if block["size"] < 80:
        for off in range(0,len(raw),NBYTES[tType]):
          v = struct.unpack(TAGFORMAT[tType], raw[off:off+NBYTES[tType]])
          dat.append(v[0])
      else:
        # If it's too large. Just show the number of elements in the List
        dat = [len(raw)/NBYTES[tType],'elements']
      # Improve display...
      # If String...
      if (tType == 9):
        # BUG: The first three bytes are wrong. Why?
        # BUG: Cannot support non UTF-8 code, use latin-1 instead (\ub5 for example)
        dat = b''.join(dat[4:]) #.replace(b'\xb5',b'u')
      #If `dat` only contains one element....
      if (len(dat) == 1):
        dat = dat[0]
      block["data"] = str(dat,'latin-1') if tType == 9 else dat

    parent['children'].append(block)
    
    pos = tEnd
  return [indices,newIndex]


def cleanTree(root):
  _debug = wu.getAllBlocksByTag(root,'ModelOrigin',[])
  for d in _debug:
    print(d['data'])
  # Re-arranging tree by merging DataClassName + following node `Data`
  blocks = wu.getBlockByTag(root,'Data')['children']
  for index,b in enumerate(blocks):
    if 'DataClassName' in b['name']:
      tmp = blocks.pop(index+1)
      b['ID'] = int(wu.getBlockByTag(tmp,'ID')['data'])
      b['caption'] = wu.getBlockByTag(tmp,'Caption')['data']
      b['children'] = [tmp]
      
    # Do some stats
  rootData = wu.getBlockByTag(root,'Data')
  bms = wu.getAllBlocksByName(rootData,'DataClassName','TDBitmap', outnodes = []) # Bitmaps (TDBitmap)
  sps = wu.getAllBlocksByName(rootData,'DataClassName','TDGraph', outnodes = [])  # Spectra (TDGraph)
  root["NumTData"] = len(wu.getAllBlocksByTag(rootData,'TData',[]))
  root["NumTDGraph"] = len(sps)
  root["NumTDBitmap"] = len(bms)
  root["List"] = []
  root["List"] = [ [b['name'],b['caption']] for b in sorted(bms+sps, key=lambda item: item['start']) ]
  
  return root

def getScan(f,root,spName,bmName):
  """
    Get the spectra and associated (meta)data corresponding to the nth scan.
    `n = 0` corresponds to the first scan 
    
    scan
    +-- meta: A dictionary of metadata
    +-- spectra: A list of numbers
    +-- bitmap
        +-- sizeX
        +-- sizeY
        +-- dataType (RGBA or ABGR)
        +-- pixels
  """
  scan = {}
  rootData = wu.getBlockByTag(root,'Data')
  spBlock = wu.getBlockByKeyValue(rootData,'caption',spName)
  bmBlock = wu.getBlockByKeyValue(rootData,'caption',bmName)
  scan['spectra'] = wd.getSpectra(f,rootData,spBlock)
  scan['bitmap']  = wd.getBitmap(f,rootData,bmBlock)
  return scan
  
'''
Get all data from all spectra blocks

  Parameters:
    filename (String) : Path of the imported file
    inputs (dict) : Name of the spectra to search
    
  Returns:
    scans (array) : Contain all data gotten in the file
'''
def sploadSpectra(filename,inputs):
  scans = []

  f = spopen(filename)
  if not f:
    return
    
  # Read all the blocks
  root = spread(f)
    
  isCropped = inputs['cropped'] if 'cropped' in inputs else False 
  
  # Load each scan (spectra + bitmap)
  for i in inputs['scans']:
    scan = getScanSpectra(f,root,i['spectra'])
    scans.append(scan)
  return scans

'''
Get all values in a spectra block

  Parameters:
    f (File) : Wip file
    root (dict) : Dictionnary of all nodes in the file
    spName (String) : Spectra block
    
  Returns:
    scan (dict) : Value in the spectra block
'''
def getScanSpectra(f,root,spName,):
  scan = {}
  rootData = wu.getBlockByTag(root,'Data')
  spBlock = wu.getBlockByKeyValue(rootData,'caption',spName)
  scan['spectra'] = wd.getSpectra(f,rootData,spBlock)
  return scan