# -*- coding: utf-8 -*-
"""
Read spectra in file format Wip version 6 or 7
Based on Matlab package wit_io from ???

Created on March 15, 2021
@author: Hamza Jlajla
@author: Jean-Christophe Taveau


"""
import struct
import numpy as np


def readTag(f, pos): 
  f.seek(pos)
  d = f.read(4)
  tagNameLength = struct.unpack("<i", d)[0]
  tagName = f.read(tagNameLength)
  tagType = struct.unpack("<i", f.read(4))[0]
  tagDataStart = struct.unpack("<q", f.read(8))[0]
  tagDataEnd = struct.unpack("<q", f.read(8))[0]
  return [tagName, tagType, tagDataStart, tagDataEnd]

def readInt(f, pos):  
  f.seek(pos)
  return struct.unpack("<i", f.read(4))[0] # read int 

def readDouble(f, pos):
  f.seek(pos)
  return struct.unpack("<d", f.read(8))[0] # read double 

def readfloat(f,pos):
  f.seef(pos)
  return struct.unpack("<f", f.read(8))[0]

def readIntFromTag(f, rootStart, rootEnd, node, descend):
  tag = findTag(f, rootStart, rootEnd, node, descend)
  if tag == None:
    return None
  else:
    return readInt(f, tag[2])
    
def readfloatFromTag(f, rootStart, rootEnd, node, descend):
  tag = findTag(f, rootStart, rootEnd, node, descend)
  if tag == None:
    return None
  else:
    return readfloat(f, tag[2])
  
def readDoubleFromTag(f, rootStart, rootEnd, node, descend):
  tag = findTag(f, rootStart, rootEnd, node, descend)
  if tag == None:
    return None
  else:
    return readDouble(f, tag[2])

def readAllTags(f, start, end, depth, indices, parentName): 
  if indices == None:
    indices = {}
  newIndex = -1
  pos = start
  while pos < end:
    tName, tType, tStart, tEnd = readTag(f, pos)
    if tType == 0:
      indices, newIndexRet = readAllTags(f, tStart, tEnd, depth+1, indices, tName)
      if newIndexRet >= 0: # on rentre pas dans ce if parceque le new indexret ne change pas
        if parentName != b'TData' and tName != b'TData':
          indices[newIndexRet] = [tName, tType, tStart, tEnd]
        else:
          newIndex = newIndexRet
    elif tType == 2:
      f.seek(tStart)
      v = struct.unpack("<d", f.read(8))[0]
    elif tType == 5:
      f.seek(tStart)
      v = struct.unpack("<i", f.read(4))[0]
      if tName == b'ID':
        newIndex = v
    elif tType == 9:
      f.seek(tStart)
      strLength = struct.unpack("<i", f.read(4))[0]
    pos = tEnd
  return [indices, newIndex]


  
def findTag(f, start, end, search, descend): # avoir 
  pos = start
  while pos < end:
    tName, tType, tStart, tEnd = readTag(f, pos)
    if tName == search:
      return [tName, tType, tStart, tEnd]
    if descend or tType == 0:
      subTag = findTag(f, tStart, tEnd, search,descend)
      if subTag != None:
        return subTag
    pos = tEnd
  return None
  
def lastTagOfDataClass(f, start, end, type):
  pos = start
  retTag = None
  nextHasCorrectType = False
  while pos < end:
    tag = readTag(f, pos)
    if tag[1] == 9:
      f.seek(tag[2])
      strLength = struct.unpack("<i", f.read(4))[0]
      if f.read(strLength) == type:
        nextHasCorrectType = True
    elif tag[1] == 0:
      if nextHasCorrectType:
        retTag = tag
        nextHasCorrectType = False
    pos = tag[3]
  return retTag



  
  
# trouver tout les tag bitmap 
def findData(f,rootStart, rootEnd,dataDict):
  scan={}
  for values in dataDict[0].values() :
    first=findTag(f, rootStart, rootEnd, values[0], False) # recheerche dasn tout les data 
    second=findTag(f, first[2], first[3], b'TData', False) #recherche d l information du fichier 
    if second != None :
      #print("ok")            # a chaque fois on controle si c est pas vide pour eviter les erreur 
      third = findTag(f, second[2], second[3], b'Caption', False) #on cherche le nom du fichier 
      if third != None :
        #print("ok2")
        f.seek(third[2])
        strLength = struct.unpack("<i", f.read(4))[0]
        name=str(f.read(strLength))
        if "" in name : # test sur le nom du scan 
          #print("ok3")
          tdgraph=findTag(f, first[2], first[3], b'TDBitmap', False)
          if tdgraph != None : # etre sure qu il existe des donnees 
            sizeX = readIntFromTag(f, tdgraph[2], tdgraph[3], b'SizeX', False)
            sizeY = readIntFromTag(f, tdgraph[2], tdgraph[3],b'SizeY', False) # les dimension de l image (cadre rouge )
            #graphsize=readIntFromTag(f, tdgraph[2], tdgraph[3],b'SizeGraph', False) # nombre de valeur par spectre 
            GraphData=findTag(f, tdgraph[2], tdgraph[3], b'BitmapData', False) # on rentre dans le bloque ou il y a les data 
            dataType = readIntFromTag(f, GraphData[2], GraphData[3], b'DataType', False)
            ranges = readIntFromTag(f, GraphData[2], GraphData[3], b'Ranges', False)
            Dimension = readIntFromTag(f, GraphData[2], GraphData[3], b'Dimension', False)
            #print("DataType",dataType)
            #print("dimension",Dimension)
            if dataType != 6 and dataType != 2 :    # il faut que ca soit de type 6 sinon on aura des erreru
              #print("ok4")
              return ("error type de spectre")
            dataY = []
            dataY.append({'x':sizeX,'y':sizeY})# prmiere valeur de la liste les dimension de l image
            data=findTag(f, GraphData[2], GraphData[3], b'Data', False)
            if data == None :
              #print("ok5")
              return ('error data')
            f.seek(data[2])
            image=[]#--blocks
            #print(sizeX)
            #print(sizeY)
            #print(GraphData[2])
            #print(GraphData[3])
            # extraction des donnees 
            pos=GraphData[2]
            for j in range(sizeY):
              spec=[]
              for j in range (sizeX):
                rgba=[]
                for i in range (4):
                  #print(f.read(2))
                  rgba.append(struct.unpack('<H', f.read(2))[0]) 
                spec.append(rgba)
                
              image.append(spec)
              
            # print(image)
            
            image=np.array(image)
            #print(image)
              # essai dafficher les image 
            # image1 = Image.new('RGBA', (int(sizeX),int(sizeY)))
            #print("y--------------->",len(image))
            #print("x--------------------->",len(image[0]))
            #for i in range(len(image)):
            #  for j in range(len(image[i])):
            #    image1.putpixel((j,i),(image[i][j][0],image[i][j][1],image[i][j][2],image[i][j][3]))
            #
            # plt.imshow(image1)
            #cv2.imshow("bitmap",image)
            # plt.show()
            
  return [scan,0] 


def getBlockByKeyValue(node,key,value):
  if key in node and node[key] == value:
    return node
  elif 'children' in node:
    for n in node['children']:
      resp = getBlockByKeyValue(n,key,value)
      if resp != None:
        return resp
  return None
  

def getBlockByLoc(node,id):
  """
    Get Block from byte position in file
  """
  return getBlockByKeyValue(node,'start',id)
'''
  if node['start'] == id:
    return node
  elif 'children' in node:
    for n in node['children']:
      resp = getBlockByLoc(n,id)
      if resp != None:
        return resp
  return None
'''

def getBlockByName(node,name,value):
  if node['name'] == name  and node['data'] == value:
    return node
  elif 'children' in node:
    for n in node['children']:
      resp = getBlockById(n,value)
      if resp != None:
        return resp
  return None
  
def getBlockById(node,value):
  if 'ID' in node and node['ID'] == value:
    return node
  elif 'children' in node:
    for n in node['children']:
      resp = getBlockById(n,value)
      if resp != None:
        return resp
  return None
  
def getBlockByTag(node,tagname):
  return getBlockByKeyValue(node,'name',tagname)
  
  
def getValueByTag(node,tagname):
  return getBlockByKeyValue(node,'name',tagname)['data']
  
  
def getParent(root,child):
  return getBlockByLoc(root,child['parent'])

def getSiblings(root,parent_id):
  p = getParent(root,parent_id)
  if 'children' in p:
    return p['children']
  return None
  
def getNexSibling(root,child_id):
  parent = getParent(root,child_id)
  for i,child in enumerate(parent['children']):
    if child['start'] == child_id and i+1 < len(parent['children']):
      return parent['children'][i+1]
  return None

def queryBlock(root,path):
  """  
    Example:
    sizeBlock = queryBlock(f,root,'TDBitmap.BitmapData.Ranges')
    w,h = sizeBlock['data']
  """
  tags = path.split('.')
  node = root
  for t in tags:
    tmp = getBlockByTag(node,t)
    if tmp != None:
      node = tmp
  return node

def _findTag(node,tagname):
  if node['name'] == tagname:
    return node
  elif 'children' in node:
    for nod in node['children']:
      response = findTag(nod,tagname)
      if response != None:
        return response
  return None
  
  
def getAllBlocksByTag(node,tagname,outnodes = []):
  if node['name'] == tagname:
    outnodes.append(node)
  elif 'children' in node:
    for nod in node['children']:
      getAllBlocksByTag(nod,tagname,outnodes)
  return outnodes
  
def getAllBlocksByName(node,tagname,value, outnodes = []):
  if tagname in node['name'] and node['data'] == value:
    outnodes.append(node)
  elif 'children' in node:
    for nod in node['children']:
      getAllBlocksByName(nod,tagname,value,outnodes)
  return outnodes
  

