'use strict'

let programsCache = new WeakMap();

module.exports = function program (gl, vSrc, fSrc) {
	if (!gl) throw Error('WebGL context is not provided')

	//if just getProgram
	if (!vSrc && !fSrc) {
		return gl.getParameter(gl.CURRENT_PROGRAM);
	}

	//if WebGLProgram directly - enable program
	if (vSrc && typeof vSrc !== 'string') {
		gl.useProgram(vSrc);
		return vSrc
	}

	//otherwise create and enable program
	if (!vSrc || !fSrc) throw Error('Vertex/fragment source is not provided');

	var fShader = gl.createShader(gl.FRAGMENT_SHADER);
	var vShader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(fShader, fSrc);
	gl.shaderSource(vShader, vSrc);

	gl.compileShader(fShader);

	if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
		throw Error(gl.getShaderInfoLog(fShader));
	}

	gl.compileShader(vShader);

	if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
		throw Error(gl.getShaderInfoLog(vShader));
	}


	var program = gl.createProgram();
	gl.attachShader(program, vShader);
	gl.attachShader(program, fShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw Error(gl.getProgramInfoLog(program));
	}

	gl.useProgram(program);

	return program;
}
