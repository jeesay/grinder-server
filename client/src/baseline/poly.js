
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
