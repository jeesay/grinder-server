# Python Contents

## `normalize.py`

Contains functions to normalize and remove outliers in spectra.

- Vector Normalization
- Min Max Normalization
- Peak Normalization
- SNV

Outliers

- MSC
- EMSC

## `spc_file.py`

Load spc file and convert the data to csv or txt file using `https://github.com/rohanisaac/spc`   

## `wip_file.py`

Load wid and wip files, save directly wid files in txt or json files, if no spectra selected in a wip project, return them, else save the selected spectra in json files 

## Despiking

[1] Darren A. Whitaker, Kevin Hayes, (2018) A simple algorithm for despiking Raman spectra, Chemometrics and Intelligent Laboratory Systems, Volume 179, Pages 82-84, https://doi.org/10.1016/j.chemolab.2018.06.009. Supplementary Data https://data.mendeley.com/datasets/sxjgbgg95y/1

https://towardsdatascience.com/removing-spikes-from-raman-spectra-8a9fdda0ac22


[2] Tian, Yao & Burch, Kenneth. (2016). Automatic Spike Removal Algorithm for Raman Spectra. Applied Spectroscopy. 70. 10.1177/0003702816671065. 

