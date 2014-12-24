utility =
  diffObject : (oldObject={}, newObject={}, {flat, ordered}={})=>
    unique = (v,i,self)-> i is self.indexOf v
    allKeys = Object.keys(oldObject)
      .concat(Object.keys(newObject))
      .filter unique

    result = {}
    for key in allKeys
      oldValue = oldObject[key]
      newValue = newObject[key]

      if oldValue and not newValue
        result[key] = 'removed'

      else if newValue and not oldValue
        result[key] = 'added'

      else if (oldValue instanceof Function) or (newValue instanceof Function)
        throw 'Function not allowed in diff!'

      else if (oldValue instanceof Object) and (newValue instanceof Object)

        if not ordered and (oldValue instanceof Array) and (newValue instanceof Array)
          result[key] = utility.diffArray oldValue, newValue

        else if flat
          result[key] = oldValue is newValue

        else
          result[key] = utility.diffObject oldValue, newValue

      else if oldValue isnt newValue
        result[key] = 'modified'
    return result

  diffArray : (oldArray=[], newArray=[], {flat, ordered}={})=>
    result={}
    if not ordered
      {
        added : newArray.filter (v)-> v not in oldArray
        removed : oldArray.filter (v)-> v not in newArray
      }
    else
      utility.diffObject oldArray, newArray, {flat, ordered}

  mixin : (dest, srcs...)=>
    for src in srcs
      for key, value in src
        if dest[key]
          throw "#{key} already exists, cannot mix"
        dest[key] = src[key]

module.exports = utility