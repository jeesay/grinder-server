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
    time_in_secs: Annotated[ int, typer.Option("--time", help="Sleeping time in seconds")],
    output_dir: Annotated[ str, typer.Option("--odir", help="Output GRINDER directory")],
    output_file: Annotated[ str, typer.Option("--ofile", help="Output GRINDER directory")],
    reverse: Annotated[bool, typer.Option("--rev", help="Output GRINDER directory")] = False,
    error: Annotated[bool, typer.Option("--err", help="Trigger an error. Only for debug")] = False,
    txt_mode: Annotated[str, typer.Option("--case", help="Output GRINDER directory")] = "unchanged",
):
    
    # Create the logger
    logger = logging.getLogger("ExternalProcess")
    logger.setLevel(logging.INFO)
    
    formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')

    # 1. Handler for standard output (INFO logs)
    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(logging.INFO)
    # Filter out WARNING and above from stdout
    stdout_handler.addFilter(lambda record: record.levelno < logging.WARNING)
    stdout_handler.setFormatter(formatter)
    logger.addHandler(stdout_handler)

    # 2. Handler for standard error (WARNING/ERROR/CRITICAL logs)
    stderr_handler = logging.StreamHandler(sys.stderr)
    stderr_handler.setLevel(logging.WARNING)
    stderr_handler.setFormatter(formatter)
    logger.addHandler(stderr_handler)
  
    msg = ''
    if reverse:
        msg = txt[::-1]

    match txt_mode:
        case "lower":
            msg = txt.lower
        case "upper":
            msg = txt.upper
        case "cap":
            msg = txt.capitalize
        case _:
            msg = txt

    if N < 0:
        logger.error('ERROR: `--repeat` must be a positive int number')
        exit(1)

    for i in range(N):
        time.sleep(time_in_secs)
        if error and i == N // 2:
            logger.error(f'FATAL ERROR')
            exit(1)
        else:
            logger.info(f'Create file ./{output_dir}/file{i:02d}.star')
    
    logger.info("Done!")

  # Run bash command
  # cli = "for i in {1..10}; do echo 'Data line '$i; sleep 0.2; done"
  # asyncio.run(run_command_asyncio(cli))

  
