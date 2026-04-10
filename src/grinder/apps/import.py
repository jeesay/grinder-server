import os
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
import polars as pl
import typer
from typing import Annotated

import grinder.core.relion as rh

def import_movies():
    fn_out = "movies.star"
    pass

def import_micrographs():
    fn_out =  "micrographs.star"
    pass

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

###################### MAIN ######################
helper = typer.Typer()

@helper.command()
def import(
    path: Annotated[str, typer.Option("--i", help="Metadata path in Import/job<xyz>")],
    output_dir:  Annotated[str, typer.Option("--odir", help="Output RELION|GRINDER directory")],
    output_file: Annotated[str, typer.Option("--ofile", help="Output star|parquet file")],
    optics_group_name: Annotated[str, typer.Option(help="Optics Group Name")],
    optics_group_mtf,
    angpix,
    kV,
    Cs,
    Q0,
    beamtilt_x,
    beamtilt_y,
    nodetype: Annotated[str],
    pipeline_control: Annotated[str],
    # do_movies: Annotated[bool] = False,
    # do_micrographs: Annotated[bool] = False,
    # do_coordinates: Annotated[bool] = False,
    # do_halfmaps: Annotated[bool] = False,
    # do_particles: Annotated[bool] = False,
):

    # Movies
    fn_out = {
        rh.LABEL_IMPORT_MOVIES : "movies.star",
        rh.LABEL_IMPORT_MICS   : "micrographs.star",
        rh.LABEL_IMPORT_COORDS : "coords_suffix" + fn_in_other
    }
    # nod.flag("is_multiframe", True )
    cli.add_outnode(nod)
    new_arg = rc.Flag("--do_movies","","is_multiframe", True )
    cli.append_arg(new_arg)
    # Micrographs
    fn_out = 
    nod = rc.Node(outputname + fn_out, )
    # nod.flag("is_multiframe", False )
    cli.add_outnode(nod)
    new_arg = rc.Flag("--do_micrographs","","is_multiframe",  False)
    cli.append_arg(new_arg)
    # Optics group
    new_arg = rc.Param("--optics_group_name", "optics_group_name", assertion="required")
    cli.append_arg(new_arg)
    new_arg = rc.Flag("--optics_group_mtf","","fn_mtf","not_empty")
    cli.append_arg(new_arg) 
    new_arg = rc.Param("--angpix","angpix")
    cli.append_arg(new_arg) 
    new_arg = rc.Param("--kV","kV")
    cli.append_arg(new_arg) 
    new_arg = rc.Param("--Cs", "Cs")
    cli.append_arg(new_arg) 
    new_arg = rc.Param("--Q0", "Q0")
    cli.append_arg(new_arg) 
    new_arg = rc.Param("--beamtilt_x","beamtilt_x")
    cli.append_arg(new_arg) 
    new_arg = rc.Param("--beamtilt_y","beamtilt_y")
    cli.append_arg(new_arg) 

    # node_type == "Particle coordinates (*.box, *_pick.star)")
    fn_out = fn_out = "coords_suffix" + "{fn_in_other}"
    nod = rc.Node(outputname + fn_out, rh.LABEL_IMPORT_COORDS)
    # nod.flag("node_type","LABEL_IMPORT_COORDS")
    cli.add_outnode(nod)
    new_arg = rc.Param("--do_coordinates","")
    cli.append_arg(new_arg)
    # Other
    fn_out = "{fn_in_other}"
	# node_type == "Particles STAR file (.star)")
    mynodetype = rh.LABEL_IMPORT_PARTS
    nod = rc.Node(outputname + fn_out, mynodetype)
    # nod.flag("node_type","LABEL_IMPORT_PARTS")
    cli.add_outnode(nod)
    # node_type == "Multiple (2D or 3D) references (.star or .mrcs)")
    mynodetype = rh.LABEL_IMPORT_2DIMG
    nod = rc.Node(outputname + fn_out, mynodetype)
    # nod.flag("node_type","LABEL_IMPORT_2DIMG")
    cli.add_outnode(nod)
     # (node_type == "3D reference (.mrc)")
    mynodetype = rh.LABEL_IMPORT_MAP
    nod = rc.Node(outputname + fn_out, mynodetype)
    # nod.flag("node_type","LABEL_IMPORT_MAP")
    cli.add_outnode(nod)
     # node_type == "3D mask (.mrc)")
    mynodetype = rh.LABEL_IMPORT_MASK
    nod = rc.Node(outputname + fn_out, mynodetype)
    # nod.flag("node_type","LABEL_IMPORT_MASK")
    cli.add_outnode(nod)
    # node_type == "Micrographs STAR file (.star)")
    mynodetype = rh.LABEL_IMPORT_MICS
    nod = rc.Node(outputname + fn_out, mynodetype)
    # nod.flag("node_type","LABEL_IMPORT_MICS")
    cli.add_outnode(nod)
    # node_type == "Unfiltered half-map (unfil.mrc)")
    mynodetype = rh.LABEL_IMPORT_HALFMAP
    nod = rc.Node(outputname + fn_out, mynodetype)
    # nod.flag("node_type","LABEL_IMPORT_HALFMAP")
    cli.add_outnode(nod)
    new_arg = rc.Flag("--do_halfmaps","","node_type","LABEL_IMPORT_HALFMAP")
    cli.append_arg(new_arg)

    # Particles LABEL_PARTS_CPIPE
    mynodetype = rh.LABEL_PARTS_CPIPE
    nod = rc.Node(outputname + fn_out, mynodetype)
    # nod.flag("node_type","LABEL_PARTS_CPIPE")
    cli.add_outnode(nod)
    new_arg = rc.Flag("--do_particles","","node_type","LABEL_PARTS_CPIPE")
    cli.append_arg(new_arg)
    new_arg = rc.Flag("--optics_group_name ","optics_group_particles","node_type","LABEL_PARTS_CPIPE")
    cli.append_arg(new_arg)

    new_arg = rc.Param("--i ","fn_in")
    cli.append_arg(new_arg)
    new_arg = rc.Param("--odir", "outputname")
    cli.append_arg(new_arg)
    new_arg = rc.Param("--ofile ","fn_out")
    cli.append_arg(new_arg)
    new_arg = rc.Param("--pipeline-control", outputname)
    cli.append_arg(new_arg)
    return script