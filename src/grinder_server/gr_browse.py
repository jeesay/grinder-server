'''
    GRINDER - Graphical user interface of RelIoN and DataminER
    Copyright (C) 2023  Jean-Christophe Taveau

    This file is part of GRINDER
   
    This program is free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
   
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
   
    You should have received a copy of the GNU General Public License
    along with GRINDER. If not, see <http: www.gnu.org/licenses/>.

    Authors : Texier Louis
'''

import argparse
import json
import os

def searchRawData():
    '''
        Search the raw data
    '''
    files = []
    extensions = [".mrc",".wid",".spc"]
    for r, d, f in os.walk('./'):
        for i in f :
            if i[-4:] in extensions and i != "config.json" :
                files.append(i)
    print(files, flush=True)
    return files

def searchDir(tool):
    '''
        Search directories
        Parameters:
            tool (String) : Name of the parent folder
    '''
    dir = []
    dir = next(os.walk('./.gimmick'))[1]
    if "Saves" in dir :
        dir.remove("Saves")
    if "Trash" in dir :
        dir.remove("Trash")
    if tool in dir and tool != "Normalization":
        dir.remove(tool)
    print(dir, flush=True)

def searchDirAlgo(tool):
    '''
        Search jobs available
        Parameters:
            tool (String) : Name of the directory to check
    '''
    dir = []
    dir = next(os.walk(f'./.gimmick/{tool}'))[1]
    with open("./.gimmick/config.json","r") as f:
        result = json.load(f)
    for jobs in result["jobs"] :
        for i in range(len(dir)) :
            if jobs["tool"] == tool and jobs["status"] == "true":
                if dir[i] not in jobs["alias"] and dir[i].split("_")[-1] == jobs["id"]:
                    dir[i] = jobs["alias"]
    print(dir, flush=True)


def searchJsonData(dir):
    '''
        Search json files in directories
        Parameters:
            dir (String) : Name of the directory to check
    '''
    displayableFiles = ["Spectra.json","Hyperspectra.json"]
    availableFiles = []
    true_dir = dir
    with open("./.gimmick/config.json","r") as f:
        result = json.load(f)
    for jobs in result["jobs"] :
        if dir == jobs["alias"] :
            true_dir = f"job_{jobs['id']}"
    
    d = next(os.walk('./.gimmick'))[1]
    for fold in d :
        directories = next(os.walk(f'./.gimmick/{fold}'))[1]
        if true_dir in directories :
            availableFiles = next(os.walk(f'./.gimmick/{fold}/{true_dir}/Output'))[2]
            break

    usableFiles = []
    for i in range(len(availableFiles)) :
        if availableFiles[i] in displayableFiles:
            usableFiles.append((f"{availableFiles[i]}"))
    print(usableFiles, flush=True)

if __name__ == "__main__":
    # execute only if run as a script

    my_parser = argparse.ArgumentParser()
    my_parser.add_argument('-i','--input', action='store', required=True, help='Project called')
    my_parser.add_argument('-ag','--algo', action='store', required=True, help='Create/move project')

    args = my_parser.parse_args()

    if args.algo == "RawData" :
        searchRawData()
    elif args.algo == "Dir" :
        searchDir(args.input)
    elif args.algo == "DirAlgo":
        searchDirAlgo(args.input)
    elif args.algo == "Data" :
        searchJsonData(args.input)
