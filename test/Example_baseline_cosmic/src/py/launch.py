import os
import json

input_file = "baseline.py"
tool_name = "snip"
param = 'params.json'
output = './test_snip.json'

os.system(f"python3 {input_file} -p {param} -o {output} -t {tool_name}")

f = open(output)
dict = json.load(f)
f.close()
print(dict)