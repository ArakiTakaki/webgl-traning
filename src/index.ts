import glWrap from './lib/glWrap';
import { exampleColors, exampleVertices } from './constants/example';

const isCanvasElement = (
  element: HTMLElement | null
): element is HTMLCanvasElement => element != null;

const vsSource = `#version 300 es

in vec3 vertexPosition;
in vec4 color;

// このシェーダからフラグメントシェーダに対して出力する変数を
// outで宣言します。
out vec4 vColor;

void main() {
  // 頂点色を何も処理せずにそのままフラグメントシェーダへ出力します。
  vColor = color;

  // 頂点座標を決定するには、gl_Position変数へ書き込みます。
  // 今回は特別な処理は行わず、受け取った値をそのまま素直に出力しています。
  // 頂点座標はx,y,z,wの4つになるので、vec3からvec4へと変換しています。
  // wの値については後ほど説明しますが、ここでは1.0固定にしておいてください。
  gl_Position = vec4(vertexPosition, 1.0);
}
`;
const fsSource = `#version 300 es
// float（単制度浮動小数点）の精度を指定します。
// これは必須です。
// lowp, midiump, highpなどありますが、
// 特別な理由がない限りhighpでいいでしょう。
precision highp float;

// バーテックスシェーダから受け取る変数を
// inで宣言します。
in vec4 vColor;

// 画面に出力する色の変数を宣言しておく。
// r,g,b,alphaのvec4。
out vec4 fragmentColor;

void main() {
  // 特に何も処理せずそのまま色を出力する。
  fragmentColor = vColor;
}
`;


function main() {
  const elCanvas = document.getElementById("glCanvas");
  if (!isCanvasElement(elCanvas)) {
    console.error("canvas is null");
    return;
  }
  // GL コンテキストを初期化する
  const gl = elCanvas.getContext("webgl2");
  if (gl == null) throw new Error("gl context not found");
  const glContent = glWrap(gl);

  glContent.initalRender();
  const fragmentShader = glContent.createFragmentShader(fsSource);
  const vertexShader = glContent.createVertexShader(vsSource);
  const shaderProgram = glContent.createProgram(vertexShader, fragmentShader);
  shaderProgram.use();
  const vertexBuffer = shaderProgram.createBuffer("vertexPosition", 3);
  vertexBuffer.updateBuffer(new Float32Array(exampleVertices));
  const colorBuffer = shaderProgram.createBuffer("color", 4);
  colorBuffer.updateBuffer(new Float32Array(exampleColors));
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  const shaderProgram2 = glContent.createProgram(vertexShader, fragmentShader);
  shaderProgram2.use();
  const vertexBuffer2 = shaderProgram2.createBuffer("vertexPosition", 3);
  vertexBuffer2.updateBuffer(new Float32Array(exampleVertices.map(val => val + 0.5)));
  const colorBuffer2 = shaderProgram2.createBuffer("color", 4);
  colorBuffer2.updateBuffer(new Float32Array(exampleColors));
  gl.drawArrays(gl.TRIANGLES, 0, 6); // 6のpositionsは外だしできそう
  gl.flush();
}

main();
