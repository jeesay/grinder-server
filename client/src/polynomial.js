

/*
pybaselines.polynomial.goldindec(data, x_data=None, poly_order=2, tol=0.001, max_iter=250, weights=None, cost_function='asymmetric_indec', peak_ratio=0.5, alpha_factor=0.99, tol_2=0.001, tol_3=1e-06, max_iter_2=100, return_coef=False)
*/

const goldindec = {
  help: `Fits a polynomial baseline using a non-quadratic cost function. The non-quadratic cost functions penalize residuals with larger values, giving a more robust fit compared to normal least-squares.`
}

const goldindec_settings =  {
  name: 'settings',
  title: 'Settings',
  widget: 'navtab',
  children: [
    {
       name: 'data',
       input: 'Spectra Data',
       widget: 'file',
       help: `The y-values of the measured data, with N data points.`
    },
    {
      name: 'x_data',
      title: 'x-values of the measured data',
      widget: 'file',
      default: undefined,
      help: `The x-values of the measured data. Default is None, which will create an array from -1 to 1 with N points.`
    },
    {
      name: 'poly_order',
      title: 'Polynomial Order',
      widget: 'int' ,
      default: 2,
      help: `The polynomial order for fitting the baseline. Default is 2.`
    },
    {
      name: 'tol',
      title: 'exit criteria',
      widget: 'float' ,
      default: 1e-3,
      help: `The exit criteria for the fitting with a given threshold value. Default is 1e-3.`
    },
    {
      name: 'max_iter',
      title: 'Maximum Number of Iterations',
      widget: 'int' ,
      default: 250,
      help: `The maximum number of iterations for fitting a threshold value. Default is 250.`
    },
    {
      name: 'weights',
      title: 'Weights',
      widget: 'file',
      default: undefined,
      help: `The weighting array. If None (default), then will be an array with size equal to N and all values set to 1.`
    },
    {
      name: 'cost_function',
      title: 'non-quadratic cost function',
      widget: 'select',
      help: `The non-quadratic cost function to minimize. Unlike penalized_poly(), this function only works with asymmetric cost functions, so the symmetry prefix ('a' or 'asymmetric') is optional (eg. 'indec' and 'a_indec' are the same). Default is 'asymmetric_indec'.`,
      children: [
        {name: 'indec',title: 'asymmetric_indec',widget: 'option'},
        {name: 'quad', title: 'asymmetric_trunc_quadratic',widget: 'option'},
        {name: 'huber',title: 'asymmetric_huber',widget: 'option'},
      ]
    },
    {
      name: 'peak_ratio',
      title: 'peak ratio',
      widget: 'float' ,
      default: 0.5,
      help: `A value between 0 and 1 that designates how many points in the data belong to peaks. Values are valid within ~10% of the actual peak ratio. Default is 0.5.`,
    },
    {
      name: 'alpha_factor',
      title: 'alpha factor',
      widget: 'float' ,
      default: 0.99,
      help: `A value between 0 and 1 that controls the value of the penalty. Default is 0.99. Typically should not need to change this value.`,
    },
    {
      name: 'tol_2',
      title: '',
      widget: 'float' ,
      default: 1e-3,
      help: `The exit criteria for the difference between the optimal up-down ratio (number of points above 0 in the residual compared to number of points below 0) and the up-down ratio for a given threshold value. Default is 1e-3.`,
    },
    {
      name: 'tol_3',
      title: '',
      widget: 'float' ,
      default: 1e-6,
      help: `The exit criteria for the relative change in the threshold value. Default is 1e-6.`,
    },
    {
      name: 'max_iter_2',
      title: 'number of iterations',
      widget: 'float' ,
      default: 100,
      help: `The number of iterations for iterating between different threshold values. Default is 100.`,
    },
  ]
};


const goldindec_running = {
  name: 'running',
  title: 'Run',
  widget: 'navtab',
  children: [
    {
      name: 'poly_output',
      title: 'Polynomial Output Options',
      widget: 'fieldset',
      children: [
        {
          name: 'return_coef',
          title: 'polynomial coefficients returned',
          widget: 'bool' ,
          default: false,
          help: `If True, will convert the polynomial coefficients for the fit baseline to a form that fits the input x_data and return them in the params dictionary. Default is False, since the conversion takes time.`,
        },
      ]
    }
  ]
}

/*
References
    [18] Liu, J., et al. Goldindec: A Novel Algorithm for Raman Spectrum Baseline Correction. Applied Spectroscopy, 2015, 69(7), 834-842.
    [19] Mazet, V., et al. Background removal from spectra by designing and minimising a non-quadratic cost function. Chemometrics and Intelligent Laboratory Systems, 2005, 76(2), 121-133.
*/



/*
From https://pybaselines.readthedocs.io/en/latest/api/pybaselines/polynomial/index.html

pybaselines.polynomial.imodpoly(data, x_data=None, poly_order=2, tol=0.001, max_iter=250, weights=None, use_original=False, mask_initial_peaks=True, return_coef=False, num_std=1)

    The improved modified polynomial (IModPoly) baseline algorithm.

python3 gk_baseline.py -i spectra -m[|method] imodpoly --x_data None -p 2 --tol 0.001 --max_iter 250 --use_original --mask_initial -o baseline.json
*/

const imodpoly_settings = {
  name: 'settings',
  title: 'Settings',
  widget: 'navtab',
  children: [
    {
      name: 'data',
      title: 'Input Spectra',
      option: ['-i','--input'],
      widget: 'file',
      help: ` The y-values of the measured data, with N data points.`,
    },
    {
      name: 'x_data',
      title: 'X Values',
      option: ['-x','--x_data'],
      widget: 'file',
      help: ` The x-values of the measured data which will create an array from -1 to 1 with N points.`,
      default: undefined,
    },
    {
      name: 'poly_order',
      title: 'Polynomial Order',
      option: ['p','--poly_order'],
      widget: 'int',
      help: ` The polynomial order for fitting the baseline.`,
      default: 2,
    },
    {
      name: 'tol',
      title: 'Tolerance',
      widget: 'float',
      help: `The exit criteria.`,
      default: 0.001,
    },
    {
      name: 'max_iter',
      title: 'Maximum Number of Iterations',
      widget: 'int',
      help: `The maximum number of iterations.`,
      default: 250,
    },
    {
      name: 'weights',
      title: 'Weights',
      widget: 'file',
      default: undefined,
      help: ` The weighting array. If None (default), then will be an array with size equal to N and all values set to 1.`,
    },
    {
      name: 'use_original',
      title: 'Use Original',
      widget: 'bool',
      default: false,
      help: ` If False (default), will compare the baseline of each iteration with the y-values of that iteration 4 when choosing minimum values. If True, will compare the baseline with the original y-values given by data 5.`,
    },
    {
      name: 'mask_initial_peaks',
      title: 'Mask Initial Peaks',
      widget: 'bool',
      defaut: true,
      help: ` If True (default), will mask any data where the initial baseline fit + the standard deviation of the residual is less than measured data 6.`,
    },
    {
      name: 'return_coef',
      title: '',
      widget: 'bool',
      help: ` If True, will convert the polynomial coefficients for the fit baseline to a form that fits the input x_data and return them in the params dictionary.  Default is False since the conversion takes time.`,
      default: false,
    },
    {
      name: 'num_std',
      title: 'Number of Standard Deviations',
      widget: 'float',
      help: ` The number of standard deviations to include when thresholding.`,
      default: 1,
    },
  ]
};


  const imodpoly_data =  {
    // numpy.ndarray, shape (N,))
    // The calculated baseline.
    baseline: [],
    params : {
      // numpy.ndarray, shape (N,). 
      // The weight array used for fitting the data.
      weights: [],
      // numpy.ndarray. 
      // An array containing the calculated tolerance values for each iteration. 
      // The length of the array is the number of iterations completed. 
      // If the last value in the array is greater than the input tol value, then the function did not converge. 
      tol_history: [], 
      // numpy.ndarray, shape (poly_order + 1,).
      // Only if return_coef is True. The array of polynomial parameters for the baseline, in increasing order. 
      // Can be used to create a polynomial using numpy.polynomial.polynomial.Polynomial().
      coef: []
    }
  };

/*
    Notes

    Algorithm originally developed in 6.

    References

    4. Gan, F., et al. Baseline correction by improved iterative polynomial fitting with automatic threshold. Chemometrics and 'int'elligent Laboratory Systems, 2006, 82, 59-65.
    5. Lieber, C., et al. Automated method for subtraction of fluorescence from biological raman spectra. Applied Spectroscopy, 2003, 57(11), 1363-1367.
    6(1,2) Zhao, J., et al. Automated Autofluorescence Background Subtraction Algorithm for Biomedical Raman Spectroscopy, Applied Spectroscopy, 2007, 61(11), 1225-1232.
*/

const loess_settings =  {
  name: 'settings',
  title: 'Settings',
  widget: 'navtab',
  children: [
    {
      name: 'fraction',
      title: 'Fraction',
      widget: 'float',
      default: 0.2,
      help: `The fraction of N data points to include for the fitting on each point. Default is 0.2. Not used if total_points is not None.`
    },
    {
      name: 'total_points',
      title: 'Total Number of Points',
      widget: 'int',
      default: -1,
      help: `The total number of points to include for the fitting on each point. Default is None, which will use fraction * N to determine the number of points.`
    },
    {
      name: 'scale',
      title: 'Scale',
      widget: 'float',
      default: 3.0,
      help: `A scale factor applied to the weighted residuals to control the robustness of the fit. Default is 3.0, as used in [^16]. Note that the original loess procedure in [^17] used a scale of ~4.05.
      - [16](1,2) Ruckstuhl, A.F., et al. Baseline subtraction using robust local regression estimation. J. Quantitative Spectroscopy and Radiative Transfer, 2001, 68, 179-193.
      - [17] Cleveland, W. Robust locally weighted regression and smoothing scatterplots. Journal of the American Statistical Association, 1979, 74(368), 829-836.`
    },
    {
      name: 'poly_order',
      title: 'Polynomial Order',
      widget: 'int',
      default: 1,
      help: 'The polynomial order for fitting the baseline. Default is 1.'
    },
    {
      name: 'tol',
      title: 'Tolerance',
      widget: 'float',
      default: 1e-3,
      help: 'The exit criteria. Default is 1e-3.'
    },
    {
      name: 'max_iter',
      title: 'Max. Number of Iterations',
      widget: 'int',
      default: 10,
      help: 'The maximum number of iterations. Default is 10.'
    },
    {
      name: 'weights',
      title: 'Weights',
      widget: 'file',
      default: 'None',
      help: 'The weighting array. If None (default), then will be an array with size equal to N and all values set to 1'
    },
    {
      name: 'conserve_memory',
      title: 'Use Cache',
      widget: 'bool',
      default: true,
      help: `If False, will cache the distance-weighted kernels for each value in x_data on the first iteration and reuse them on subsequent iterations to save time. The shape of the array of kernels is (len(x_data), total_points). If True (default), will recalculate the kernels each iteration, which uses very little memory, but is slower. Can usually set to False unless x_data and \`total_points\` are quite large and the function causes memory issues when cacheing the kernels. If numba is installed, there is no significant time difference since the calculations are sped up.`
    },
    {
      name: 'delta',
      title: 'Delta',
      widget: 'float',
      default: 0, 
      help: `If delta is > 0, will skip all but the last x-value in the range x_last + delta, where x_last is the last x-value to be fit using weighted least squares, and instead use linear interpolation to calculate the fit for those x-values (same behavior as in statsmodels 21 and Cleveland's original Fortran lowess implementation 22). Fits all x-values if delta is <= 0. Default is 0.0. Note that x_data is scaled to fit in the range [-1, 1], so delta should likewise be scaled. For example, if the desired delta value was 0.01 * (max(x_data) - min(x_data)), then the correctly scaled delta would be 0.02 (ie. 0.01 * (1 - (-1))).`
    },
    {
      name: 'loess_optional',
      title: 'Weights Computing',
      widget: 'fieldset',
      children: [
        {
          name: 'no_weights_threshold',
          widget: 'radio',
          group: 'weights_computing',
          title: 'None',
          default: true,
          help: `By default, no symmetric weights and no use of threshold.`
        },
        {
          name: 'symmetric_weights',
          widget: 'radio',
          group: 'weights_computing',
          title: 'Symmetric Weights',
          default: false,
          help: `If False (default), will apply weighting asymmetrically, with residuals < 0 having a weight of 1, according to 16. If True, will apply weighting the same for both positive and negative residuals, which is regular LOESS. If use_threshold is True, this parameter is ignored.`
        },
        {
          name: 'use_threshold',
          title: 'Use Threshold',
          widget: 'radio',
          group: 'weights_computing',
          default: false,
          help: `If False (default), will compute weights each iteration to perform the robust fitting, which is regular LOESS. If True, will apply a threshold on the data being fit each iteration, based on the maximum values of the data and the fit baseline, as proposed by 18, similar to the modpoly and imodpoly techniques.`
        },
      ]
    },
    {
      name: 'use_threshold_yes',
      title: 'Use Threshold',
      status: 'hidden',
      widget: 'fieldset',
      children: [
        {
          name: 'num_std',
          title: 'Number of standard deviations',
          widget: 'float',
          default: 1.0,
          help: `The number of standard deviations to include when thresholding. Default is 1, which is the value used for the imodpoly technique. Only used if use_threshold is True.`
        },
        {
          name: 'use_original',
          title: 'Use Original',
          widget: 'bool',
          default: false,
          help: `If False (default), will compare the baseline of each iteration with the y-values of that iteration 19 when choosing minimum values for thresholding. If True, will compare the baseline with the original y-values given by data 20. Only used if use_threshold is True.`
        },
      ]
    }
  ]
};

const loess_running = {
  name: 'running',
  title: 'Run',
  widget: 'navtab',
  children: [
    {
      name: 'poly_output',
      title: 'Polynomial Output Options',
      widget: 'fieldset',
      children: [
        {
          name: 'return_coef',
          title: 'Return Coefficients',
          widget: 'bool',
          default: false,
          help: `If True, will convert the polynomial coefficients for the fit baseline to a form that fits the input x_data and return them in the params dictionary. Default is False, since the conversion takes time.`
        },
      ]
    }
  ]
}

/*
From https://pybaselines.readthedocs.io/en/latest/api/pybaselines/polynomial/index.html

pybaselines.polynomial.poly(data, x_data=None, poly_order=2, weights=None, return_coef=False)
*/

const poly_settings = {
    name: 'settings',
    title: 'Settings',
    widget: 'navtab',
    children: [
    {
      name: 'data',
      title: 'Input Spectra',
      option: '-i',
      widget: 'file',
      help: ` The y-values of the measured data, with N data points.`,
    },
    {
      name: 'x_data',
      title: 'X Data',
      option: '--x_data',
      widget: 'file',
      default: undefined,
      help: `The x-values of the measured data. Default is None, which will create an array from -1 to 1 with N points.`,
    },
    {
      name: 'poly_order',
      title: 'Polynomial Order',
      option: '--poly_order',
      widget: 'int',
      default: 2,
      help: 'The polynomial order for fitting the baseline. Default is 2.'
    },
    {
      name: 'weights',
      title: 'Weights',
      widget: 'file',
      option: '--weights',
      default: undefined,
      help: 'The weighting array. If None (default), then default will be an array with size equal to N and all values set to 1.'
    }
  ]
};

const poly_running = {
  name: 'running',
  title: 'Run',
  widget: 'navtab',
  children: [
    {
      name: 'poly_output',
      title: 'Polynomial Output Options',
      widget: 'fieldset',
      children: [
        {
          name: 'return_coef',
          title: 'Return Coefficients',
          option: '--return_coef',
          widget: 'bool',
          default: false,
          help: `If True, will convert the polynomial coefficients for the fit baseline to a form that fits the input x_data and return them in the params dictionary. Default is False, since the conversion takes time.`
        }
      ]
    }
  ]
}
