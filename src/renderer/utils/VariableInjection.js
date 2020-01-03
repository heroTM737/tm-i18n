const replaceAll = (text, target, value) => {
    return text.split(target).join(value)
}
export const inject = (text, variableMap) => {
    let result = text
    for (let i in variableMap) {
        let value = variableMap[i] ? variableMap[i] : ''
        result = replaceAll(result, '{{' + i + '}}', value)
        result = replaceAll(result, '{{ ' + i + ' }}', value)
    }
    return result
}
