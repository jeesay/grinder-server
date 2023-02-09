

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


