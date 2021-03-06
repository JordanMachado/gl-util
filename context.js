/** @module  gl-util/context */
'use strict'

const glContext = require('webgl-context')

module.exports = setContext;

function setContext (opts) {
	if (!opts) opts = {};
	else if (typeof opts === 'string') opts = {};
	else if (opts.context) return opts.context;

	//provide defaults

	//create new context with default options
	let gl = glContext({
		canvas: opts.canvas ? opts.canvas : document.createElement('canvas'),
		antialias: opts.antialias != null ? opts.antialias : true,
		alpha: opts.alpha != null ? opts.alpha : true,
		premultipliedAlpha: opts.premultipliedAlpha != null ? opts.premultipliedAlpha : true,
		preserveDrawingBuffer: opts.preserveDrawingBuffer != null ? opts.preserveDrawingBuffer : true,
		depth: opts.depth != null ? opts.depth : false,
		stencil: opts.stencil != null ? opts.stencil : false,
		width: opts.width,
		height: opts.height
	});

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
