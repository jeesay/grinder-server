

## Main program `gimmick`

Gimmick : create project if necessary, handle the server and stop it when quit button is used  


## gk_workflow

gk_workflow : manage the files in .gimmick created, the config.json file and the job counter  
Create and manage cli.txt, error.txt, log.txt, job.json  

## gk_import

gk_import : import file from folder in project, support spc, wid, wip files
```bash
> python3 gk_import.py -i "File.wid" -ag "Import" --caption []  
> python3 gk_import.py -i "File.wip" -ag "Import" --caption "['Spectra_1.json', 'Spectra_2.json']"  
```

## gk_baseline

### Methods

All the methods present in package `pybaselines`. See [doc.](https://pybaselines.readthedocs.io/en/latest/api/pybaselines/api/index.html#pybaselines.api.Baseline.rolling_ball).
Tables of arguments for the `pybaselines` tools [Tables](https://github.com/jeesay/gimmick/blob/main/src/bin/Tables.md).  
Example :
```bash
> python3 gk_baseline.py -i "Single Spectrum_000_Spec.Data 1-Si.json" -o "Corrected_Spectra.json" -ag "rolling_ball" -hw None -shw None -pk None  
> python3 gk_baseline.py --input "Single Spectrum_000_Spec.Data 1-Si.json" --output "Corrected_Spectra.json" --algo "rolling_ball" --halfwind None --smoothhalf None --padkwargs None
```
## gk_normalize

### Methods

- min/max: v = (y - min)/(max - min) [1]
- 
- 

[1] Ref.

## gl_denoise

- Savitsky ??? package scikit.signal
- 
- 


