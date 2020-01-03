import Vue from 'vue'

const roles = {
    USER: 'user_group',
    ADMIN: 'admin_group',
    SALE: 'sale_group',
    MARKETING: 'marketing_group'
}

const env = {
    DEV: 'development',
    STA: 'staging',
    PRO: 'production'
}

const projectType = {
    POSTPAID: 'postpaid',
    PREPAID: 'prepaid'
}

const $const = {
    roles: roles,
    env: env,
    projectType: projectType,
    LIMIT_USAGE: 'Limit',
    NO_LIMIT_USAGE: 'Unlimit',
    COMPLETED: 'completed',
    ACTIVE: 'active',
    WAITING: 'waiting',
    DRAFT: 'draft',
    CANCELED: 'canceled',
    TOKEN_KEY: 'jwToken',
    MAX_PROJECTS: 3,
    DATE_PICKER_FORMAT: 'YYYY-MM-DD',
    ROOT_NAME: '_ROOT'
}

Vue.prototype.$const = $const

export default $const
