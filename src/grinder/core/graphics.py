# import skimage as ski
# import mrcfile as mrc
import os 
import star_gate as sg

from pathlib import Path
import mrcfile
from PIL import Image
import numpy as np


def mrc_to_webp(mrc_path: Path, webp_path: Path, size: int=512):
    """
    Convert .mrc to WebP in cache, resize to size px
    """
    with mrcfile.open(mrc_path, mode='r', permissive=True) as mrc :
        data = mrc.data
        # Movie (stack) --> taking frames's mean
        if data.ndim == 3 :
            frame = data.mean(axis=0)
        else :
            frame = data[0] if data.ndim > 2 else data
        
    # Normalization 0-255
    f_min, f_max = frame.min(), frame.max()
    if f_max > f_min :
        normalized = ((frame - f_min) / (f_max - f_min) * 255).astype(np.uint8)
    else :
        normalized = np.zeros_like(frame, dtype=np.uint8)

    img = Image.fromarray(normalized).convert("L")
    img.thumbnail((size,size), Image.LANCZOS)
    img.save(webp_path, "WEBP", quality = 80)
    

def interactive(data):
    pass

def montage(data):
    pass

def heatmap(data):
    pass
    
def histogram(data):
    pass
    
def plot2d(data):
    pass    

def render3d(data):
    pass

def table(data):
    pass

def trajectories(data):
    pass

def violin(data):
    pass

async def get_dataviz_package(path, rows, type):
    final_payload = {
                "type" : type,
                "widget" : {}
            }

    # We keep a cache for star file loaded toa void to read again the same file 6 times if many graphs use it
    star_cache = {}

    for row in rows:
        id_viz, label, widget, pos, size, data_query, _ = row
        
        # Ignore the 'grid' container itself for sending data
        if widget == 'grid' or data_query == '?': continue

        try :

            # 1. Parsing of data_query
            file_part, query_part = data_query.split('?')
            table_name, cols_str = query_part.replace(']', '').split('[')
            columns_needed = cols_str.split(',')

            print(file_part, '\n', query_part, '\n', table_name, '\n', cols_str, '\n', columns_needed)

            # 2. Loading STAR file (with cache)
            file_path = os.path.join(path, file_part)
            if file_path not in star_cache :
                cargo = sg.StarGate()
                cargo.read(file_path)
                star_cache[file_path] = cargo
            gate = star_cache[file_path]

            # 3. Extract columns with parser
            # We take Table object of corresponding datablock
            block = gate.db[table_name]
            if block is not None :
                df = block['table']
                if df is not None :
                    column_data = {}
                    num_rows = len(df)

                    for col_name in columns_needed :
                        if col_name == "rlnIndex" :
                            column_data["rlnIndex"] = list(range(1, num_rows + 1))
                        elif col_name in df.columns :
                            # StarGate's column(headname) Methode
                            column_data[col_name] = df[col_name].tolist()
                        else:
                            print(f"Warning: {col_name} column not in STAR file")

                    # 4. Adding package
                    final_payload["widget"][id_viz] = {
                        "id" : id_viz,
                        "label" : label,
                        "widget" : widget,
                        "pos" : pos,
                        "size" : size,
                        "data" : column_data
                    }
            else:
                print(f"Block {table_name} not found in {file_path}")

        except Exception as e :
            print(f"Error in {id_viz}: {e}")

    return final_payload