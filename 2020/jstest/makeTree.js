let arrData = [
  {
    id: 3,
    name: 'a',
    parentId: 1
  },
  {
    id: 2,
    name: 'b',
    parentId: 2
  },
  {
    id: 4,
    name: 'c',
    parentId: 1
  },
  {
    id: 5,
    name: 'd',
    parentId: 4
  },
  {
    id: 6,
    name: 'e',
    parentId: 4
  }, 
  {
    id: 7,
    name: 'f',
    parentId: 6
  },
  {
    id: 8,
    name: 'g',
    parentId: 3
  },
  {
    id: 9,
    name: 'h',
    parentId: 5
  },
  {
    id: 10,
    name: 'i',
    parentId: 6
  }
];

function makeTree (arr) {
  const tree = [];
  const getParent = (item, t) => {
    const parent = t.find(i => {
      if (i.id === item.parentId) {
        return true;
      }
      if (t.children && t.children.length) {
        return getParent(item, t.children);
      }
      return false;
    });
    return parent;
  }

  for (let i = 0; i < arr.length; i++) {
    const parent = getParent(arr[i], tree) || tree;
    const children = parent === tree ? tree : (parent.children || (parent.children = []));
    children.push(arr[i]);
  }
  return tree;
}

const tree = makeTree(arrData);
console.log(JSON.stringify(tree, '', '\t'));