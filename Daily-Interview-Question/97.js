/*
React 和 Vue 的 diff 时间复杂度从 O(n^3) 优化到 O(n) ，
那么 O(n^3) 和 O(n) 是如何计算出来的？

diff 策略
  1.Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。(tree diff)
  2.拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。(component diff)
  3.对于同一层级的一组子节点，它们可以通过唯一 id 进行区分(element diff)

tree diff
  对树进行分层比较，两棵树只会对同一层次的节点进行比较。
  同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，
  不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。
  只有删除和创建，没有移动
  因此：应当尽量避免DOM节点跨层次修改  可能会发生节点的大规模删除和增加  会耗费性能

component diff 
  ·如果是同一类型的组件，按照原策略继续比较 virtual DOM tree。
  ·如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。
  ·对于同一类型的组件，有可能其 Virtual DOM 没有任何变化
    如果能够确切的知道这点那可以节省大量的 diff 运算时间
    因此 React 允许用户通过 shouldComponentUpdate() 来判断该组件是否需要进行 diff。

element diff
  ·INSERT_MARKUP，新的 component 类型不在老集合里， 即是全新的节点，需要对新节点执行插入操作。
  ·MOVE_EXISTING，在老集合有新 component 类型，且 element 是可更新的类型，
    generateComponentChildren 已调用 receiveComponent，这种情况下 
    prevChild=nextChild，就需要做移动操作，可以复用以前的 DOM 节点。
  ·REMOVE_NODE，老 component 类型，在新集合里也有，但对应的 element 不同则不能直接复用和更新，
    需要执行删除操作，或者老 component 不在新集合里的，也需要执行删除操作。
  
  在正常情况下  只能对新旧节点组里面的节点进行同位置对比  如不同  则该节点及其子节点会被完全删除掉
    在这种情况下十分低效  尤其是在大量相似节点队列里面  所有建议添加key值  方便进行比较而进行移动
  
  在key存在时候进行diff：
    ·首先对新集合的节点进行循环遍历，for (name in nextChildren)，通过唯一 key 可以判断新老集合中
      是否存在相同的节点，if (prevChild === nextChild)，如果存在相同节点，则进行移动操作，在移动时候
      对新老队列的相同节点的节点位置进行对比，如果老队列里面的节点位置比较靠前  则移动节点  靠后则不移动
      所有如果将最后一个节点移动到第一个  则会出现所有之前的节点都往后位移的情况  这是极端情况
    ·同时在位移遍历时如果新队列的节点不存在则创建 否则移动  最后遍历一次老集合  寻找需要删除的节点  删掉

总结
  ·React 通过制定大胆的 diff 策略，将 O(n3) 复杂度的问题转换成 O(n) 复杂度的问题；
  
  ·React 通过分层求异的策略，对 tree diff 进行算法优化；
  
  ·React 通过相同类生成相似树形结构，不同类生成不同树形结构的策略，对 component diff 进行算法优化；
  
  ·React 通过设置唯一 key的策略，对 element diff 进行算法优化；
  
  ·建议，在开发组件时，保持稳定的 DOM 结构会有助于性能的提升；
  
  ·建议，在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作，
    当节点数量过大或更新操作过于频繁时，在一定程度上会影响 React 的渲染性能。

 */