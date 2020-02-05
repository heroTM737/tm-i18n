import Vue from 'vue'

const $utils = {
    copyToClipboard (str) {
        const el = document.createElement('textarea')
        el.value = str
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
    }
}

Vue.prototype.$utils = $utils

export default $utils
