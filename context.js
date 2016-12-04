/** @module  gl-util/context */
'use strict'

const glContext = require('webgl-context')

module.exports = setContext;

function setContext (opts) {
	if (!opts) opts = {};
	else if (typeof opts === 'string') opts = {};
	else if (opts.context) return opts.context;

	let canvas = opts.canvas;
	if (!canvas) canvas = document.createElement('canvas');

	//provide defaults
	if (opts.antialias == null) opts.antialias = true
	if (opts.alpha == null) opts.alpha = true
	if (opts.premultipliedAlpha == null) opts.premultipliedAlpha = true
	if (opts.preserveDrawingBuffer == null) opts.preserveDrawingBuffer = true
	if (opts.depth == null) opts.depth = false
	if (opts.stencil == null) opts.stencil = false
	if (opts.float == null) opts.float = false

	//create new context with default options
	let gl = glContext(opts);

	//enable extensions
	if (opts.float) {
		let float = gl.getExtension('OES_texture_float');
		let floatLinear;
		if (!float) {
			float = gl.getExtension('OES_texture_half_float');
			if (!float) {
				throw Error('WebGL does not support floats.');
			}
			floatLinear = gl.getExtension('OES_texture_half_float_linear');
		}
		else {
			floatLinear = gl.getExtension('OES_texture_float_linear');
		}
		if (!floatLinear) throw Error('WebGL does not support floats.');
	}

	//setup alpha
	if (!opts.alpha) {
		gl.enable( gl.BLEND );
		gl.blendEquation( gl.FUNC_ADD );
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	return gl;
}
