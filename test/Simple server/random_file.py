from numpy import random

'''
    Returns a random number between 0 and 999
'''
def rand1():
    return (random.randint(999))

'''
    Returns a random letter
'''
def rand2():
    list = 'AZERTYUIOPQSDFGHJKLMWXCVBN'
    r = random.randint(26)
    return (list[r])

'''
    Returns a random number between 0 and 999 or a letter depending of the initial choice

    Parameters:
		dic (dict): Data containing the type of random chosen

    Returns:
        res (str) : A random number or letter
'''
def calc(dic):
    if dic['rand'] == 0 :
        res = rand1()
    else :
        res = rand2()
    return (res)