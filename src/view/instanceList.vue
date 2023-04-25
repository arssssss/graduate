<template>
  <el-table :data="table" stripe style="width: 100%">
    <el-table-column  prop="id" label="测试用例" width="180"/>
    <el-table-column>
      <template #default="scope">
        <el-button type="primary" @click="info(scope.row.id)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>

</template>

<script>
import {reactive, toRefs } from "vue";
import request from "../main";
import {ElMessage} from 'element-plus';
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "instanceList",
  setup() {
    const data = reactive({
      table:[]
    })
    /** 获取用例信息 **/
    request({
      method: 'get',
      url: '/test/list',
    }).then(res => {
      console.log(res)
      if(res.status === 200 && res.data.code === 200){
        data.table = res.data.data

      }else{
        ElMessage.error(res.data)
      }
    })

    return {...toRefs(data)}
  },
  methods: {
    info(val) {
      this.$router.push({
        name: 'instance',
        query: {
          instanceId : val
        }
      })
    }
  }
}
</script>

<style scoped>
.ebutton{
  margin: 10px 10px;
}
</style>
