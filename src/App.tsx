import { useEffect, useRef } from "react";
import { initShaders } from "./lib/cuon-utils";
import "./App.css";

function App() {
  const mountRef = useRef<HTMLCanvasElement>(null);

  const pointRef = useRef<number[][]>([]);
  const colorRef = useRef<number[][]>([]);

  var VSHADER_SOURCE =
    "attribute vec4 a_Position;\n" +
    "void main() {\n" +
    "  gl_Position = a_Position;\n" + // Set the vertex coordinates of the point
    "  gl_PointSize = 10.0;\n" + // Set the point size
    "}\n";

  // Fragment shader program
  var FSHADER_SOURCE =
    "precision mediump float;\n" +
    "uniform vec4 u_FragColor;\n " +
    "void main() {\n" +
    "  gl_FragColor = u_FragColor;\n" + // Set the point color
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

      const u_FragColor = gl.getUniformLocation(
        (gl as any).program,
        "u_FragColor"
      );

      if (a_Position < 0) {
        console.log("failure to get a_Position");
        return;
      }

      if (!u_FragColor) {
        console.log("failure to get u_FragColor");
        return;
      }
      const handleClick = (
        e: MouseEvent,
        gl: WebGLRenderingContext,
        canvas: HTMLCanvasElement,
        a_Position: any,
        u_FragColor: WebGLUniformLocation
      ) => {
        let x = e.offsetX;
        let y = e.offsetY;
        x = ((x - canvas.width / 2) / canvas.width) * 2;
        y = ((canvas.height / 2 - y) / canvas.height) * 2;
        pointRef.current.push([x, y]);

        if (x >= 0.0 && y >= 0.0) {
          colorRef.current.push([1.0, 0.0, 0.0, 1.0]);
        } else if (x < 0.0 && y < 0.0) {
          colorRef.current.push([0.0, 1.0, 0.0, 1.0]);
        } else {
          colorRef.current.push([0.0, 0.0, 1.0, 1.0]);
        }

        gl.clear(gl.COLOR_BUFFER_BIT);
        for (let i = 0; i < pointRef.current.length; i++) {
          gl.vertexAttrib3f(
            a_Position,
            pointRef.current[i][0],
            pointRef.current[i][1],
            0.0
          );
          gl.uniform4f(
            u_FragColor,
            colorRef.current[i][0],
            colorRef.current[i][1],
            colorRef.current[i][2],
            colorRef.current[i][3]
          );

          gl.drawArrays(gl.POINTS, 0, 1);
        }
      };

      mountRef.current.addEventListener("click", (e) => {
        handleClick(e, gl, mountRef.current!, a_Position, u_FragColor);
      });

      // Specify the color for clearing <canvas>
      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      // Clear <canvas>
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Draw a point
    }
  }, []);

  return <canvas width={800} height={800} ref={mountRef}></canvas>;
}

export default App;
