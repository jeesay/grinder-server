# All the directory names of the different types of jobs defined inside the pipeline
PROC_IMPORT_MOV_LABELNEW = "relion.import.movie"       # Import any file as a Node of a given type
PROC_IMPORT_MIC_LABELNEW = "relion.import.mic"       # Import any file as a Node of a given type
PROC_IMPORT_BOX_LABELNEW = "relion.import.box"       # Import any file as a Node of a given type
PROC_IMPORT_PTCLS_LABELNEW = "relion.import.particles"       # Import any file as a Node of a given type
PROC_IMPORT_MAP_LABELNEW = "relion.import.map"       # Import any file as a Node of a given type
PROC_IMPORT_MASK_LABELNEW = "relion.import.mask"       # Import any file as a Node of a given type
PROC_IMPORT_HALFMAP_LABELNEW = "relion.import.halfmap"       # Import any file as a Node of a given type
PROC_MOTIONCORR_RELION_LABELNEW = "relion.motioncorr.own"   # Import any file as a Node of a given type
PROC_MOTIONCORR_2_LABELNEW = "relion.motioncorr"   # Import any file as a Node of a given type
PROC_CTFFIND_LABELNEW = "relion.ctffind"         # Estimate CTF parameters from micrographs for either entire micrographs and/or particles
PROC_MANUALPICK_LABELNEW = "relion.manualpick"   # Manually pick particle coordinates from micrographs
PROC_AUTOPICK_LABELNEW = "relion.autopick"     # Automatically pick particle coordinates from micrographs, their CTF and 2D references
PROC_EXTRACT_LABELNEW = "relion.extract"      # Window particles, normalize, downsize etc from micrographs (also combine CTF into metadata file)
PROC_CLASSSELECT_LABELNEW = "relion.select"        # Read in model.star file, and let user interactively select classes through the display (later: auto-selection as well)
PROC_2DCLASS_VDAM_LABELNEW = "relion.class2d.vdam"      # 2D classification (from input particles)
PROC_2DCLASS_EM_LABELNEW = "relion.class2d.em"      # 2D classification (from input particles)
PROC_3DCLASS_LABELNEW = "relion.class3d"      # 3D classification (from input 2D/3D particles, an input 3D-reference, and possibly a 3D mask)
PROC_3DAUTO_LABELNEW = "relion.refine3d"     # 3D auto-refine (from input particles, an input 3Dreference, and possibly a 3D mask)
PROC_MASKCREATE_LABELNEW = "relion.maskcreate"   # Process to create masks from input maps
PROC_JOINSTAR_LABELNEW = "relion.joinstar"     # Process to create masks from input maps
PROC_SUBTRACT_LABELNEW = "relion.subtract"     # Process to subtract projections of parts of the reference from experimental images
PROC_POST_LABELNEW = "relion.postprocess"  # Post-processing (from unfiltered half-maps and a possibly a 3D mask)
PROC_RESMAP_LABELNEW = "relion.localres"  # Local resolution estimation (from unfiltered half-maps and a 3D mask)
PROC_INIMODEL_LABELNEW = "relion.initialmodel" # De-novo generation of 3D initial model (using SGD)
PROC_MULTIBODY_LABELNEW = "relion.multibody"    # Multi-body refinement
PROC_MOTIONREFINE_LABELNEW = "relion.polish"       # Jasenko's motion fitting program for Bayesian polishing (to replace MovieRefine?)
PROC_CTFREFINE_LABELNEW = "relion.ctfrefine"    # Jasenko's program for defocus and beamtilt optimisation
PROC_DYNAMIGHT_LABELNEW = "dynamight"           # Johannes' DynaMight for modelling continuous heterogeneity
PROC_MODELANGELO_LABELNEW = "modelangelo"         # Kiarash's ModelAngelo for automated model building
# Tomography
PROC_TOMO_IMPORT_LABELNEW = "relion.importtomo"              # Import for tomography GUI
PROC_TOMO_EXCLUDE_TILT_IMAGES_LABELNEW = "relion.excludetilts"  # Exclude bad tilt-images
PROC_TOMO_SUBTOMO_LABELNEW = "relion.pseudosubtomo"  # Creation of pseudo-subtomograms from tilt series images
PROC_TOMO_CTFREFINE_LABELNEW  = "relion.ctfrefinetomo"  # CTF refinement (defocus & aberrations) for tomography
PROC_TOMO_ALIGN_LABELNEW  = "relion.framealigntomo"  # Frame alignment and particle polishing for subtomography
PROC_TOMO_RECONSTRUCT_LABELNEW = "relion.reconstructparticletomo" # Calculation of particle average from the individual tilt series images
PROC_TOMO_DENOISE_LABELNEW = "relion.denoisetomo"  # Denoise tomograms
PROC_TOMO_PICK_LABELNEW = "relion.picktomo"     # Pick tomograms
PROC_TOMO_ALIGN_TILTSERIES_LABELNEW = "relion.aligntiltseries" # Tilt series alignment for tomogram reconstruction
PROC_TOMO_RECONSTRUCT_TOMOGRAM_LABELNEW = "relion.reconstructtomograms" # Reconstruction of tomograms for particle picking = PROC_IMPORT = 0 # Import any file as a Node of a given type
# Misc.
PROC_EXTERNAL_LABELNEW = "relion.external"     # For running non-relion programs

def _curatelog(logtxt,errtxt):
    curated = ''
    mouse = '~~(,_,">'
    for line in logtxt:
        if mouse in line:
            if line.count('.') == 60:
                curated += line
            # <progress id="file" max="60" value="60">100%</progress>
        else:
            curated += f'INFO: {line}' 
    return curated

