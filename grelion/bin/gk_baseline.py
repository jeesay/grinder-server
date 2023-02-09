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
//  along with GIMMICK.  If not, see <http://www.gnu.org/licenses/>.
'''

import numpy as np
from pybaselines import Baseline
import json
import argparse
import matplotlib.pyplot as plt

'''
    Calculate the base line by rolling_ball

    Parameters:
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        parameter (dict) : Parameters

    Returns:
        y2 (np.array) : Array of the calculate y values
'''
def base_ball(x,y,hw,shw,pk):
    base = Baseline(x)
    hw = None if hw == 'None' else x
    shw = None if shw == 'None' else x
    pk = None if pk == 'None' else x
    y2 = base.rolling_ball(y, half_window=hw, smooth_half_window=shw, pad_kwargs=pk)[0]
    return y2

'''
    Remove the baseline to the spectra

    Parameters:
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        y2 (np.array) : Array of the y values from the baseline

    Returns:
        final_y (np.array) : Array of the final y values
'''
def remove_baseline(x,y,y2):
    final_y = np.zeros(len(x))
    for i in range(len(x)) :
        final_y[i] = y[i] - y2[i]
    return final_y


def main(args) :
    with open(args.input) as input_file:
        json_array = json.load(input_file)
        x = np.array(json_array['scaleX'])
        y = np.array(json_array['data'][0])


    processors = {
        "rolling_ball" : base_ball,
    }
    method = args.algo
    func = processors.get(method)
    res = func(x,y,args.halfwind,args.smoothhalf,args.padkwargs)

    tmp = {'scaleX':x.tolist()}
    tmp['data']=res.tolist()
    json.dump(tmp, open(args.output,"w"), indent=2, ensure_ascii=False)
    
def getArgumentsFromTables() :
    with open("Tables.md", 'r') as f:
        for i in f.readlines() :
            if 'pad_kwargs' in i:
                print(i)
                res = i.split(" | ")
                print(res[1])
                print(res[2])


if __name__ == "__main__":
    # execute only if run as a script
    my_parser = argparse.ArgumentParser()
    my_parser.add_argument('-i','--input',action='store', required=True, help='Input JSON data file')
    my_parser.add_argument('-o','--output',action='store', required=True, help='Output JSON data file')
    my_parser.add_argument('-ag','--algo',action='store', required=True, help='Used method')
    my_parser.add_argument('-hw','--halfwind',action='store', help='half_window (int)')
    my_parser.add_argument( '-shw','--smoothhalf',action='store', help='smooth_half_window (int)' )
    my_parser.add_argument( '-pk','--padkwargs',action='store', help='pad_kwargs (dict)' )

    args = my_parser.parse_args()


    #main(args)
    getArgumentsFromTables()

# python3 gk_baseline.py -i "Single Spectrum_000_Spec.Data 1-Si.json" -o "Corrected_Spectra.json" -ag "rolling_ball" -hw None -shw None -pk None
# python3 gk_baseline.py --input "Single Spectrum_000_Spec.Data 1-Si.json" --output "Corrected_Spectra.json" --algo "rolling_ball" --halfwind None --smoothhalf None --padkwargs None