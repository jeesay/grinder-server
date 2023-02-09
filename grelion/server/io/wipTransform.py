# -*- coding: utf-8 -*-
"""
Calculate calibrations in file format Wip version 6 or 7
Based on Matlab package wit_io from ???

Created on March 15, 2021
@author: Hamza Jlajla
@author: Jean-Christophe Taveau


"""
import numpy as np

import wipUtils as wu


  
def getViewPort3D(root,block):
  # Retrieve the `ViewPort3D` in `TDSpaceTransformation` whose ID is given by `SpaceTransformationID` in block
  stID = wu.getValueByTag(block,'SpaceTransformationID')
  transform = wu.getBlockById(root,stID)
  viewport3D = wu.getBlockByTag(transform,'ViewPort3D')
  world = np.array(wu.getValueByTag(viewport3D,'WorldOrigin'))
  model = np.array(wu.getValueByTag(viewport3D,'ModelOrigin'))
  scale = np.array(wu.getValueByTag(viewport3D,'Scale')).reshape(3,3)
  rot = np.array(wu.getValueByTag(viewport3D,'Rotation')).reshape(3,3)
  return  {
    'world' : world,
    'model': model,
    'scale': scale,
    'rot': rot,
    'tmatrix': np.matmul(scale, rot)
  }

def spaceCalibration(roi_in_pixels,viewport):
  # From Witio
  # Formula converting pixel into um
  # Rotation * Scale*(px - Origin) + WorldOrigin (in general form)
  
  #Calibrated of Region of Interest
  roi = roi_in_pixels
  for vec in roi:
    center = np.subtract(vec,viewport['model'])
    trsfed = np.dot(center,viewport['tmatrix'])
    tmp = np.add(trsfed, viewport['world'])
    print(center,trsfed,tmp)
  return np.add(np.dot(np.subtract(roi, viewport['model']),viewport['tmatrix']) , viewport['world'])
  

def getSpectralTransf(root,block):
  # Retrieve the block with id = `XInterpretationID` to get ExcitationWaveLength
  xiID = wu.getValueByTag(block,'XInterpretationID')
  xinter = wu.getBlockById(root,xiID)
  ewl = wu.getValueByTag(xinter,'ExcitationWaveLength')
  # Retrieve the block with id = `XTransformationID` for spectralTransformation
  xtID = wu.getValueByTag(block,'XTransformationID')
  transform = wu.getBlockById(root,xtID)
  # Get params
  sizeG = wu.getValueByTag(block,'SizeGraph')
  calibType = wu.getValueByTag(transform,'SpectralTransformationType')
  polynom = wu.getValueByTag(transform,'Polynom')
  nC = wu.getValueByTag(transform,'nC')
  lambdaC = wu.getValueByTag(transform,'LambdaC')
  gamma = wu.getValueByTag(transform,'Gamma')
  delta = wu.getValueByTag(transform,'Delta')
  m = wu.getValueByTag(transform,'m')
  d = wu.getValueByTag(transform,'d')
  x = wu.getValueByTag(transform,'x')
  f = wu.getValueByTag(transform,'f')
  
  scaleX = None
  
  if calibType == 1:
    scaleX = spectralCalibration(sizeG,ewl,calibType,polynom,nC,lambdaC,gamma,delta,m,d,x,f)
  else:
    print ("No supported calibration found.")
  
  return scaleX


def spectralCalibration(sizegraph,ewl,type,polynom,nC,lambdaC,gamma,delta,m,d,x,f): # graphsize === 1600
  """
    Adapted from gwyddion and witio implementations:
    - +WITio/+obj/@wip/transform.m
    - gwyddion-2.58/modules/file/wipfile.c
    
    As stated in the paragraph below, we choose the sign convention of Witio.
    
    Full explanation of all the parameters below from https://www.horiba.com/en_en/wavelength-pixel-position/
    ===========
    λC - Wavelength (in nm) at center of array (where exit slit would usually be located)
    LA - Entrance arm length (mm)
    LBλn - Exit arm length to each wavelength located on the focal plane (mm)
    LBλc - Exit arm length to λc (CZ and FE monochromators LA = LBλc = F)
    LH - Perpendicular distance from grating or focusing mirror to the focal plane (mm)
    F - Instrument focal length. For CZ and FE monochromators LA = F = LB. (mm)
    βH - LH  - Angle from LH to the normal to the grating (this will vary in a scanning instrument)
    βλn - Angle of diffraction at wavelength n
    βλc - Angle of diffraction at center wavelength
    HBλn - Distance from the intercept of the normal to the focal plane to the wavelength λn
    HBλc - Distance from the intercept of the normal to the focal plane to the wavelength λc
    Pmin - Pixel # at extremity corresponding to λmin (e.g., # 1)
    Pmax - Pixel # at extremity corresponding to λmax (e.g., # 1024)
    Pw - Pixel width (mm)
    Pc - Pixel # at λc (e.g., # 512)
    Pλ - Pixel # at λn
    γ - Inclination of the focal plane measured at the location normally occupied by the exit slit, λc. 
    (This is usually the center of the array. However, provided that the pixel marking this location is 
    known, the array may be placed as the user finds most useful).

    For this reason, it is very convenient to use a spectrometer that permits simple interchange from 
    scanning to spectrograph by means of a swing away mirror. The instrument may then be set up with a 
    standard slit using, for example, a mercury lamp. Switching to spectrograph mode enables identification 
    of the pixel, Pc, illuminated by the wavelength previously at the exit slit.

    The equations that follow are for Czerny-Turner type instruments where γ = 0° in one case and γ ≠ 0° in the other.

    Case 1 γ = 0°

    See Fig. 61b.
    LH = LB = F at λc (mm)
    βH = β at λc
    HBλn = Pw (Pλ - Pc) (mm)

    HB is negative for wavelengths shorter than λc.
    HB is positive for wavelengths longer than λc.

    (70) βλn = βH - tan-1(HBλn/LH)

    Note: The secret of success (and reason for failure) is frequently the level of understanding of the sign convention. 
    Be consistent and make reasonably accurate sketches whenever possible.

    To make a calculation, α and β at λc can be determined from Equations (2), (19). At this point, the value for α is used 
    in the calculation of all values βλn for each wavelength.
    [...]

  """


  if type != 1 or m < 0.01 or f < 0.01 or nC < 0:
    print ("Warning: Calibration found but dismissed as unreasonable.")
    print ("No valid calibration found.")
    return None
  
  dataX =[0]*(sizegraph)
  for i in range(sizegraph):
    alpha = np.arcsin(lambdaC * m / d / 2.0 / np.cos(gamma / 2.0)) - gamma / 2.0
    betac = gamma + alpha
    hc = f * np.sin(delta)
    lh = f * np.cos(delta)
    hi = x * (nC - i) - hc   # Note: "- hc" Problem of sign convention. See Witio vs Gwyddion implementations
    betah = betac - delta    # Note: "- delta" Problem of sign convention. See Witio vs Gwyddion implementations
    if lh != 0.0:
      betai = betah - np.arctan(hi / lh)
      lambda_ = d / m * (np.sin(alpha) + np.sin(betai) )
      dataX[i] = ( (1/ewl) - (1/lambda_) ) * 10e6
  return dataX


