'use strict';
/**
 * Exposes the Kernel and DataFrame methods.
 * @module gpgpu
 **/
let DataFrame = require('./dataFrame.js'),
    Kernel    = require('./kernel.js');

module.exports.DataFrame = { create : DataFrame.create };
module.exports.Kernel    = { create : Kernel.create };
module.exports.init      = function(three) {
  DataFrame.init(three);
  Kernel.init(three);
};
