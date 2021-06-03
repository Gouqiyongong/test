function createCanvas (w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w || 400
  canvas.height = h || 400
  document.querySelector('body').appendChild(canvas)
  return canvas
}