// 矩阵变换
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_xformMatrix;
  void main() {
    gl_Position = u_xformMatrix * a_Position; // 设置坐标
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
  const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')

  const xformMatrix = new Matrix4()

  xformMatrix.setRotate(30.0, 0, 0, 1)
  xformMatrix.translate(0.3, 0, 0)

  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements)

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