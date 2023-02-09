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


import wipUtils as wu
import wipTransform as wt

# Constants
DATATYPES = ['???','int64','int32','int16','int8','uint32','uint16','uint8','bool','float32','float64']
DATAFORMAT = ['???','<L','<i','int16','b','<I','uint16','B','?','<f','<d']
DATANBYTES = [0,8,4,2,1,4,2,1,1,4,8]


def getBitmap(f,root,bitmapBlock):
  # Get info concerning the TDBitmap
  width = 0
  height = 0

  data = wu.queryBlock(bitmapBlock,'BitmapData')
  datatype = DATATYPES[wu.getBlockByTag(data,'DataType')['data'] ]
  height,width = wu.queryBlock(data,'Ranges')['data']
  viewport = wt.getViewPort3D(root,bitmapBlock)
  scaled = wt.spaceCalibration(np.array([[0,0,0],[width,height,0.0]]),viewport)
  print('Bitmap',viewport,scaled)
  print(f"{bitmapBlock['name'].upper()}>>>>> {bitmapBlock['parent']}  {bitmapBlock['start']} Type: {datatype} Size: ({width} x {height})")
  # Pixels are not loaded in the first pass
  startPix = wu.queryBlock(data,'Data')
  f.seek(startPix['start'])
  # TODO Must be improved to get the exact pixel type: RGB, RGBA, etc.
  pixels = np.fromfile(f,dtype=np.uint8,count=width*height*4).reshape(height,width,4)

  return {
    "title": bitmapBlock['caption'],
    "data": pixels,
    "datatype": "RGBA",
    "width": width,
    "height": height,
    "transform": viewport,
    "roi": scaled
  }


def getSpectra(f,root,spectraBlock):

  # Get info concerning the TDGraph (spectra)
  width = wu.getValueByTag(spectraBlock,'SizeX')
  height = wu.getValueByTag(spectraBlock,'SizeY')
  depth = wu.getValueByTag(spectraBlock,'SizeGraph')

  print(f"{spectraBlock['name'].upper()}>>>>> Parent: {spectraBlock['parent']} Start/ID: {spectraBlock['start']} Size: ({width} x {height} x {depth})")
  
  data = wu.getBlockByTag(spectraBlock,'GraphData')
  size =  wu.getBlockByTag(data,'Ranges')['data']
  scaleX = wt.getSpectralTransf(root,spectraBlock)
  viewport = wt.getViewPort3D(root,spectraBlock)
  scaled = wt.spaceCalibration(np.array([[0,0,0],[width,height,0.0]]),viewport)
  print('Spectra',viewport,scaled)
  datatype = DATATYPES[wu.getBlockByTag(data,'DataType')['data'] ]

  # dataX = wu.calibration(f,rootStart, rootEnd,sizegraphe) # on calibre les axe des x 
  print(size,datatype)
  # Spectra are not loaded in the first pass
  startSpc = wu.queryBlock(data,'Data')
  f.seek(startSpc['start'])
  print('------------------------------------------------------------')
  print(f.seek(startSpc['start']))
  print('------------------------------------------------------------')
  spectra = np.fromfile(f,dtype=np.uint16,count=width*height*depth).reshape(width * height,depth)

  '''
  # Make into PIL Image and save
  filename = wu.queryBlock(wu.getParent(root,block),'TData.Caption')['data'].replace(' ','-')
  PILimage = Image.fromarray(spectra)
  ss = f"{filename}.tif"
  PILimage.save(ss)
  # pixels = f.read(b['end'] - b['start'])
  '''

  return {
    "title": spectraBlock['caption'],
    "datatype": datatype,
    "data": spectra,
    "scaleX": scaleX,
    "width": width,
    "height": height,
    "depth": depth,
    "size": size,
    "roi": scaled
  }


