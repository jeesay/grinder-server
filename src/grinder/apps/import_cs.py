import logging
import sys
import time
import typer
from typing import Annotated
import os

import subprocess

###################### MAIN ######################
app = typer.Typer()

@app.command()
def convert_to_star(
    file1: Annotated[ str, typer.Option("--particles", help="")],
    file2: Annotated[ int, typer.Option("--passthrough", help="")],
    outfile: Annotated[ str, typer.Option("--ofile", help="")]):
    
    # Logging Basic Configuration
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s [%(levelname)s] %(message)s',
        handlers=[logging.StreamHandler(sys.stdout)]
    )
    logger = logging.getLogger("ExternalProcess")

    print(file1,file2,outfile)

    # process = subprocess.Popen(
    #     ["csparc2star.py", file1, file2, outfile],
    #     stdout=subprocess.DEVNULL,
    #     stderr=subprocess.DEVNULL
    # )
    
    logger.info("Done!")

  # Run bash command
  # cli = "for i in {1..10}; do echo 'Data line '$i; sleep 0.2; done"
  # asyncio.run(run_command_asyncio(cli))