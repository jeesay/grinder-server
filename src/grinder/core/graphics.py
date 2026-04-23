# import skimage as ski
# import mrcfile as mrc
import os 
import asyncio
import star_gate as sg


def image(data):
    pass

def interactive(data):
    pass

def montage(data):
    pass

def heatmap(data):
    pass
    
def histogram(data):
    if is_dirty:
        # Calc histogram
        pass
    else:
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

async def get_dataviz_package(path, dataviz_rows):
    ## Fonction chef d'orchestre --> dispatche dans les autres fonctions 
    final_payload = {
                "type" : "dataviz_package",
                "widget" : {}
            }

    # We keep a cache for star file loaded toa void to read again the same file 6 times if many graphs use it
    star_cache = {}

    for row in dataviz_rows:
        id_viz, label, widget, pos, size, data_query, _ = row
        
        # Ignorer le conteneur 'grid' lui-même pour l'envoi de données
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
            block = gate.datablock(table_name)
            if block :
                table = block.table()
                if table :
                    column_data = {}
                    num_rows = len(table.rows())

                    for col_name in columns_needed :
                        if col_name == "rlnIndex" :
                            column_data["rlnIndex"] = list(range(1, num_rows + 1))
                        else:
                            # StarGate's column(headname) Methode
                            column_data[col_name] = table.column(col_name)

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
                print(f"Block {table_name} introuvable dans {file_path}")

        except Exception as e :
            print(f"Error in {id_viz}: {e}")

    return final_payload