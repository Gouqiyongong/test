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

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  if (a_PointSize === -1 || a_Position === -1) return
  if (!u_FragColor) return

  gl.vertexAttrib1f(a_PointSize, 10.0)
  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // 初始化缓冲区函数
  const n = initVertexBuffers(gl)

  // gl.drawArrays(gl.POINTS, 0, n)
  // gl.drawArrays(gl.LINES, 0, n)
  // gl.drawArrays(gl.LINE_STRIP, 0, n)
  // gl.drawArrays(gl.LINE_LOOP, 0, n)
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n)
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    0.0, 0.0, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5
  ])

  let n = 6
  // 创建缓冲区 gl.
  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) return
  // 绑定缓冲区到gl.ARRAY_BUFFER顶点对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

  // 分配缓冲区给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  
  // 开启缓冲区变量
  gl.enableVertexAttribArray(a_Position)
  return n
}