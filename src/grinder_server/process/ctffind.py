import asyncio
import typer
from typing import Annotated

import grinder.core.pipeline as gpi

class CtfEstimationTask(gpi.PipelineTask):
    async def process(self, mrc_path: str):
        # Simulate CTFFIND4 cluster execution
        await asyncio.sleep(0.5)
        return f"{mrc_path}_ctf.star"
    
###################### MAIN ######################
helper = typer.Typer()

@helper.command()
def ctffind(
    path: Annotated[str, typer.Option("--i", help="Metadata path in Import/job<xyz>")],
    mgr:  Annotated[str, typer.Option("--schedule", help="SLURM scheduler")]=False,
):
    task = CtfEstimationTask()

    if  mgr:
        manager = PipelineManager() # get pipelinemanager from grinder (singleton?)
        # Define input channel, no output
        mics = manager.create_channel("MotionCorr/job004/Movies/corrected_micrographs")
        manager.add_task(CtfEstimationTask("CTFFIND4"), input_channel=mics)
    else:
        pass