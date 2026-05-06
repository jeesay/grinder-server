import asyncio
import logging
import time
import typer
from typing import Annotated

async def run_command_asyncio(command):
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    async def log_output(stream, logger_func):
        while True:
            line = await stream.readline()
            if line:
                logger_func(line.decode().strip())
            else:
                break

    # Run the two reads in "background"
    await asyncio.gather(
        log_output(process.stdout, logging.info),
        log_output(process.stderr, logging.error)
    )
    
    await process.wait()

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


    for i in range(N):
        time.sleep(10)
        print(i,msg,sep=",")

  # Run bash command
  # cli = "for i in {1..10}; do echo 'Data line '$i; sleep 0.2; done"
  # asyncio.run(run_command_asyncio(cli))

  
