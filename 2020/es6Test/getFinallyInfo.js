const levels = {
  1: function (list) {
    if (!list.some(i => i.slice(1) === '1')) return { code: 1, pokes: [] }
    const res = levels['2']()
    if (res.code === 0 && res.pokes.some(i => i.slice(1) === '1')) {
      return res
    }
    return { code: 1, pokes: [] }
  }
  2: function (list) {
    const res1 = levels['5']()
    if (res1.code !== 0) return res1
    const res2 = levels['6']()
    if (res2.code !== 0) return res2
    if (!res1.pokes || res1.pokes.length !== 5 || !res2.pokes || res2.pokes.length !== 5 || res1.pokes.some(i => !res2.some(j => i === j))) {
      return { code: 1, pokes: [] }
    }
    return res1
  }
  3: function (list) {
    let poke = null
    for (let i = 0, len = list.length - 3; i < len; i++) {
      const info = list[i].slice(1)
      let num = 1
      for (let j = i + 1; j < list.length; j++) {
        if (list[j].slice(1) === info) {
          if (++num === 4) break
        }
      }
      if (num === 4) {
        poke = list[i]
        break
      }
    }
    if (poke) {
      let max = null
      list.forEach(i => {
        if (i !== poke) {
          if (!max) {
            max = i
          } else if (compare(i > max)) {
            max = i
          }
        }
      })
      const n = poke.slice(1)
      return {
        code: 0,
        pokes: [`a${n}`, `b${n}`, `c${n}`, `d${n}`, max]
      }
    }
    return {
      code: 1,
      pokes: []
    }
  }
  4: function (list) {
    let poke = null
    let poke2 = null
    let poke3 = null
    for (let i = 0, len = list.length - 2; i < len; i++) {
      const info = list[i].slice(1)
      let pokeArr = [list[i]]
      for (let j = i + 1; j < list.length; j++) {
        if (list[j].slice(1) === info) {
          pokeArr.push(list[j])
          if (pokeArr.length === 3) break
        }
      }
      if (pokeArr.length === 3) {
        poke = pokeArr
        break
      }
    }
    if (poke) {
      for (let i = 0, len = list.length - 1; i < len; i++) {
        if (poke.some(item => item === list[i])) continue
        const info = list[i].slice(1)
        let pokeArr = [list[i]]
        for (let j = i + 1; j < list.length; j++) {
          if (list[j].slice(1) === info) {
            pokeArr.push(list[j])
            if (pokeArr.length === 2) break
          }
        }
        if (pokeArr.length === 2) {
          poke2 = pokeArr
          break
        }
      }
      if (poke2) {
        for (let i = 0, len = list.length - 1; i < len; i++) {
          if (poke.some(item => item === list[i]) || poke2.some(item => item === list[i])) continue
          const info = list[i].slice(1)
          let pokeArr = [list[i]]
          for (let j = i + 1; j < list.length; j++) {
            if (list[j].slice(1) === info) {
              pokeArr.push(list[j])
              if (pokeArr.length === 2) break
            }
          }
          if (pokeArr.length === 2) {
            poke3 = pokeArr
            break
          }
        }
        if (poke3 && compare(poke3[0], poke2[0])) {
          poke2 = poke3
        }
        return {
          code: 0,
          pokes: [...poke, poke2]
        }
      }
    }
    return {
      code: 1,
      pokes: []
    }
  }
  5: function (list) {
    let poke = null
    for (let i = 0, len = list.length - 5; i < len; i++) {
      const info = list[i].slice(0, 1)
      let pokeArr = [list[i]]
      for (let j = i + 1; j < list.length; j++) {
        if (list[j].slice(0, 1) === info) {
          pokeArr.push(list[j])
          if (pokeArr.length === 5) break
        }
      }
      if (pokeArr.length === 5) {
        poke = pokeArr
        break
      }
    }
    if (!poke) {
      return {
        code: 0,
        pokes: []
      }
    }
    poke.sort((a, b) => parseInt(a.slice(0)) < parseInt(b.slice(0)))
    return {
      code: 0,
      pokes: poke
    }
  }
  6: function (list) {
    let poke = null
    const list2 = _sort(list)
    let arr = []
    for (let i = 0, len = list2.length - 1; i < len; i++) {
      arr.push(list2[i])
      const aNum = parseInt(list2[i])
      const bNum = parseInt(list2[i + 1])
      if (aNum === 1 && bNum === 13 || aNum + 1 === bNum) {
        if (arr.length === 4) {
          arr.push(list2[i + 1])
          break
        }
        continue
      }
      arr = []
    }
    if (arr.length === 5) {
      return {
        code: 0,
        pokes: arr
      }
    }
    return {
      code: 1,
      pokes: []
    }
  }
  7: function (list) {
    let poke = null
    for (let i = 0, len = list.length - 2; i < len; i++) {
      const info = list[i].slice(1)
      let pokeArr = [list[i]]
      for (let j = i + 1; j < list.length; j++) {
        if (list[j].slice(1) === info) {
          pokeArr.push(list[j])
          if (pokeArr.length === 3) break
        }
      }
      if (pokeArr.length === 3) {
        poke = pokeArr
        break
      }
    }
    if (poke) {
      const num = poke[0].slice(1)
      let list2 = list.filter(i => i.slice(1) !== num)
      list2 = _sort(list2)
      return {
        code: 0,
        pokes: [...poke, list2.slice(0, 2)]
      }
    }
    return {
      code: 1,
      pokes: []
    }
  }
  8: function (list) {
    const obj = {}
    list.forEach(i => {
      const n = i.slice(1)
      (obj[n] || (obj[n] = [])).push(i)
    })
    let arr = Object.values(obj).filter(i => i.length > 1)
    if (arr.length >= 2) {
      const resArr = _sort(arr.map(i => i[0])).slice(0, 2).map(i => obj[i.slice(1)])
      res
    }
  }
  9: function (list) {}
  10: function (list) {}
}

function compare (poke1, poke2) {
  const num1 = poke1.slice(1)
  const num2 = poke2.slice(1)
  if (num1 === '1' && num2 !== '1') return true
  if (num1 === num2) return poke1.slice(0, 1) < poke2.slice(0, 1)
  return num1 > num2
}

function _sort (list) {
  return list.sort((a, b) => {
    const aNum = parseInt(a.slice(1))
    if (aNum === 1) return -1
    const bNum = parseInt(b.slice(1))
    if (bNum === 1) return 1
    return aNum > bNum ? -1 : 1
  })
}

function _verification (data) {
  if (!Array.isArray(data) || data.length < 2) return false
  for (let i = 0; i < data.length; i++) {
    if (!data[i] || !Array.isArray(data[i]) || data[i].length !== '7') return false
  }
  return true
}

// level 1, 2, 3, 4, 5, 6
function initLevel (info) {
  const levelKey = Object.keys(levels)
  for (let i = 0; i < levelKey.length; i++) {
    const res = levels[levelKey[i]] && levels[levelKey[i]]()
    if (res && res.code === 0) {
      info.level = levelKey[i]
      info.pokes = res.pokes
      return
    }
  }
}

function getFinallyInfo(data) {
  if (!_verification(data)) return {
    respCode: 1,
    respMsg: '参数不合规',
    respData: null
  }

  for (let i = 0, len = data.length; i < len; i++) {
    initLevel(data[i])
  }

}

const test = [
  {
    name: '1',
    list: ['a1, a2, a3, a4, a5, a6, b2']
  }
]
getFinallyInfo(test)

export default getFinallyInfo