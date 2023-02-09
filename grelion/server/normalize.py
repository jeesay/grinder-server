'''
//  GIMMICK - Graphical Interface of Multi-Modal Imaging and sCientific Kit
//  Copyright (C) 2023  Jean-Christophe Taveau
//
//  This file is part of GIMMICK
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with GIMMICK. If not, see <http://www.gnu.org/licenses/>.

'''

def vector_norm(input_data):
  # TODO
  
def minmax_norm(input_data):
  # TODO
def peak_norm(input_data):
  # TODO
  
  
# From Shravankumar Hiregoudar
# https://towardsdatascience.com/scatter-correction-and-outlier-detection-in-nir-spectroscopy-7ec924af668

def snv(input_data):
    '''
        :snv: A correction technique which is done on each individual spectrum, a reference spectrum is not required.
        :param input_data: Array of spectral data
        :type input_data: DataFrame
        
        :returns: data_snv (ndarray): Scatter corrected spectra
    '''
    
    input_data = np.asarray(input_data)
    
    # Define a new array and populate it with the corrected data  
    data_snv = np.zeros_like(input_data)
    for i in range(data_snv.shape[0]):    
        # Apply correction
        data_snv[i,:] = (input_data[i,:] - np.mean(input_data[i,:])) / np.std(input_data[i,:])
    
    return (data_snv)


def msc(input_data, reference=None):
    '''
        :msc: Scatter Correction technique performed with mean of the sample data as the reference.
        :param input_data: Array of spectral data
        :type input_data: DataFrame
        
        :returns: data_msc (ndarray): Scatter corrected spectra data
    '''
    
    eps = np.finfo(np.float32).eps
    input_data = np.array(input_data, dtype=np.float64)
    ref = []
    sampleCount = int(len(input_data))

    # mean centre correction
    for i in range(input_data.shape[0]):
        input_data[i,:] -= input_data[i,:].mean()
    
    # Get the reference spectrum. If not given, estimate it from the mean
    # Define a new array and populate it with the corrected data
    data_msc = np.zeros_like(input_data)
    for i in range(input_data.shape[0]):
        for j in range(0, sampleCount, 10):
            ref.append(np.mean(input_data[j:j+10], axis=0))
            # Run regression
            fit = np.polyfit(ref[i], input_data[i,:], 1, full=True)
            # Apply correction
            data_msc[i,:] = (input_data[i,:] - fit[0][1]) / fit[0][0]
    
    return (data_msc)



    
def zscorefunction(arrayMatrix, threshold=1):
    '''
        :zscorefunction: Compute the z score of arrayMatrix     
        (Individual sample), relative to the sample median and   
         standard deviation.        
         :param arrayMatrix: Array file containing spetral data of one sample
        :type arrayMatrix: array
        
        :returns: The coordinates of the points which are considered to be outliers.
        We are interested in x coordinate of the results. 
        Here, In our case, the x coordinate is the spectra number.
        
        - Example of the output::            output:(array([1,2,1,2,3,4]), array([1,5,8,70,85,143]))
            
            Read as, (spectra number, point in the spectra) 
            (1,1),(2,5),(1,8),(2,70),(3,85) and (4,143). 
            
            [1,2,1,2,3,4] are the spectra number of the sample 
            and [1,5,8,70,85,143] are the point in the spectra
            
            The 1st and 8th wavelength point in the 1st spectra 
            are outliers.similarly, The 5th and 70th wavelength   
            point in the 2nd spectra are outliers    '''
    # A z-score is the number of standard deviations away from a  
    mean for a data point. 
    zscore = (arrayMatrix - np.median(arrayMatrix))/   
    arrayMatrix.std()
    
    return (np.where(np.abs(zscore) > threshold))
    
def deleteOutliersSummary(X,Y,summary = True):
    '''
        :deleteOutliersSummary: Calls the z score function to get   
        the outlier spectra numbers.We are interested in x 
        coordinate of the results. In our case, the x coordinate is 
        the spectra number.So, we apply the counter function on the 
        result to get the total count of outlier points for 
        spectra.and delete the spectra if the spectra has 75% of 
        its points as outliers        :param X: Training spectral file (usually MSCTrain)
        :type X: array        :param Y: Training target file      
        :type Y: array        :returns: individualX (list) and y (list), 
        New spectral & target train files with outliers eliminated    
    '''    
    
    # A z-score is the number of standard deviations away from a mean for a data point. 
   
    # We define a deleteSpectra where we store the Spectra number with more than 75%
    # (you can change this based on your MSC data) points as outliers
    deleteSpectra = []
    individualX = neoSpectraSensorData.getIndividualSamples(X)
    y= getMeanData.getMeanTarget(Y)
    out = 0
    noOut = 0
    sampleCount = len(individualX)
    for i in range(0,sampleCount):
        # call the function
        x = zscorefunction(individualX[i])[0]
        # print sample number and spectra number with its corresponding number of outlier points
        
        if summary == True:
            # Counter gives the spectra number(index): number of outlier points
            print("\nSAMPLE",i+1)
            print(Counter(x))        threshold = 0.75*X[1].shape[0]
        for j in range(0,individualX[i].shape[0]):
            # If the sepctra contains more than 75% of points as   
            outliers, delete the spectra
            
            if (Counter(x)[j] > threshold):
                deleteSpectra.append(j)        # Delete the outlier spectra from the sample
        individualX[i] = np.delete(individualX[i], deleteSpectra, 0)
        y[i] = np.delete(y[i], deleteSpectra, 0)
        
        # If the sample has no outliers in all it's spectra then 
        display "No outliers detected"
        if deleteSpectra != []:
            out +=1
        else:
            noOut +=1
        
        if noOut == sampleCount:
            print("No outliers detected")
        
        if summary == True:
            print ("Delete Spectra:",deleteSpectra)
        del deleteSpectra[:]
        
    return(individualX,y)
    
def linegraph(df,name="data"):
    '''
        :linegraph: Plot absorbance unit vs wavelength number graph
        :param df: Spectral data containing absorbance units and wavelengths
        :type df: ndarray        
        
        :returns: Absorbance unit vs wavelength graph
    '''    # Read the spectral data file
    neospectraDataFile= neoSpectraSensorData.getNeospectraDataFile()    # Get the wavelengths
    wavelengths =
    np.array(neospectraDataFile.columns).astype(np.float)
    x = wavelengths
    y = df
    ys = [i for i in y] #put into the format for LineCollection    # We need to set the plot limits, they will not autoscale
    fig, ax = plt.subplots(figsize=(10,10), dpi=150)
    ax.set_xlim(np.min(x), np.max(x))
    ax.set_ylim(np.min(ys), np.max(ys))    # Make a sequence of x,y pairs
    line_segments = LineCollection([np.column_stack([x, y]) for y in ys],linewidths=(0.5),linestyles='solid')
    ax.add_collection(line_segments)
    ax.set_title('Absorbance unit graph of '+name, fontsize = 15)
    ax.set_xlabel(r'Wavenlength', fontsize=15)
    ax.set_ylabel('Absorbance', fontsize=15)
    
    return(plt.show())


# EMSC in R From https://github.com/khliland/EMSC/

