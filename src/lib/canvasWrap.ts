import glWrap from './glWrap';
interface CanvasWrapOption {
  isFull?: boolean;
}

function canvasWrap(canvas: HTMLElement, {
  isFull = true,
}: CanvasWrapOption = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('fuxx you');
  if (isFull) {
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
    };
    resize();
    window.addEventListener('resize', resize);
  }
  const gl = canvas.getContext("webgl2");
  if (gl == null) throw new Error("gl context not found");
  const wrap = glWrap(gl);
  wrap.initialRender();

  return {
    canvas,
    ...wrap,
  };
}

export default canvasWrap;
