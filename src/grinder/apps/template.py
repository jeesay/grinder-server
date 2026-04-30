import asyncio
import logging
import typer
from typing import Annotated, Optional

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
def template(
    path: Annotated[ str, typer.Option("--i", help="Metadata path in MotionCorr/job<xyz>")],
    output_dir: Annotated[ str, typer.Option("--o", help="Output GRINDER directory")]
):

  # Run bash command
  cli = "for i in {1..10}; do echo 'Data line '$i; sleep 0.2; done"
  # asyncio.run(run_command_asyncio(cli))

  pass
