# Tables

## Baseline Parameters Table (to modify if necessary)

| Parameter name  | Short argument | Long argument | Default |
| ------------- |:-------------:|:-------------: | :-------------: |
| input file | -i | --input | Required |
| output file | -o | --output | Required |
| algo | -ag | --algo | Required |
| | | | |
| alpha (float/array) | -a | --alpha | 0.1 / None |
| alpha_factor (float) | -af | -alphafactor | 0.99 |
| asymmetry (float) | -asy | --asymmetry | 6.0 |
| average_dataset (bool) | -ave | --averagedata | True |
| baseline_points (array) | -bas | -baseline | () |
| beta (float) | -b | --beta | 10.0 |
| beta_mult (float) | -bm | --betamult | 1.1 |
| conserve_memory (bool) | -cm | --consmemory | True |
| constrained_fraction (float) | -cf | --constrfraction | 0.01 |
| constrained_weight (float) | -cw | --constrweight | 100000.0 |
| cost_function (int/str) | -cost | --constfunc | 2 / 'asymmetric_indec' |
| decreasing (bool) | -dcr | --decrease | False |
| delta (float) | -d | --delta | 0.0 |
| diff_order (int) | -do | --difforder | 2 |
| estimation_poly_order (int) | -epo | --estipoly | 2 |
| eps (float) | -eps | --eps | None |
| eps_0 (float) | -e0 | --eps0 | 1e-06 |
| eps_1 (float) | -e1 | --eps1 | 1e-06 |
| eta (float) | -eta | --eta | 0.5 |
| fill_half_window (int) | -fhw | --fillhalfwind | 3 |
| filter_order (int) | -fo | --filterorder | 2 |
| filter_type (int) | -ft | --filtertype | 1 |
| fit_parabola (bool) | -fp | --fitparabol | True |
| fraction (float) | -f | --frac | 0.2 |
| freq_cutoff (float) | -fc | --freqcutoff | 0.005 |
| gamma (float) | -g | --gamma | 1.0 |
| gamma_mult (float) | -gm | --gammamult | 0.909 |
| half_window (int) | -hw | --halfwind | None |
| height_scale (float) | -hs | --heightscale | 1.0 |
| interp_half_window (int) | -ihw | --inthalfwind | 5 |
| interp_method (str) | -ip | --intmet | 'linear' |
| k (float) | -k | --k | None |
| lam (flaot) | -l | --lam | 1000000.0 |
| lam_0 (float) | -l0 | --lam0 | 1.0 |
| lam_1 (float) | -l1 | --lam1 | 1.0 |
| lam_2 (float) | -l2 | --lam2 | 1.0 |
| lam_smooth (float) | -ls | --lamsmooth | 0.01 |
| mask_initial_peaks (bool) | -mip | --mask | True |
| max_iter (int) | -mi | --maxiter | 50 |
| max_iter_2 (int) | -mi2 | --maxiter2 | 100 |
| max_value (int) | -mav | --maxval | 8 |
| method (str) | -m | --method |  'asls' |
| min_length (int) | -mil | --minlength | 2 |
| min_fwhm (int) | -mif | --minfwhm | None |
| min_value (int) | -miv | --minval | 2 |
| num_bins (int) | -nb | --numbins | None |
| num_knots (int) | -nk | --numknots | 100 |
| num_smooths (int) | -ns | --numsmooths | 16 |
| num_std (float) | -nd | --numstd | 1.0 |
| original_criteria (bool) | -oc | --origcrit | False |
| p (float) | -p | -p | 0.01 |
| pad_kwargs (dict) | -pk | --padkwargs | None |
| peak_ratio (float) | -pr | --peakratio | 0.5 |
| poly_order (int) | -po  | --poly | None |
| quantile (float) | -q | --quantile | 0.05 |
| return_coef (bool) | -rc | --returncoeff | False |
| robust_opening (bool) | -ro | --robustopen | True |
| roi (array) | -roi | --roi | None |
| scale (int) | -sc | --scale | None |
| scales (array) | -scs | --scales | None |
| sections (int) | -sec | --sections | 32 |
| side (str) | -sd | --side | 'both' |
| sigma (float) | -s | --sigma | None |
| sigma_scale (float) | -ssc | --sigmascale | 1.0/12.0 |
| smooth_half_window (int) | -shw | --smoothhalf | None |
| spline_degree (int) | -spd | --splinedegree | 3 |
| step (int) | -st | --step | 1 |
| symmetric (bool) | -sy | --symmetric | False |
| symmetric_weights (bool) | -syw | --symweight | False |
| threshold (float) | -th | --threshold | None |
| tol (float) | -to | --tol | 0.001 |
| tol_2 (float) | -to2 | --tol2 | 0.001 |
| tol_3 (float) | -to3 | --tol3 | 1e-06 |
| total_points (int) | -tot | --totpoints | None |
| use_original (bool) | -uo | --useorig | False |
| use_threshold (bool) | -uth | --usethreshold | False |
| weights (array) | -w | --weight | None |
| weights_as_mask (bool) | -was | --weightmask | False |
| width_scale (float) | -ws | --widthscale | 0.1 |
