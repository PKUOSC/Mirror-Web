const resultComps = {}
let requireComponent = require.context(
  './',
  false,
  /\.vue$/
)
requireComponent.keys().forEach(fileName => {
  let comp = requireComponent(fileName)
  resultComps[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
})
export default resultComps
