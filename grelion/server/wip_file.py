import sys
sys.path.insert(0, '../gimmick/src/py/io')
import wip as wp
import wipUtils as wu
import os
import json

'''
    Save the principal information of the spectra

    Parameters:
		scan (dict) : Contains all data for a spectra
        pathout (String) : Path of saved data
'''
def saveHeader(spectra,pathout):
    extension = pathout.split(".")[-1]

    if extension == 'txt' :
        with open(pathout,'w') as file :
            file.write("".join(spectra['title']+" "))
            file.write("".join(str(spectra['roi'][0][0:2].tolist())))
            file.write("".join(str(spectra['roi'][1][0:2].tolist()))+" ")
            file.write("".join(str(spectra['width'])+"x"+str(spectra['height'])+"x"+str(spectra['depth'])+"\n"))

    if extension == 'json' :
        tmp = {}
        tmp["title"] = f"{spectra['title']} {spectra['roi'][0][0:2].tolist()} {spectra['roi'][1][0:2].tolist()} {spectra['width']}x{spectra['height']}x{spectra['depth']} "
        json.dump(tmp, open(pathout,"w"), indent=2, ensure_ascii=False)

'''
    Save the data values in a file

    Parameters:
		spectra (dict) : All values from the spectra
        pathout (String) : Path of saved data
'''
def saveSpectra(spectra,pathout):
  extension = pathout.split(".")[-1]

  if extension == 'json' :
    f = open(f"{pathout}")
    tmp = json.load(f)
    f.close()
    for k in spectra.keys():
      if k in ['data','roi']:
        tmp[k] = spectra[k].tolist()
      else:
        if k != 'title':
            tmp[k] = spectra[k]
    json.dump(tmp, open(pathout,"w"), indent=2, ensure_ascii=False)

  if extension == 'txt' :
    with open(pathout,'a') as file :
      for k in range (len(spectra["scaleX"])) :
        value = spectra["scaleX"][k]
        row = f"{value}"
        for i in range (len(spectra['data'])):
          row += " "+str(spectra['data'][i][k])
        file.write("".join(row)+"\n")

'''
    Save the data

    Parameters:
		scan (dict) : Contains all data for a spectra
        pathout (String) : Path of saved data
'''
def save(scan,pathout):
    saveHeader(scan['spectra'],f"{pathout}")
    saveSpectra(scan['spectra'],f"{pathout}")



'''
    Get all spectra names

    Parameters:
		file (File) : Opened file

    Returns:
        caption (array) : Array containing the spectra names from the wip file
'''
def getAllSpectraBlocks(file):
    root = wp.spread(file)
    file.close()
    caption = []
    rootData = wu.getBlockByTag(root,'Data')
    sps = wu.getAllBlocksByName(rootData,'DataClassName','TDGraph', outnodes = [])

    for i in range (len(sps)) :
        caption.append(sps[i]['caption'])
    return caption

'''
    Save all the selected spectra

    Parameters:
		pathin (String) : Path of initial file
        pathout (String) : Path of saved data
        caption (array) : Array containing the spectra names to import

    Returns:
        None
'''
def saveScans(pathin,pathout,caption):
    spectra = []
    for i in caption :
        temp = {
            "spectra" : f"{i}"
        }
        spectra.append(temp)
    ins = {
        "scans" : spectra,
        "cropped": True,
    }
    scans = wp.sploadSpectra(pathin,ins)

    for i in scans :
        output_path = pathout[:-len(pathout.split('/')[-1])]
        output_path += f"{i['spectra']['title']}.json"
        save(i,f"{output_path}")
    return None

'''
    Import and save data from wid file

    Parameters:
		pathin (String) : Path of initial file
        pathout (String) : Path of saved data
'''
def importWID(pathin,pathout):

    name = pathin.split("/")[-1][:-4]
    ins = {
    "scans" : [
        {
            "spectra": f"{name}"
        }
    ],
    "cropped": True,
    }

    scans = wp.sploadSpectra(pathin,ins)
    for i in scans :
        save(i,f"{pathout}")

'''
    Import and save the data of a wip file

    Parameters:
		pathin (String) : Path of initial file
        pathout (String, default None) : Path of saved data
        caption (array, default None) : Array containing the spectra names to import
        select (Boolean, default False) : Says if spectra from the project were selected or not

    Returns:
        result (array) : If spectra weren't selected, return an array of all spectra in the project 
'''
def importWIP(pathin, pathout = None, caption = None, select = False):
    f = open(pathin, "rb")
    if select :
       result = saveScans(pathin,pathout,caption)
    else :
        result = getAllSpectraBlocks(f)
    return result