# Add one job to counter and add path for new job
import os
import json

'''
    Add a job in the config file and create the needed file in .gimmick

    Parameters:
		pathProject (String) : Path of .gimmick
        action (String) : Type of action from user
        name (String) : Name of the file

    Returns:
        job (int) : Number of the actual job 
'''
def addJob(pathProject,action,name):
    extensions = ["wip","wid","json","spc","txt","csv"]
    if name.split('.')[-1] in extensions :
        g = open(f'{pathProject}/config.json','r')
        result = json.load(g)
        result['jobs_counter'] += 1
        job = result['jobs_counter']
        result['arborescence'].append(f'.gimmick/{action}/job_{job}/Input/{name}')
        g.close()
        
        try :
            os.mkdir(f'{pathProject}/{action}')
        except OSError as error:
            pass
        os.mkdir(f'{pathProject}/{action}/job_{job}')
        os.mkdir(f'{pathProject}/{action}/job_{job}/Input')
        os.mkdir(f'{pathProject}/{action}/job_{job}/Output')

        f = open(f'{pathProject}/{action}/job_{job}/Input/{name}','x')
        f.close()

        g = open(f'{pathProject}/config.json','w')
        g.write(json.dumps(result))
        g.close()
        return job
    else :
        return None

'''
    Get the actual job in .gimmick

    Parameters:
		pathProject (String) : Path of .gimmick

    Returns:
        job (int) : Number of the actual job 
'''
def getJob(pathProject):
    g = open(f'{pathProject}/config.json','r')
    result = json.load(g)
    job = result['jobs_counter']
    g.close()
    return job

'''
    Add in the config file the new arborescence

    Parameters:
		pathProject (String) : Path of .gimmick
        pathout (String) : Path of the output file
'''
def addOutput(pathProject,pathout):
    g = open(f'{pathProject}/config.json','r')
    result = json.load(g)
    g.close()
    if pathout not in result['arborescence'] :
        result['arborescence'].append(pathout)
    g = open(f'{pathProject}/config.json','w')
    g.write(json.dumps(result))
    g.close()