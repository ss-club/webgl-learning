import { useEffect, useRef } from "react";
import { initShaders } from "./lib/cuon-utils";
import "./App.css";

function App() {
  const mountRef = useRef<HTMLCanvasElement>(null);

  const pointRef = useRef<number[]>([]);

  var VSHADER_SOURCE =
    "attribute vec4 a_Position;\n" +
    "void main() {\n" +
    "  gl_Position = a_Position;\n" + // Set the vertex coordinates of the point
    "  gl_PointSize = 10.0;\n" + // Set the point size
    "}\n";

  // Fragment shader program
  var FSHADER_SOURCE =
    "void main() {\n" +
    "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" + // Set the point color
    "}\n";
  useEffect(() => {
    if (mountRef.current) {
      const gl = mountRef.current.getContext("webgl");
      if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
      }

      // Initialize shaders
      if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to intialize shaders.");
        return;
      }

      const a_Position = gl.getAttribLocation(
        (gl as any).program,
        "a_Position"
      );

      if (a_Position < 0) {
        console.log("failure to get a_Position");
        return;
      }

      const handleClick = (
        e: MouseEvent,
        gl: WebGLRenderingContext,
        canvas: HTMLCanvasElement,
        a_Position: any
      ) => {
        let x = e.offsetX;
        let y = e.offsetY;
        x = ((x - canvas.width / 2) / canvas.width) * 2;
        y = ((canvas.height / 2 - y) / canvas.height) * 2;
        pointRef.current.push(x);
        pointRef.current.push(y);

        gl.clear(gl.COLOR_BUFFER_BIT);
        for (let i = 0; i < pointRef.current.length; i += 2) {
          gl.vertexAttrib3f(
            a_Position,
            pointRef.current[i],
            pointRef.current[i + 1],
            0.0
          );

          gl.drawArrays(gl.POINTS, 0, 1);
        }
      };

      mountRef.current.addEventListener("click", (e) => {
        handleClick(e, gl, mountRef.current!, a_Position);
      });

      gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
      // Specify the color for clearing <canvas>
      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      // Clear <canvas>
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Draw a point
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }, []);

  return <canvas width={800} height={800} ref={mountRef}></canvas>;
}

export default App;
