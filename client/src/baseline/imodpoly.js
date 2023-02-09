
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

