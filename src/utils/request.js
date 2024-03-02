import axios from 'axios'

const request = axios.create({
    baseURL: '/',
    timeout: 5*60*1000
})

export default request;