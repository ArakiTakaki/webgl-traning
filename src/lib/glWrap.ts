import programWrap from './programWrap';

function glWrap(gl: WebGL2RenderingContext) {
  function _createShader(type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (shader == null) throw new Error("create program error");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        "An error occurred compiling the shaders: " +
        gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      throw new Error("create program error");
    }
    return shader;
  }

  function createFragmentShader(source: string): WebGLShader {
    return _createShader(gl.FRAGMENT_SHADER, source);
  }

  function createVertexShader(source: string): WebGLShader {
    return _createShader(gl.VERTEX_SHADER, source);
  }

  function createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    const shaderProgram = gl.createProgram();
    if (shaderProgram == null) throw new Error("create program not found");
    return programWrap(gl, shaderProgram, vertexShader, fragmentShader);
  }

  function initialRender() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  function render(cb: (time: number) => void) {
    let id = 0;
    const main = (time: number) => {
      id = window.requestAnimationFrame(main);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      cb(time);
      gl.flush();
    };
    id = window.requestAnimationFrame(main)
    return () => {
      window.cancelAnimationFrame(id);
    };
  }

  return {
    createFragmentShader,
    createVertexShader,
    initialRender,
    createProgram,
    render,
    gl,
  };
}

export default glWrap;
