import spc as sp
import numpy as np
import sys
sys.path.insert(0, '../gimmick/src/py/src/io/spc')
import spc

'''
    Save the data in a new file

    Parameters:
        file (File) : Opened file
        pathout (String) : Path of the output file
        extension_out (String) : Extension of the output file
'''
def saveData(file,pathout,extension_out):
    #array = allData(file)
    #np.savetxt(output,array,delimiter='\t',fmt='%f')
    if extension_out == 'csv' :
        convertToCSV(file,pathout)
    elif extension_out == 'txt' :
        convertToTxt(file,pathout)

'''
    Save the data in a new file

    Parameters:
        pathin (String) : Path of the imported file
    
    Returns:
        f (File) : Opened file
'''
def loadData(pathin):
    f = spc.File(f'{pathin}')
    return f

'''
    Save the data in a csv file

    Parameters:
        file (File) : Opened file
        pathout (String) : Path of the output file
'''
def convertToCSV(file,pathout):
    file.write_file(pathout[:-4]+".csv",",")

'''
    Save the data in a txt file

    Parameters:
        file (File) : Opened file
        pathout (String) : Path of the output file
'''
def convertToTxt(file,pathout):
    file.write_file(pathout,"\t")

'''
    Save the data in a new file

    Parameters:
        pathin (String) : Path of the imported file
        pathout (String) : Path of the output file
        extension_out (String) : Extension of the output file
'''
def importSPC(pathin,pathout,extension_out):
    f = loadData(pathin)
    saveData(f,pathout,extension_out)