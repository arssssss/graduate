<template>
  <el-form
      ref="ruleFormRef"
      label-width="150px"
      status-icon>
    <el-form-item label="可用车辆数">
      <el-input v-model="vehicleNum"/>
    </el-form-item>
    <el-form-item label="最大装载量">
      <el-input v-model="capacity"/>
    </el-form-item>
    <el-form-item label="行驶速度(默认为1)">
      <el-input v-model="speed"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">创建</el-button>
      <el-button @click="resetForm">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {reactive, toRefs} from "vue";
import request from "../main";
import {ElMessage} from 'element-plus';
export default {
  name: "taskCreate",
  setup() {
    const data = reactive({
      id: '',
      vehicleNum: '',
      capacity: '',
      speed: 1
    })

    return {
      ...toRefs(data)
    }
  },
  methods: {
    onSubmit(){
      const param = {
        vehicleNum : this.vehicleNum,
        capacity : this.capacity,
        speed : this.speed
      }
      request({
        method:'post',
        url:'/task/add',
        header:{
          'Content-Type': 'application/json'
        },
        data: param
      }).then(res=>{
        const data = res.data
        if(data.code === 200){
          ElMessage.success(data.data)
        }else{
          ElMessage.error(data.data)
        }
      }).catch(err=>{
        ElMessage.error(err)
      })
    },
    resetForm(){
      this.id = ''
      this.vehicleNum = ''
      this.capacity = ''
      this.speed =1
    }
  }

}
</script>

<style scoped>
.ebutton{
  margin: 10px 10px;
}
</style>
