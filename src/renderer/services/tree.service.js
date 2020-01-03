const TreeService = {
    readDataFromId (root, id) {
        if (!id) {
            return root
        }
        let activeRoot = root
        let split = id.split('.')
        let i = 0
        for (i = 0; i < split.length; i++) {
            let property = split[i]
            if (activeRoot[property]) {
                activeRoot = activeRoot[property]
            } else {
                break
            }
        }
        return i === split.length ? activeRoot : ''
    }
}

export default TreeService
