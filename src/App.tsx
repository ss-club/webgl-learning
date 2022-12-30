import { useEffect, useRef } from "react";
import { initShaders } from "./lib/cuon-utils";
import "./App.css";

function App() {
  const mountRef = useRef<HTMLCanvasElement>(null);

  var VSHADER_SOURCE =
    "void main() {\n" +
    "  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n" + // Set the vertex coordinates of the point
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

      // Specify the color for clearing <canvas>
      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      // Clear <canvas>
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Draw a point
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }, []);

  return <canvas width={400} height={400} ref={mountRef}></canvas>;
}

export default App;
