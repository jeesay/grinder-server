
/*
scipy.signal.savgol_filter(x, window_length, polyorder, deriv=0, delta=1.0, axis=-1, mode='interp', cval=0.0)[source]
*/

const savgol_settings = {
  name: 'savgol',
  title: 'Savitzky-Golay Filter',
  widget: 'navtab',
  help: 'Apply a Savitzky-Golay filter',
  children: [
    {
      name: 'xarray_like',
      title: 'Input Spectra',
      option: '-i',
      widget: 'file',
      help: `The data to be filtered. If x is not a single or double precision floating point array, 
      it will be converted to type numpy.float64 before filtering.`
    },
    {
      name: 'window_length',
      title: 'Window Length',
      option: '-wl',
      widget: 'int',
      help: `The length of the filter window (i.e., the number of coefficients). 
      If mode is ‘interp’, window_length must be less than or equal to the size of x.`
    },
    {
      name: 'polyorder',
      title: 'Polynomial Order',
      widget: 'int',
      help: `The order of the polynomial used to fit the samples. polyorder must be less than window_length.`
    },
    {
      name: 'deriv',
      title: 'Order of the Derivative',
      widget: 'int',
      default: 0,
      help: `The order of the derivative to compute. This must be a nonnegative integer. The default is 0, which means to filter the data without differentiating.`
    },
    {
      name: 'delta',
      title: 'Samples Spacing',
      widget: 'float',
      default: 1.0,
      help: `The spacing of the samples to which the filter will be applied. This is only used if deriv > 0. Default is 1.0.`
    },
    {
      name: 'axis',
      title: 'Axis',
      widget: 'int',
      default: -1,
      help: `The axis of the array x along which the filter is to be applied. Default is -1.`
    },
    {
      name: 'mode',
      title: 'Mode',
      widget: 'select',
      children: [
        {name: 'mirror',title: 'mirror',widget: 'option', value: true},
        {name: 'constant', title: 'constant',widget: 'option'},
        {name: 'nearest',title: 'nearest',widget: 'option'},
        {name: 'wrap',title: 'wrap',widget: 'option'},
        {name: 'interp',title: 'interp',widget: 'option'},
      ],
      help: `This determines the type of extension to use for the padded signal to which the filter is applied. When mode is ‘constant’, the padding value is given by cval. See the Notes for more details on ‘mirror’, ‘constant’, ‘wrap’, and ‘nearest’. When the ‘interp’ mode is selected (the default), no extension is used. Instead, a degree polyorder polynomial is fit to the last window_length values of the edges, and this polynomial is used to evaluate the last window_length // 2 output values.`
    },
    {
      name: 'cval',
      title: 'Padding Value',
      widget: 'float',
      default: 0.0,
      help: `Value to fill past the edges of the input if mode is ‘constant’. Default is 0.0.`
    },
  ]
}

const savgol_running = {
  name: 'running',
  title: 'Run',
  widget: 'navtab',
  children: []
}


