# Import data
import numpy as np
import gk_workflow as gkw
import os
import json

import sys
sys.path.insert(0, '../gimmick/src/py')
import spc_file as sp
import wip_file as wp

from tkinter import Tk
from tkinter.filedialog import askopenfilename

'''
    Get the directory path of a selected file with TK

    Returns:
        pathin (String) : Absolute path of the imported file 
'''
def getPathTK():
    
    root = Tk()
    root.attributes("-topmost", True) # Only for windows users
    #root.lift()
    root.withdraw()

    pathin = askopenfilename()
    return pathin

'''
    Get the directory path of a selected file

    Parameters:
		name (String) : name of the file

    Returns:
        (String) : Absolute path of the imported file 
'''
def getPath(name):
    for root, dirs, files in os.walk("./"):
        for dir in dirs :
            if 'data' in dir or 'Data' in dir or 'Raw' in dir or 'raw' in dir :
                pathin = f"./{dir}/"
                break
    for root, dirs, files in os.walk(pathin):
        if name in files :
            return (f'{pathin}{name}')
    return None

'''
    Import json file

    Parameters:
		pathin (String) : Path of the json file
    
    Returns:
        result (dict) : Data from the json file
'''
def importJSON(pathin):
    f = open(pathin,'r')
    result = json.load(f)
    f.close()
    return result

'''
    Save in the arborescence the output in config.json

    Parameters:
		pathout (String) : Path of the output file
'''
def saveOutput(pathout) :
    gkw.addOutput("./.gimmick",pathout)

'''
    Save in the arborescence all the spectra in config.json

    Parameters:
		pathout (String) : Path of the output file
        caption (array) : Name of all spectra to import
'''
def saveOutputWIP(pathout,caption):
    for i in caption :
        gkw.addOutput(f"./.gimmick",f"{pathout}{i}")

'''
    Import a file and save data in the output directory

    Parameters:
		pathin (String) : Absolute path of the imported file
        job (int) : Number of the actual job
        ext (String) : Extension for the output file
    
    Returns:
        result (array) : Array containing all the spectra in a wip file
        None
'''
def getFile(pathin,job,extension_out,caption) :

    extension = pathin.split('.')[-1]
    name = pathin.split('/')[-1]
    pathout = f"./.gimmick/Import/job_{job}/Output/{name}"[:-len(extension)]+f"{extension_out}"

    if extension == "spc" :
        sp.importSPC(pathin,pathout,extension_out)
        saveOutput(pathout[:-len(extension_out)]+"txt")
        saveOutput(pathout[:-len(extension_out)]+"csv")
        return None
    
    if extension == "wip" :
        if len(caption) == 0 :
            result = wp.importWIP(pathin)
        else :
            result = wp.importWIP(pathin,pathout,caption,True)
            saveOutputWIP(f"./.gimmick/Import/job_{job}/Output/",caption)
        return result
    
    if extension == "wid":
        wp.importWID(pathin,pathout)
        saveOutput(pathout)
        return None
    
    return None
    
