function patch(oldVNode, vnode, parentElm) {
  if (!oldVNode) {
    addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
  } else if (!vnode) {
    removeVnodes(parentElm, vnode, 0, vnode.length - 1)
  } else {
    if (sameVnode(oldVNode, vnode)) {
      patchVnode(oldVNode, vnode);
    } else {
      removeVnodes(parentElm, oldVNode, 0, oldVNode.length - 1);
      addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
  }
  }
}

// 节点合并
function patchVnode (oldVNode, vnode) {
  if (oldVNode === vnode) {
    return;
  }

  if (vnode.isStatic && oldVNode.isStatic && vnode.key === oldVNode.key) {
    vnode.elm = oldVNode.elm;
    vnode.componentInstance = oldVNode.componentInstance;
    return;
  }

  const elm = vnode.elm = oldVNode.elm;
  const oldCh = oldVNode.children;
  const ch = vnode.children;
  // 文本节点处理
  if (vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  } else {
    if (oldVNode && vnode && (oldCh !== ch)) {
      // 子节点合并
      updateChildren(elm, oldCh, ch);
    } else if (ch) {
      if (oldVNode.text) nodeOps.setTextContent(elm, '');
      addVnodes(elm, null, ch, 0, ch.length - 1);
    } else if (oldCh) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    } else if (oldVNode.text) {
      nodeOps.setTextContent(elm, '');
    }
  }
}

function sameVnode(a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    !!a.data === !!b.data &&
    sameInputType(a, b)
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') return true;
  return (a.data && a.data.attrs && a.data.attrs.type) === ((b.data && b.data.attrs && b.data.attrs.type))
}

function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx) {
  for (; startIdx < endIdx; startIdx++) {
    creatElm(vnodes[startIdx], parentElm, refElm);
  }
}

function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx < endIdx; startIdx++) {
    if (vnodes[startIdx]) {
      removeElm(vnodes[startIdx].elm);
    }
  }
}

function removeElm (el) {
  const parent = nodeOps.parentNode(el);
  if (parent) {
    nodeOps.removeChild(parent, el);
  }
}

function creatElm (vnode, parentElm, refElm) {
  if (vnode.tag) {
    insert(parentElm, nodeOps.createElement(vnode.tag), refElm);
  } else {
    insert(parentElm, nodeOps.createTextNode(vnode.text), refElm);
  }
}

function insert (parentElm, elm, ref) {
  if (parentElm) {
    if (ref && ref.parentNode === parentElm) {
      nodeOps.insertBefore(parentElm, ele, ref);
    } else {
      nodeOps.appendChild(parentElm, elm);
    }
  }
}

function updateChildren (parentElm, oldCh, newCh) {
  let oldStartIdx = 0,
      newStartIdx = 0,
      oldEndIdx = oldCh.length - 1,
      newEndIdx = ch.length - 1,
      oldStartVnode = oldCh[0],
      newStartVnode = ch[0],
      oldEndVnode = oldCh[oldEndIdx],
      newEndVnode = ch[newEndIdx],
      oldKeyToIdx,
      idxInOld,
      elmToMove,
      refElm;

  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[++oldEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = ch[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = ch[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode);
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = ch[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode);
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = ch[++newStartIdx];
    } else {
      let elmToMove;
      // 建立当前old节点的key： index对照表
      if (!oldKeyToIdx) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      // 当前开始节点在老节点对照表中的位置
      idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null;
      // 如果不存在  则新建节点
      if (!idxInOld) {
        createElm(newStartVnode, parentElm);
        newStartVnode = ch[++newStartIdx];
      } else {
        elmToMove = oldCh[idxInOld];
        // 新节点在老的未对比节点列表中存在  且可复用  合并节点  删除当前位置老节点  将其移动到新的位置
        if (sameVnode(elmToMove, newStartVnode)) {
          patchVnode(elmToMove, newStartVnode);
          oldCh[idxInOld] = undefined;
          nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
          newStartVnode = ch[++newStartIdx];
          // 新节点没有可复用的老节点  创建新节点
        } else {
          createElm(newStartVnode, parentElm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
  }
}

function createElm (vnode, parentElm, refElm) {
  if (vnode.tag) {
    insert(parentElm, nodeOps.createElement(vnode.tag), refElm);
  } else {
    insert(parentElm, nodeOps.createTextNode(vnode.text), refElm);
  }
}

function isDef (str) {
  return !!str;
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; i++) {
    key = children[i].key
    if (isDef(key)) {
      map[key] = i;
    }
  }
  return map;
}

const nodeOps = {
  createElement (tag) {},
  createTextNode (text) {},
  setTextContent () {},
  parentNode (el) {},
  removeChild (parent, el) {},
  nextSibling () {},
  insertBefore (parentElm, ele, ref) {},
  appendChild (parentElm, ele) {}
}