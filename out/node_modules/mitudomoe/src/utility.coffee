utility =
  
  isString : (obj)-> obj instanceof String or typeof obj is "string"
  isNumber : (obj)-> obj instanceof Number or typeof obj is "number"

  unique : (array)-> array.filter (v,i,self)-> i is self.indexOf v

  uniqueObjectKeys : (objs...)->
    keys = []
    keys.push.apply keys, Object.keys(obj) for obj in objs
    @unique keys

  diffObject : (oldObject={}, newObject={}, {flat, ordered}={})->
    allKeys = @uniqueObjectKeys oldObject, newObject

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
          result[key] = @diffArray oldValue, newValue

        else if flat
          result[key] = oldValue is newValue

        else
          result[key] = @diffObject oldValue, newValue

      else if oldValue isnt newValue
        result[key] = 'modified'
    return result

  diffArray : (oldArray=[], newArray=[], {flat, ordered}={})->
    result={}
    if not ordered
      {
        added : newArray.filter (v)-> v not in oldArray
        removed : oldArray.filter (v)-> v not in newArray
      }
    else
      @diffObject oldArray, newArray, {flat, ordered}

  mergeState : (base={}, delta={})->
    result = {}
    keys = @uniqueObjectKeys base, delta
    for key in keys
      if !(key of base)
        # added
        result[key] = delta[key]
      else if !(key of delta)
        # not exist in delta = inherit from base
        result[key] = base[key]
      else
        # both exist
        if delta[key] is null
          # remove key explicitly
          continue
        if @isString delta[key] or @isNumber delta[key] or delta[key] instanceof Array
          result[key] = delta[key]
        else if (base[key] instanceof Object) and (delta[key] instanceof Object)
          result[key] = @mergeState base[key], delta[key]
        else
          result[key] = delta[key] || base[key]
    return result

  mixin : (dest, srcs...)->
    for src in srcs
      for key, value in src
        if dest[key]
          throw "#{key} already exists, cannot mix"
        dest[key] = src[key]

for key, value of utility
  exports[key] = utility[key].bind utility