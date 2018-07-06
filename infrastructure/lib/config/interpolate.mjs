const interpolate = (templateString, vars) =>
  templateString.replace(/\${(\w+)}/g, (match, p1) => (vars[p1] ? vars[p1] : ''))

export const interpolateAllValues = (object, vars) => {
  const newObject = {}
  Object.keys(object).forEach(key => {
    newObject[key] =
      typeof object[key] === 'string' ? interpolate(object[key], vars) : object[key]
  })
  return newObject
}

export default interpolate
