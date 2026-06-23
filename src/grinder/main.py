import typer
from importlib.metadata import version, PackageNotFoundError
# from grinder.apps import client,server, motioncorr, test, import_cs
from grinder.apps import server, motioncorr, test, import_cs


app = typer.Typer(help="Suite of GRINDER tools")

def version_callback(value: bool):
    if value:
        try:
            # "grinder" should match the 'name' in your [project] section
            pkg_version = version("grinder")
            typer.echo(f"Grinder CLI version: {pkg_version}")
        except PackageNotFoundError:
            typer.echo("Grinder CLI version: unknown (not installed)")
        raise typer.Exit()

@app.callback()
def main(
    version: bool = typer.Option(
        None, "--version", callback=version_callback, is_eager=True,
        help="Show the version and exit."
    ),
):
    """
    Grinder - Your Python CLI tool.
    """
    pass

@app.command()
def sharp():
    typer.echo("Grinding tools to a sharp edge!")


# Add the apps as subcommands
app.add_typer(server.helper)
# app.add_typer(client.cli)
app.add_typer(motioncorr.app)
app.add_typer(test.app)
app.add_typer(import_cs.app)

if __name__ == "__main__":
    app()
