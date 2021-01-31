function bufferWrap(
  gl: WebGLRenderingContext,
  name: string,
  buffer: WebGLBuffer | null
) {
  function updateBuffer(array: Float32Array) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  }
  return {
    updateBuffer,
    name,
    buffer
  };
}

export default bufferWrap;
