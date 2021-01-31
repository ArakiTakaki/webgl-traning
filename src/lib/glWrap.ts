import programWrap from './programWrap';

function glWrap(gl: WebGLRenderingContext) {
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
    vertextShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    const shaderProgram = gl.createProgram();
    if (shaderProgram == null) throw new Error("create program not found");
    return programWrap(gl, shaderProgram, vertextShader, fragmentShader);
  }
  function initalRender() {
    // WebGL が使用可能で動作している場合にのみ続行します
    // クリアカラーを黒に設定し、完全に不透明にします
    // 指定されたクリアカラーでカラーバッファをクリアします
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    // DEPTHテストを有効化する。
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    // DEPTHテストの関数
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  return {
    createFragmentShader,
    createVertexShader,
    initalRender,
    createProgram,
    gl
  };
}

export default glWrap;
