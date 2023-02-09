from setuptools import setup, find_packages

setup(
    name="gmmk",
    version="0.1.0",
    url="https",
    author="Jean-Christophe Taveau",
    author_email="name@example.com",
    description="GUI for Multi-Modal Imaging Spectra Toolkit",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    keywords=["visualisation machine learning spectroscopy"],
    classifiers=[
        "Intended Audience :: Science/Research",
        "Programming Language :: Python :: 3.7",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    packages=find_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
    license="GPL-3.0-or-later",
    install_requires=[],
    entry_points={"console_scripts": ["my_command=gmmk.__main__:cli"]},
    include_package_data=True,
    package_data={'': ['js/*']},
    python_requires=">=3.7.0",
)
