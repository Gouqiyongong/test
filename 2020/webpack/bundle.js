const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, 'utf-8')

  const ast = parser.parse(body, {
    sourceType: 'module'
  })

  const deps = {}
  traverse(ast, {
    ImportDeclaration ({ node }) {
      const dirname = path.dirname(file)
      const sourceValue = node.source && node.source.value
      if (!sourceValue) return
      const absPath = path.relative(process.cwd(), path.join(dirname, sourceValue))
      deps[sourceValue] = absPath
    }
  })

  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })

  const moduleInfo = { file, deps, code }
  return moduleInfo
}

const parseModule = (file) => {
  const entry = getModuleInfo(file)

  const temp = [entry]
  const depsGraph = {}

  for (let i = 0; i < temp.length; i++) {
    const { deps } = temp[i]
    if (deps) {
      Object.values(deps).forEach(f => { temp.push(getModuleInfo(f)) })
    }
  }

  temp.forEach(moduleInfo => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code
    }
  })
  return depsGraph
}

const bundle = file => {
  const depsGraph = JSON.stringify(parseModule(file))
  return (function (graph) {
    function require (file) {
      function absRequire (realPath) {
        return require(graph[file].deps[realPath])
      }
      var exports = {}
      (function (require, exports, code) {
        eval(code)
      })(absRequire, exports, depsGraph.code)
      return exports
    }
  })(depsGraph)
}


bundle('./src/index.js')