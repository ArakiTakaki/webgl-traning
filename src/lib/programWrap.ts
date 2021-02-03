import bufferWrap from './bufferWrap';

function programWrap(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  fragment: WebGLShader,
  vertex: WebGLShader,
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
      throw new Error( "Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
    }
  }
  validate();

  function _createBuffer(
    name: string,
    size: number,
    array: Float32Array | Int16Array,
    bufType: number,
    usage: number,
    stride = 0,
    offset = 0
  ) {
    // バッファ操作前には必ずバインドします。
    const buffer = gl.createBuffer();
    const attributeLocation = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // in変数を有効化します
    gl.enableVertexAttribArray(attributeLocation);
    // 現在バインドしているバッファと変数を結びつけます。
    gl.vertexAttribPointer(attributeLocation, size, gl.FLOAT, false, stride, offset);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    const result = bufferWrap(attributeLocation, size, gl, name, buffer, bufType, usage);
    result.updateBuffer(array);
    return result;
  }

  function use() {
    gl.useProgram(program);
  }

  const createVBO = (
    name: string,
    size: number,
    array: Float32Array | Int16Array,
    stride: number = 0,
    offset: number = 0,
  ) => _createBuffer(name, size, array,gl.ARRAY_BUFFER, gl.STATIC_DRAW, stride, offset);
  const createIBO = (
    name: string,
    size: number,
    array: Float32Array | Int16Array,
    stride: number = 0,
    offset: number = 0,
  ) => _createBuffer(name, size, array, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, stride, offset);

  const createVBOFeedback = (
    name: string,
    size: number,
    array: Float32Array | Int16Array,
    stride: number = 0,
    offset: number = 0
  ) => _createBuffer(name, size, array, gl.ARRAY_BUFFER, gl.DYNAMIC_COPY, stride, offset);

  return {
    use,
    program,
    validate,
    fragment,
    vertex,
    createVBOFeedback,
    createVBO,
    createIBO,
  };
}

export default programWrap;
