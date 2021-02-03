function bufferWrap(
  attributeLocation: number,
  size: number,
  gl: WebGLRenderingContext,
  name: string,
  buffer: WebGLBuffer | null,
  bufType: number,
  usage: number,
) {

  function useBuffer() {
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation, size, gl.FLOAT, false, 0, 0);
  }

  function updateBuffer(array: Float32Array | Int16Array) {
    gl.bindBuffer(bufType, buffer);
    gl.bufferData(bufType, array, usage);
    gl.bindBuffer(bufType, null);
  }


  return {
    updateBuffer,
    useBuffer,
    name,
    buffer,
  };
}

export default bufferWrap;
