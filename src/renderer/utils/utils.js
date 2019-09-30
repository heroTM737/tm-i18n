import Vue from 'vue'

const $utils = {
  getHostSource () {
    let protocol = window.location.protocol
    let hostname = window.location.hostname
    let port = window.location.port ? ':' + window.location.port : ''
    return protocol + '//' + hostname + port
  },
  copyToClipboard (str, notificationText) {
    const el = document.createElement('textarea')
    el.value = str
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    if (notificationText !== null && notificationText !== undefined) {
      window.vueapp.$appService.toastSuccess(notificationText)
    }
  },
  isMobile () {
    return window.vueapp.$vuetify.breakpoint.name === 'xs'
  },
  isTablet () {
    return (
      window.vueapp.$vuetify.breakpoint.name === 'sm' ||
            window.vueapp.$vuetify.breakpoint.name === 'md'
    )
  },
  isPC () {
    return (
      window.vueapp.$vuetify.breakpoint.name === 'lg' ||
            window.vueapp.$vuetify.breakpoint.name === 'xl'
    )
  },
  isNotMobile () {
    return !this.isMobile()
  },
  convertPagination (data) {
    let pagination = {
      page: data.page,
      rowsPerPage: data.page_size,
      totalItems: data.count
    }
    if (data.ordering) {
      if (data.ordering.startsWith('-')) {
        pagination.descending = true
        pagination.sortBy = data.ordering.substring(1)
      } else {
        pagination.descending = false
        pagination.sortBy = data.ordering
      }
    } else {
      pagination.descending = false
      pagination.sortBy = ''
    }
    return pagination
  },
  isEqualValue (o1, o2) {
    return JSON.stringify(o1) === JSON.stringify(o2)
  },
  colorSamples: [
    '#87BF40',
    '#7840BF',
    '#BF4078',
    '#40BF87',
    '#B7BF40',
    '#4840BF',
    '#BF6840',
    '#4097BF',
    '#58BF40',
    '#A740BF',
    '#40BF4C'
  ]
}

Vue.prototype.$utils = $utils

export default $utils
