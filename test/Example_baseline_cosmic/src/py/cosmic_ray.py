import matplotlib.pyplot as plt
import numpy as np
import json
import argparse
from pybaselines import utils

'''
    Generate a signal

    Returns:
        x (np.array) : Array of X values
        y (np.array) : Array of Y values
'''
def creat_raw():
    x = np.linspace(1, 1000, 1000)
    signal = (
        utils.gaussian(x, 4, 120, 5)
        + utils.gaussian(x, 5, 220, 12)
        + utils.gaussian(x, 5, 350, 10)
        + utils.gaussian(x, 7, 400, 8)
        + utils.gaussian(x, 4, 550, 6)
        + utils.gaussian(x, 5, 680, 14)
        + utils.gaussian(x, 4, 750, 12)
        + utils.gaussian(x, 5, 880, 8)
    )

    true_baseline = 2 + 10 * np.exp(-x / 400)
    noise = np.random.default_rng(1).normal(0, 0.2, x.size)

    y = signal + true_baseline + noise
    y[666] = 30

    return(x,y)

'''
    Calculate the Z score

    Parameters:
        y (np.array) : Array of Y values

    Returns:
        fmod_zscore (np.array) : Array of the scores
'''
def Zscore(y):
    med = np.median(y)
    MAD = np.median(abs(y-med))
    mod_zscore = np.zeros(len(y))
    for i in range(len(y)) :
        mod_zscore[i] = abs(0.6745*(y[i]-med)/MAD)
    return mod_zscore

'''
    Detect the cosmic rays

    Parameters:
        y (np.array) : Array of Y values
        threshold (int) : Value of threshold to detect rays

    Returns:
        spikes (np.array) : Array of 1 if ray detected and 0 if not
'''
def detection(y,threshold):
    spikes = abs(Zscore(y))> threshold
    return spikes

'''
    Remove the cosmic rays

    Parameters:
        y (np.array) : Array of Y values
		m (int) : Half larger of selection to calculate the new value
        threshold (int) : Value of threshold to detect rays

    Returns:
        y2 (np.array) : Array of the final y values
'''
def remove(y,m,threshold):
    y2 = y.copy()
    spikes = detection(y,threshold)
    for i in range(len(spikes)):
        if spikes[i] > 0 :
            w = np.arange(i-m,i+m+1)
            w2 = w[spikes[w]==0]
            y2[i] = np.mean(y[w2])
    return y2

'''
    Calculate the base line by snip

    Parameters:
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        header (String) : Header of file
        output (String) : Output file name
'''
def save_output(x,y,header,output):
    x = x.tolist()
    y = y.tolist()
    with open(output, "w") as outfile:
        dict = {"tool":header,"x":x,"y":y}
        json.dump(dict,outfile)

'''
    Run the tools

    Parameters:
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        m (int) : Half larger of selection to calculate the new value
        threshold (int) : Value of threshold to detect rays
        output (String) : Output file name
'''
def pipeline(x,y,m,threshold,output):
    y2 = remove(y,m,threshold)
    save_output(x,y2,'cosmic',output)

'''
    Get the parameters and call the pipeline

    Parameters:
		args (argument) : Argument of the script
'''
def main(args):
    with open(args.p) as input_file:
        json_array = json.load(input_file)
    
    x,y = creat_raw()
    parameters = json_array['cosmic'][0]['params']
    pipeline(x,y,parameters[0]['value'],parameters[1]['value'],args.o)

if __name__ == "__main__":

    my_parser = argparse.ArgumentParser()
    my_parser.add_argument('-p',action='store', required=True, help='Input JSON params file')
    my_parser.add_argument('-o',action='store', required=True, help='Name of the output file')
    args = my_parser.parse_args()

    main(args)