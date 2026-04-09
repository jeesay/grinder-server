import typer
from grinder.apps import server, motioncorr

app = typer.Typer(help="Suite of GRINDER tools")

# Add the apps as subcommands
app.add_typer(server.helper)
app.add_typer(motioncorr.app)

if __name__ == "__main__":
    app()
