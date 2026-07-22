import asyncio
from abc import ABC, abstractmethod
from typing import List, Dict

class DataChannel:
    """A generic data stream that routes items to connected tasks."""
    def __init__(self, name: str):
        self.name = name
        self.queue = asyncio.Queue()
        self.consumers: List['PipelineTask'] = []

    async def put(self, item):
        if item is None:
            # Signal end-of-stream to all consumers
            for consumer in self.consumers:
                await consumer.input_queue.put(None)
        else:
            # Replicate/broadcast data if there are multiple downstream consumers
            for consumer in self.consumers:
                await consumer.input_queue.put(item)

class PipelineTask(ABC):
    """Abstract base class for any command-line or API execution step."""
    def __init__(self, name: str):
        self.name = name
        self.input_queue = asyncio.Queue()
        self.output_channel: DataChannel = None

    async def start(self):
        """The main loop processing incoming streaming data."""
        print(f"[{self.name}] Task started and waiting for data...")
        while True:
            item = await self.input_queue.get()
            if item is None:  # End of stream signal
                if self.output_channel:
                    await self.output_channel.put(None)
                self.input_queue.task_done()
                break
            
            print(f"[{self.name}] Processing item: {item}")
            try:
                # Execute the actual scientific step (Slurm, local, or API)
                output_item = await self.process(item)
                
                # If there's a downstream channel, pass the result forward
                if self.output_channel and output_item:
                    await self.output_channel.put(output_item)
            except Exception as e:
                print(f"[{self.name}] Critical Error processing {item}: {e}")
                # Implement error/database tracking here
                
            self.input_queue.task_done()
        print(f"[{self.name}] Task finished cleanly.")

    @abstractmethod
    async def process(self, item):
        """Subclasses implement specific logic here (e.g., Slurm submission)."""
        pass