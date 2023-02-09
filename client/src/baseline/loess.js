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
