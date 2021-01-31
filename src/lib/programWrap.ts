import bufferWrap from './bufferWrap';

function programWrap(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  fragment: WebGLShader,
  vertex: WebGLShader
) {
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  function validate() {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert(
        "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program)
      );
      return null;
    }
  }
  validate();

  function createBuffer(name: string, size: number) {
    // バッファ操作前には必ずバインドします。
    const buffer = gl.createBuffer();
    const attributeLocation = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // in変数を有効化します
    gl.enableVertexAttribArray(attributeLocation);
    // 現在バインドしているバッファと変数を結びつけます。
    gl.vertexAttribPointer(attributeLocation, size, gl.FLOAT, false, 0, 0);
    return bufferWrap(gl, name, buffer);
  }
  function use() {
    gl.useProgram(program);
  }

  return {
    createBuffer,
    use,
    program,
    validate,
    fragment,
    vertex
  };
}
export default programWrap;
