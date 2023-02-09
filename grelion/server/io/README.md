Spc : Module for reading spc files and convert them to csv or txt  
  
Wip file : Binary file in blocks
  
A scan : one Bitmap and multiple spectrum  
A spectra :  
  - X-axis wevelengths (rescaled, cm-1, float)  
  - Y-axis intensity (arbitrary unit, int)  

Import names of the bitmap and spectrum to use them

Other file type :  
wid : same as wip but only one TDGraph
txt : 3 files, one one information, one for X-axis, one for Y-axis

#### Block structure for a spectra example 
  
DataClassName 2:string ➜ TDSpaceTransformation  
Data 2:wit  
&nbsp;&nbsp;&nbsp;&nbsp;L TData:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L ID:int32 ➜ 33  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Caption:string ➜ Single Spectrum_000_Position Transformation  
&nbsp;&nbsp;&nbsp;&nbsp;L TDSpaceTransformation:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L ViewPort3D:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L ModelOrigin:float64 ➜ [0,0,0]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L WorldOrigin:float64 ➜ [13832.946261830812,2413.106699296421,0]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Scale:float64 ➜ [...9]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Rotation:float64 ➜ [...9]  
  
DataClassName 3:string ➜ TDSpectralInterpretation  
Data 3:wit  
&nbsp;&nbsp;&nbsp;&nbsp;L TData:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L ID:int32 ➜ 34  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Single Spectrum_000_Spec.Data 1: Spectral Interpretation  
&nbsp;&nbsp;&nbsp;&nbsp;L TDSpectralInterpretation:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L ExcitationWaveLength:float64 ➜ 532.010009765625  
  
DataClassName 4:string ➜ TDSpectralTransformation  
Data 4:wit  
&nbsp;&nbsp;&nbsp;&nbsp;L TData:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L ID:int32 ➜ 35  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Caption:string ➜ Single Spectrum_000_Spec.Data 1: Spectral Transformation  
&nbsp;&nbsp;&nbsp;&nbsp;L TDSpectralTransformation:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L SpectralTransformationType:int32 ➜ 1  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Polynom:float64 ➜ [0,0,0]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L nC:float64 ➜ 800  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L LambdaC:float64 ➜ 597.9943237304688  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Gamma:float64 ➜ 0.43625906109809875  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Delta:float64 ➜ -0.0038509839214384556  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L m:float64 ➜ 1  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L d:float64 ➜ 1666.6666259765625  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L x:float64 ➜ 0.016  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L f:float64 ➜ 294.6912536621094  

DataClassName 5:string ➜ TDGraph  
Data 5:wit  
&nbsp;&nbsp;&nbsp;&nbsp;L TData:wit  
&nbsp;&nbsp;&nbsp;&nbsp;L ID:int32 ➜ 36  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Caption:string ➜ Single Spectrum_000_Spec.Data 1-Si  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L MetaData:wit   
&nbsp;&nbsp;&nbsp;&nbsp;L TDGraph:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L SizeX:int32 ➜ 1  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L SizeY:int32 ➜ 1  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L SizeGraph:int32 ➜ 1600  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L SpaceTransformationID:int32 ➜ 33  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L SecondaryTransformationID:int32 ➜ 0  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L XTransformationID:int32 ➜ 35  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L XInterpretationID:int32 ➜ 34  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L ZInterpretationID:int32 ➜ 30  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L GraphData:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Dimension:int32 ➜ 2  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L DataType:int32 ➜ 9  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Ranges:int32 ➜ [1,1600]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Data:uint8 ➜ [...6400]  
  
DataClassName 6:string ➜ TDText  
Data 6:wit  
&nbsp;&nbsp;&nbsp;&nbsp;L TData:wit  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L ID:int32 ➜ 37  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L Caption:string ➜ Single Spectrum_000 Information    
&nbsp;&nbsp;&nbsp;&nbsp;L TDStream:wit    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L StreamData:uint8 ➜ [...1664]  
> General:  
> System ID: 100-1100-614  
> Time: 9:16:36 AM  
> Date: Friday, June 22, 2018  
> User Name: user  
> Sample Name:  
> Configuration: Raman CCD1  
> UHTS300:  
> Excitation Wavelength [nm]: 532.010  
> Grating: G1: 600 g/mm BLZ=500nm  
> Center Wavelength [nm]: 597.994  
> Spectral Center [rel. 1/cm]: 2074.072  
> DU970_BV,35:  
> Width [Pixels]: 1600  
> Height [Pixels]: 200  
> Temperature [C]: -59  
> Integration Time [s]: 0.05000  
> Camera Serial Nr.: 11580  
> AD Converters: AD1 (16Bit)  
> Output Amplifier: Conventional  
> Vertical Shift Speed [s]: 9.75  
> Horizontal Shift Speed [MHz]: 0.05  
> Preamplifier Gain: 1  
> EMCCD Gain: 0  
> ReadMode: Full Vertical Binning  
> Number Of Accumulations: 10  
> Integration Time [s]: 0.05000  
> Objective:  
> Objective Name: Nikon 100x / 0.95  
> Objective Magnification: 100.0  
> Sample Location (global position):  
> Position X [m]: 13832.946  
> Position Y [m]: 2413.107  
> Position Z [m]: 0.000  