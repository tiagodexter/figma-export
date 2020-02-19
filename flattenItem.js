const flattenMessages = (nestedObject, prefix = '') => {
    if(nestedObject){
    return Object.keys(nestedObject).reduce((messages, key) => {
      const value = nestedObject[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        messages[prefixedKey] = value;
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      } 
      return messages;
    }, {});
  }
  }
  
module.exports = flattenMessages