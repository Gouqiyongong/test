// 顶点着色器
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  uniform vec4 u_Translation;
  void main() {
    gl_Position = a_Position + u_Translation; // 设置坐标
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
  const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation')

  if (a_PointSize === -1 || a_Position === -1) return
  if (!u_FragColor) return
  const Tx = 0.5,
        Ty = 0.5,
        Tz = 0;

  gl.vertexAttrib1f(a_PointSize, 10.0)
  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0)
  gl.clearColor(0.0, 0.0, 1.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const vertices = new Float32Array([
    0.0, 0.5, -0.5, 0.0, 0.5, 0.0
  ])

  let n = 3

  // 初始化缓冲区函数
  initVertexBuffers(gl, vertices, n, a_Position)

  // gl.drawArrays(gl.POINTS, 0, n)
  // gl.drawArrays(gl.LINES, 0, n)
  // gl.drawArrays(gl.LINE_STRIP, 0, n)
  gl.drawArrays(gl.LINE_LOOP, 0, n)
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
  // gl.drawArrays(gl.TRIANGLE_FAN, 0, n)
  // gl.drawArrays(gl.TRIANGLE, 0, n)
}

function initVertexBuffers(gl, vertices, n, a_Position) {
  // 创建缓冲区 gl.
  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) return
  // 绑定缓冲区到gl.ARRAY_BUFFER顶点对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // 分配缓冲区给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  
  // 开启缓冲区变量
  gl.enableVertexAttribArray(a_Position)
}