import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import {router} from './router/index';
import axios from 'axios';
import 'element-plus/theme-chalk/index.css'
import VueAMap, {initAMapApiLoader} from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'


initAMapApiLoader({
    key: '65cb1d090607ab551626607f7d874cb0',
    securityJsCode:'f66f4bb84d96832634a4281395d90a6e',
    plugin: ['AMap.Driving']
})

const  app=createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(VueAMap)
app.mount('#app')

const request = axios.create({
    timeout: 50000
})

export default request
