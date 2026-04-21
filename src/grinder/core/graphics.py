import skimage as ski
import mrcfile as mrc


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

def render3d(data)!
    pass

def table(data):
    pass

def trajectories(data):
    pass

def violin(data):
    pass

def graphics(data):
    parts = data.split(":", 2)
    if len(parts) != 3 :
        await websocket.send_json({"error": "Expected format : get_data:<job_id>:<source_file>"})
        continue

    _, job_id, source_file = parts

    try :
        stem = os.path.splitext(source_file)[0] # without extension
        grinder_dir = os.path.join(RELION_DIR, ".grinder", job_id.replace("/", os.sep))
        parquet_path = os.path.join(grinder_dir, f"{stem}.parquet")
        star_path = os.path.join(RELION_DIR, job_id.replace("/", os.sep), source_file)

        if not os.path.exists(parquet_path):
            if not os.path.exists(star_path):
                await websocket.send_json({"error" : f"Source file not found : {star_path}"})
                continue

            print(f"[/ws/dataviz] Conversion {source_file} -> parquet...")
            os.makedirs(grinder_dir, exist_ok=True)

            cargo = sg.StarGate()
            cargo.read(star_path)

            df = None
            for k, block in cargo.blocks.items():
                if "table" in block:
                    df = pl.from_pandas(pd.DataFrame(block["table"]["rows"], columns=block["table"]["header"]))
                    break
            
            if df is None:
                await websocket.send_json({"error" : "No table found in .star file"})
                continue

            df.write_parquet(parquet_path)
            print(f"[/ws/dataviz] Parquet saved : {parquet_path}")

        df = pl.read_parquet(parquet_path)
        table = df.to_arrow()

        sink = io.BytesIO()
        with pa.ipc.new_stream(sink, table.schema) as writer :
            writer.write_table(table)
        payload = sink.getvalue()

        print(f"[/ws/dataviz] Sending {len(payload)} octets for {job_id}/{source_file}")
        
        await websocket.send_bytes(payload)
    
    except Exception as e :
        import traceback
        traceback.print_exc()
        await websocket.send_json({"error" : str(e)})