import logging
import sys
import time
import typer
from typing import Annotated
import os

###################### MAIN ######################
app = typer.Typer()

@app.command()
def test(
    txt: Annotated[ str, typer.Option("--message", help="text")],
    N: Annotated[ int, typer.Option("--repeat", help="repeat N times")],
    output_dir: Annotated[ str, typer.Option("--odir", help="Output GRINDER directory")],
    output_file: Annotated[ str, typer.Option("--ofile", help="Output GRINDER directory")],
    reverse: Annotated[bool, typer.Option("--rev", help="Output GRINDER directory")] = False,
    txt_mode: Annotated[str, typer.Option("--case", help="Output GRINDER directory")] = "unchanged",
):
    
    # Logging Basic Configuration
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s [%(levelname)s] %(message)s',
        handlers=[logging.StreamHandler(sys.stdout)]
    )
    logger = logging.getLogger("ExternalProcess")
  
    msg = ''
    if reverse:
        msg = txt[::-1]

    if N < 0:
        logger.error('`--repeat` must be a positive int number')
        failed_file = "RELION_JOB_EXIT_FAILED"
        with  open(os.path.join(output_dir,failed_file),'w') as f :
            pass

    match txt_mode:
        case "lower":
            msg = txt.lower
        case "upper":
            msg = txt.upper
        case "cap":
            msg = txt.capitalize
        case _:
            msg = txt

    
    for i in range(N):
        time.sleep(10)
        logger.info(f'Create file ./{output_dir}/file{i:02d}.csv')
    
    logger.info("Done!")

  # Run bash command
  # cli = "for i in {1..10}; do echo 'Data line '$i; sleep 0.2; done"
  # asyncio.run(run_command_asyncio(cli))

  
