import logging
import os
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
import typer
from typing import Annotated

import grinder.core.relion as rh

def import_movies(data):
    # optics_group_name,optics_group_mtf,angpix,kV,Cs,Q0,beamtilt_x,beamtilt_y,fn_in,odir
    obj = type('new_dict', (object,), data)
    rln_cmd = '--do_movies ' 
    rln_cmd += f'--optics_group_name {obj.optics_group_name} --optics_group_mtf {obj.optics_group_mtf} '
    rln_cmd += f'--angpix {obj.angpix} --kV {obj.kV} --Cs 2.{obj.Cs} --Q0 {obj.Q0} --beamtilt_x {obj.beamtilt_x} --beamtilt_y {obj.beamtilt_y} '
    rln_cmd += f'--i {obj.fn_in} --odir {obj.odir} '
    return rln_cmd + '--ofile movies.star'

def import_micrographs(optics_group_name,optics_group_mtf,angpix,kV,Cs,Q0,beamtilt_x,beamtilt_y,fn_in,odir):
    rln_cmd = '--do_micrographs ' 
    rln_cmd += f'--optics_group_name {optics_group_name} --optics_group_mtf {optics_group_mtf} '
    rln_cmd += f'--angpix {angpix} --kV {kV} --Cs 2.{Cs} --Q0 {Q0} --beamtilt_x {beamtilt_x} --beamtilt_y {beamtilt_y} '
    rln_cmd += f'--i {fn_in} --odir {odir} '
    return rln_cmd + '--ofile micrographs.star'

def import_coords():
    fn_out = "coords_suffix" + "{fn_in_other}"
    pass

def import_ptcls_star(fn_out):
    pass

def import_refs():
    """
    Import 2D,3D references (*.star, *.mrcs)
    """
    pass

def import_map():
    pass

def import_mask():
    pass

def import_halfmap():
    pass

def import_particles():
    pass

def build_command(metadata):
    #                                --i : Input (wildcard) filename
    #                             --odir : Output directory (e.g. "Import/job001/"
    #                            --ofile : Output file name (e.g. "movies.star"
    #                --do_movies (false) : Import movies
    #           --do_micrographs (false) : Import micrographs
    #           --do_coordinates (false) : Import coordinates
    #              --do_halfmaps (false) : Import unfiltered half maps
    #             --do_particles (false) : Import particle STAR files
    #   --particles_optics_group_name () : Rename optics group for all imported particles (e.g. "opticsGroupLMBjan2019"
    #                 --do_other (false) : Import anything else
    # ====== Specific options for movies or micrographs ===== 
    # --optics_group_name (opticsGroup1) : Name for this optics group
    #              --optics_group_mtf () : Name for this optics group's MTF
    #                     --angpix (1.0) : Pixel size (Angstrom)
    #                         --kV (300) : Voltage (kV)
    #                         --Cs (2.7) : Spherical aberration (mm)
    #                         --Q0 (0.1) : Amplitude contrast
    #                 --beamtilt_x (0.0) : Beam tilt (X; mrad)
    #                 --beamtilt_y (0.0) : Beam tilt (Y; mrad)
    #                 --continue (false) : Continue and old run, add more files to the same import directory
    #                          --version : Print RELION version and exit

    const funcs = {
        "MicrographMovieGroupMetadata.star.relion" : import_movies,
        "MicrographGroupMetadata.star.relion"      : {"config": "--do_micrographs"},
        "MicrographCoordsGroup.star.relion"        : {"config": "--do_coordinates"},
        "ParticleGroupMetadata.star.relion"        : {"config": "--do_particles"},
        "Image2DGroupMetadata.star.relion"         : {"config": "--do_other"},
        "DensityMap.mrc"                           : {"config": "--do_other"},
        "Mask3D.mrc"                               : {"config": "--do_other"},
        "DensityMap.mrc.halfmap"                   : {"config": "--do_halfmaps"}
    }

    in_kwargs = {
        'path':path,
        'output_dir': output_dir,
        'output_file': output_file,
        'optics_group_mtf': optics_group_mtf,
        'optics_group_name': optics_group_name,
        'angpix': angpix,
        'kV': kV,
        'Cs': Cs,
        'Q0': Q0,
        'beamtilt_x': beamtilt_x,
        'beamtilt_y': beamtilt_y
    }

    rln_cmd = 'relion_import' + funcs[nodetype](**in_kwargs)
    rln_cmd += ' --pipeline_control Import/job001/'

def run_import(metadata):
    # Run RELION command
    process = subprocess.Popen(
        command, 
        shell=True, 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE, 
        text=True # Pour recevoir des strings et non des bytes
    )

    # Read stdout live
    for line in process.stdout:
        logger.info(f"STDOUT: {line.strip()}")

    # Read stderr
    for line in process.stderr:
        logger.error(f"STDERR: {line.strip()}")

    # Wait for the end of process
    return_code = process.wait()
    logger.info(f"Done! : {return_code}")



# Exemple d'utilisation
# run_command_to_logger("ping -c 5 google.com")

###################### MAIN ######################
helper = typer.Typer()

@helper.command()
def importdata(
    path: Annotated[str, typer.Option("--i", help="Metadata path in Import/job<xyz>")],
    output_dir:  Annotated[str, typer.Option("--odir", help="Output directory (e.g. 'Import/job001/')")],
    output_file: Annotated[str, typer.Option("--ofile", help="Output file name (e.g. 'movies.star')")],
    nodetype: Annotated[str, typer.Option("--nodetype", help="RELION  nodetype (e.g. movies, micrographs, boxes, etc.")],
    optics_group_mtf: Annotated[str,typer.Option(help="Name for this optics group's MTF (Only for movies/mics)")],
    pipeline_control: Annotated[str],
    version:Annotated[str,typer.Option(help="Print RELION and GRINDER versions and exit")],
    optics_group_name: Annotated[str, typer.Option(help="Name for this optics group (Only for movies/mics)")]="opticsGroup1",
    angpix:Annotated[float,typer.Option(help="Pixel size (Angstrom) (Only for movies/mics)")]=1.0,
    kV:Annotated[float,typer.Option(help="Pixel size (Angstrom) (Only for movies/mics)")]=300,
    Cs:Annotated[float,typer.Option(help="Pixel size (Angstrom) (Only for movies/mics)")]=2.7,
    Q0:Annotated[float,typer.Option(help="Pixel size (Angstrom) (Only for movies/mics)")]=0.1,
    beamtilt_x:Annotated[float,typer.Option(help="Pixel size (Angstrom) (Only for movies/mics)")]=0.0,
    beamtilt_y:Annotated[float,typer.Option(help="Pixel size (Angstrom) (Only for movies/mics)")]=0.0,
    cont:Annotated[bool,typer.Option("--continue",help="Continue an old run, add more files to the same import directory")]=False):

    pass