import argparse
import time
import json
import random

def deb(args):
    if args.crash is True or args.crash == 'True':
        crash = int(args.i)*10/100
    for i in range(int(args.i)):
        if args.crash is True or args.crash == 'True':
            a = random.randint(0,int(args.i)-1)
            if a <= crash :
                try :
                    b = "" + a
                except :
                    print("ERROR", flush=True)
                    return
        print(i, flush=True)
        time.sleep(int(args.ms)/1000)

if __name__ == "__main__":
    # execute only if run as a script

    my_parser = argparse.ArgumentParser()
    my_parser.add_argument('-i',action='store', required=True, help='Output JSON data file')
    my_parser.add_argument('-ms',action='store', required=True, help='Used method')
    my_parser.add_argument('--sleep',action='store', help='Input JSON data file')
    my_parser.add_argument('--crash', action='store', help='help')
    args = my_parser.parse_args()
    #print(args)


    deb(args)
