import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        path: "/", redirect: "/taskList"
    }, {
        //用例表
        path: "/taskList",
        name: "taskList",
        component: () => import("../view/taskList")
    }, {
        //创建用例
        path: "/task/create",
        name: "taskCreate",
        component: ()=> import("../view/taskCreate")
    }, {
        //具体用例
        path: "/task",
        name: "task",
        component: () => import("../view/task")
    },
    {
        path: "/instance",
        name: "instance",
        component: () => import("../view/instance")
    },
    {
        path: "/instanceList",
        name: "instanceList",
        component: () => import("../view/instanceList")
    }
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
