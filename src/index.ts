import canvasWrap from './lib/canvasWrap';
import { vertices, indices } from './constants/example';

const vsSource = `#version 300 es
in vec3 vertexPosition;
in vec4 color;
out vec4 vColor;

void main() {
  vColor = color;
  gl_Position = vec4(vertexPosition, 1.0);
}
`;

const fsSource = `#version 300 es
precision highp float;
in vec4 vColor;
out vec4 fragmentColor;

void main() {
  fragmentColor = vColor;
}
`;


function main() {
  const glContent = canvasWrap(document.getElementById("glCanvas"));

  // shading
  const fragmentShader1 = glContent.createFragmentShader(fsSource);
  const vertexShader1 = glContent.createVertexShader(vsSource);
  const shaderProgram1 = glContent.createProgram(vertexShader1, fragmentShader1);

  shaderProgram1.createVBO(
    "vertexPosition",
    3,
    vertices,
    7 * Float32Array.BYTES_PER_ELEMENT,
    0,
  );

  shaderProgram1.createVBO(
    "color",
    4,
    vertices,
    7 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT,
  );

  glContent.render(() => {
    shaderProgram1.use();
    glContent.gl.drawArrays(glContent.gl.TRIANGLES, 0, 6); // 6のpositionsは外だしできそう
  });
}

main();

