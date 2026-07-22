import os
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
import polars as pl
import typer
from typing import Annotated

import star_gate as sg


def convert_single_file(filetup):
    fn, jobdir = filetup
    try:
        cargo = sg.StarGate()
        cargo.read(fn)

        df_general = cargo.db['general']
        # 1. Prepare Global table (add 'global_' prefix to avoid collisions)
        df_global = pl.from_pandas(cargo.db['global_shift']['table'])
        # Denormalize metadata into the dataframe
        for key, value in df_general.items():
            df_global = df_global.with_columns(pl.lit(value).alias(key))
        df_global_prepped = df_global.rename(lambda col: f"global_{col}" if col != "rlnMicrographFrameNumber" else col)

        # Constants
        N_FRAMES = df_global.shape[0]

        # Table 2: Local Shifts (Ordered by Tile then Frame)
        # [Tile 1/F1, Tile 1/F2 ... Tile 1/F40, Tile 2/F1 ...]
        if 'local_shift' in cargo.db:
            df_local = pl.from_pandas(cargo.db['local_shift']['table'])
            print(fn,df_local.shape[0] // N_FRAMES)

            df_local_prepped = df_local.with_columns(
                # Modulo gives 0,1,2...39, 0,1,2...39
                frame_idx = (pl.arange(0, pl.len()) % N_FRAMES).cast(pl.UInt32),
                
                # Floor division gives 0,0,0 (40 times), 1,1,1 (40 times)
                tile_idx = (pl.arange(0, pl.len()) // N_FRAMES).cast(pl.UInt32)
            )

            # 3. The Flat Join
            # df_flat = df_local_prepped.join(df_global_prepped, on="rlnMicrographFrameNumber", how="left")

            # Join: Every tile's Frame 1 gets Global Frame 1's data
            df_flat = df_local_prepped.join(df_global_prepped, on="rlnMicrographFrameNumber", how="left")
            
            # Calculate magnitude for the heatmap color
            df_heatmap = df_flat.with_columns(
                magnitude = (pl.col("rlnMicrographShiftX")**2 + pl.col("rlnMicrographShiftY")**2).sqrt()
            )
            print(df_heatmap)
            # If you want a 'General' heatmap of the movie, average by tile
            TILE_WIDTH = 6000 // 5
            TILE_HEIGHT = 5500 // 5 
            df_avg_tile = df_heatmap.group_by("tile_idx").agg(
                pl.col("magnitude").mean(),
                pl.col("rlnCoordinateX").first() // TILE_WIDTH, # The physical X coordinate of the tile
                pl.col("rlnCoordinateY").first() // TILE_HEIGHT# The physical Y coordinate of the tile
            )
            print(df_avg_tile)
        else:
            print(fn,0)
            df_flat = df_global_prepped
            
        basename = Path(fn).stem
        df_flat.write_parquet(os.path.join(jobdir,f"{basename}_shifts.parquet"), compression="zstd")
    
        return df_avg_tile
    except Exception as e:
        print(f"Error processing {fn}: {e}")
        return False
            

def convert_file_batch(file_list,batchsize,jobdir):
    # 2. Create a mapping table (Filename -> Integer Index)
    mapping_df = pl.DataFrame({
        "path": file_list,
        "file_idx": range(len(file_list))
    })

    # Read star files
    batchsize = 100
    df_batch = pl.DataFrame()
    for batch in range(0,len(file_list),batchsize):
        for fn in file_list[batch:batch+batchsize]:
            cargo = sg.StarGate()
            cargo.read(os.path.join(path,filename))

            df_general = cargo.db['general']
            # 1. Prepare Global table (add 'global_' prefix to avoid collisions)
            df_global = pl.from_pandas(cargo.db['global_shift']['table'])
            # Denormalize metadata into the dataframe
            for key, value in df_general.items():
                df_global = df_global.with_columns(pl.lit(value).alias(key))
            df_global_prepped = df_global.rename(lambda col: f"global_{col}" if col != "rlnMicrographFrameNumber" else col)

            # Constants
            N_FRAMES = 40

            # Table 2: Local Shifts (Ordered by Tile then Frame)
            # [Tile 1/F1, Tile 1/F2 ... Tile 1/F40, Tile 2/F1 ...]
            df_local = pl.from_pandas(cargo.db['local_shift']['table'])

            df_local_prepped = df_local.with_columns(
                # Modulo gives 0,1,2...39, 0,1,2...39
                frame_idx = (pl.arange(0, pl.len()) % N_FRAMES).cast(pl.UInt32),
                
                # Floor division gives 0,0,0 (40 times), 1,1,1 (40 times)
                tile_idx = (pl.arange(0, pl.len()) // N_FRAMES).cast(pl.UInt32)
            )

            # 3. The Flat Join
            # df_flat = df_local_prepped.join(df_global_prepped, on="rlnMicrographFrameNumber", how="left")

            # Join: Every tile's Frame 1 gets Global Frame 1's data
            df_flat = df_local_prepped.join(df_global_prepped, on="rlnMicrographFrameNumber", how="left")
            df_batch = pl.concat([df_batch,df_flat])
            
        basename = Path(fn).stem
        df_batch.write_parquet(os.path.join(jobdir,f"batch{batch:06d}_shifts.parquet"), compression="zstd")
    
    
###################### MAIN ######################
app = typer.Typer()

@app.command()
def motion(
    path: Annotated[ str, typer.Option("--i", help="Metadata path in MotionCorr/job<xyz>")],
    output_dir: Annotated[ str, typer.Option("--o", help="Output GRINDER directory")]
):

    # 0. From `corrected_micrographs.star`, extract Movies path and metadata files
    # TODO
    fn = os.path.join(path,'corrected_micrographs.star')
    cargo = sg.StarGate()
    cargo.read(fn)

    # 1. List all star files
    metatable = cargo.db['micrographs']['table']
    star_files = metatable.rlnMicrographMetadata # list(Path(path).glob("*.star"))
    file_list = zip(star_files,[output_dir] * len(star_files))

    # Use all available CPU cores
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(convert_single_file, file_list))
    
    print(f"Successfully converted {sum(results)} of {len(star_files)} files.")
    


def test(filename):
    import matplotlib.pyplot as plt
    import polars as pl
    import numpy as np

    frame_data = convert_single_file([filename,'./'])
    print(frame_data.sort('tile_idx'))
    heatmap_matrix = frame_data.sort('tile_idx')['magnitude'].to_numpy().reshape((5,5))
#    # 2. Pivot the data into a Grid (Rows = Y, Cols = X)
#    # We assume you have columns 'tile_x_idx' and 'tile_y_idx'
#    grid_df = frame_data.pivot(
#        values="magnitude",
#        index="rlnCoordinateX",
#        on="rlnCoordinateX"
#    )
#    print(grid_df)
#    # 3. Convert to a NumPy Matrix (dropping the index column)
#    heatmap_matrix = grid_df.select(pl.all().exclude("rlnCoordinateY")).to_numpy()
    
    plt.figure(figsize=(8, 6))

    # 'bilinear' or 'bicubic' creates the smooth "weather map" effect
    im = plt.imshow(
        heatmap_matrix, 
        cmap='inferno', 
        # interpolation='bilinear', 
        # origin='lower'
        vmin = 0,
        vmax = 5
    )

    plt.colorbar(im, label='Shift Magnitude (Pixels)')
    plt.title(f"Local Motion Heatmap - {os.path.basename(filename)}")
    plt.xlabel("Tile X Index")
    plt.ylabel("Tile Y Index")

    plt.show()

if __name__ == "__main__":
    app()
#    test('MotionCorr/job002/Movies/mx2441_grid5_00003.star')