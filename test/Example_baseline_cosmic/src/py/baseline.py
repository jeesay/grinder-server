import matplotlib.pyplot as plt
import numpy as np
from pybaselines import Baseline, utils
import json
import argparse
import csv

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

    return(x,y)

'''
    Calculate the base line by snip

    Parameters:
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        par (dict) : Parameters

    Returns:
        y2 (np.array) : Array of the calculate y values
'''
def base_snip(x,y,par):
    base = Baseline(x)
    y2 = base.snip(y,max_half_window=par[0]["value"])[0]
    return y2

'''
    Calculate the base line by rolling_ball

    Parameters:
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        par (dict) : Parameters

    Returns:
        y2 (np.array) : Array of the calculate y values
'''
def base_ball(x,y,par):
    base = Baseline(x)
    y2 = base.rolling_ball(y,half_window=par[0]["value"])[0]
    return y2

'''
    Calculate the base line by polynomial

    Parameters:
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        par (dict) : Parameters

    Returns:
        y2 (np.array) : Array of the calculate y values
'''
def base_pol(x,y,par):
    base = Baseline(x)
    y2 = base.modpoly(y,poly_order=par[0]["value"],weights=par[1]["value"],return_coef=par[2]["value"])[0]
    return y2

'''
    Calculate the base line by snip

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

'''
    Save the data in a csv file

    Parameters:
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        header (String) : Output file name
'''
def save(x,y,header):
    with open('./data/save_files/csv/'+header+'.csv', 'w', newline='') as f:
            # create the csv writer
            writer = csv.writer(f)
            writer.writerow([header])
            writer.writerow(x)
            writer.writerow(y)

'''
    Save the data in a json file

    Parameters:
		data (np.array) : Array of X and Y values
        header (String) : Output file name
'''    
def save_json(data,header):
    with open(header+".json", "w") as outfile:
        json.dump(data,outfile)

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
        processor (dict) : All tools available
        tools (function) : Tool used
		x (np.array) : Array of X values
        y (np.array) : Array of Y values
        args (argument) : Argument of the script
'''
def pipeline_baseline(processors,tools,x,y,args):
    func = processors.get(tools['tool'])
    new_y = func(x,y,tools["params"])
    fin_y = remove_baseline(x,y,new_y)
    #plt.plot(x,new_y,label=tools['tool'])

    save(x,new_y,tools['tool'])
    save_json(tools,tools['tool'])
    save_output(x,new_y,tools['tool'],(args.o[:-5]+'_base.json'))
    save_output(x,fin_y,tools['tool'],args.o)

'''
    Show graph
'''
def show_graph():
    plt.show()

'''
    Get the parameters and call the pipeline

    Parameters:
		args (argument) : Argument of the script
'''
def main(args):

    processors = {
        "snip" : base_snip,
        "ball" : base_ball,
        "modpoly" : base_pol,
    }

    with open(args.p) as input_file:
        json_array = json.load(input_file)
        
    x,y = creat_raw()
    save(x,y,"Raw")
    plt.plot(x,y,label="Raw data")

    for tools in json_array["baselines"]:
        if tools['tool'] == args.t :
            pipeline_baseline(processors,tools,x,y,args)




if __name__ == "__main__":
    # execute only if run as a script
    my_parser = argparse.ArgumentParser()
    my_parser.add_argument('-i',action='store', required=False, help='Input of the spectra')
    my_parser.add_argument('-p',action='store', required=True, help='Input JSON params file')
    my_parser.add_argument('-t',action='store', required=True, help='Tool_name')
    my_parser.add_argument('-o',action='store', required=True, help='Name of the output file')
    args = my_parser.parse_args()


    main(args)