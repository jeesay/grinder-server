import os

# Get path
for root,dirs,files in os.walk('.'):
    files = [ f for f in files if f.endswith( ('.star','.mrc','.mrcs','.tif') ) ]
    for name in files:
      print(root, name)
    for name in dirs:
      print('dir',os.path.join(root, name))
