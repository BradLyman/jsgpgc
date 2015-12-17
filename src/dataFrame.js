'use strict';
/**
 * Exports factory methods for constructing DataFrames.
 * A DataFrame is a double-buffered chunk of data which
 * can be processed by kernels.
 * Each DataFrame represents an nxn square grid of
 * floating point vector values.
 * Each grid point contains 4 values.
 * @module gpgpu/DataFrame
 **/
let kernel = require('./kernel.js');

/**
 * Must be initialized before the rest of the library can be used.
 **/
let Three = {};

/** @class DataFrame **/
let DataFrame = {};
DataFrame.prototype = {
  /** @lends DataFrame **/

  /**
   * Creates a kernel sized for this dataFrame.
   * @param {String} kernelSrc - The kernel's source code.
   * @param {Object} uniforms - Optional object describing any custom uniforms
   *                            in the kernel source code.
   **/
  createKernel : function(kernelSrc, uniforms) {
    return kernel.create(this.sideLen, kernelSrc, uniforms);
  },

  /**
   * Swaps the read and write buffers, usually called after the frame
   * is processed by a kernel.
   **/
  swapBuffers : function() {
    let temp   = this.read;
    this.read  = this.write;
    this.write = temp;
  },
};

/**
 * Creates a new DataFrame.
 * @param {Number} sideLen - The length of the side of the data frame.
 *                           (the resulting frame has sideLenxsideLen
 *                           gridpoints)
 * @return {DataFrame}
 **/
module.exports.create = function(sideLen) {
  const RENDER_TARGET_SETTINGS = {
    depthBuffer     : false,
    stencilBuffer   : false,
    generateMipmaps : false,
    minFilter       : Three.NearestFilter,
    magFilter       : Three.LinearFilter,
    format          : Three.RGBAFormat,
    type            : Three.FloatType,
  };

  let readTarget = new Three.WebGLRenderTarget(
    sideLen, sideLen, RENDER_TARGET_SETTINGS
  );

  let writeTarget = new Three.WebGLRenderTarget(
    sideLen, sideLen, RENDER_TARGET_SETTINGS
  );

  return {
    __proto__ : DataFrame.prototype,
    read      : readTarget,
    write     : writeTarget,
    sideLen   : sideLen,
  };
};

/**
 * Provide a three instance for the library to use.
 **/
module.exports.init = function(three) {
  Three = three;
};
