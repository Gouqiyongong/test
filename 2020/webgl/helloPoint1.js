// 顶点着色器
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main() {
    gl_Position = a_Position; // 设置坐标
    gl_PointSize = a_PointSize;
  }
`
// 片元着色器
const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`
function main () {
  const canvas = createCanvas()
  const gl = canvas.getContext('webgl')
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return
  }

  // 获着色器变量
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  if (a_PointSize === -1 || a_Position === -1) return
  if (!u_FragColor) return

  gl.vertexAttrib1f(a_PointSize, 10.0)
  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const g_points = []
  const g_color = []
  canvas.addEventListener('click', e => {
    let x = e.clientX,
        y = e.clientY,
        rect = e.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2)
    y = ((canvas.height / 2) - (y - rect.top)) / (canvas.height / 2)
    gl.clear(gl.COLOR_BUFFER_BIT)
    g_points.push([x, y])
    if (x >= 0 && y >= 0) {
      g_color.push([1.0, 0.0, 0.0, 1.0])
    } else if (x < 0 && y < 0) {
      g_color.push([0.0, 1.0, 0.0, 1.0])
    } else {
      g_color.push([1.0, 1.0, 1.0, 1.0])
    }
    for (let i = 0; i < g_points.length; i += 1) {
      gl.vertexAttrib3f(a_Position, ...g_points[i], 0.0)
      gl.uniform4f(u_FragColor, ...g_color[i])
      gl.drawArrays(gl.POINTS, 0, 1)
    }
  })
    
    
      // gl.vertexAttrib4f(a_Position, 0.0, 0.0, 0.0, 1.0)
      // gl.vertexAttrib1f(a_PointSize, 20.0)
    
      // gl.clearColor(0.0, 0.0, 0.0, 1.0)
      // gl.clear(gl.COLOR_BUFFER_BIT)
    
      // gl.drawArrays(gl.POINTS, 0, 1)
}
