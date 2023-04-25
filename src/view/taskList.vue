<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="id" label="任务ID" width="180"/>
    <el-table-column prop="vehicleNum" label="可用车辆数"/>
    <el-table-column prop="capacity" label="车载最大容量"/>
    <el-table-column prop="speed" label="行驶速度"/>
    <el-table-column>
      <template #default="scope">
        <el-button type="primary" @click="info(scope.row)">详情</el-button>
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <el-button type="danger" @click="del(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button class="ebutton" type="primary" :icon="Edit" @click="open" >添加</el-button>
  <el-pagination layout="prev, pager, next, sizes"
                 v-model:current-page="pageNum"
                 :page-size="pageSize"
                 :page-sizes="[5, 10, 20, 50]"
                 @size-change="rowsChange"
                 :total="total"/>
</template>

<script>
import {reactive, toRefs, watch} from "vue";
import request from "../main";
import {ElMessage} from 'element-plus';
export default {
  name: "taskList",
  setup() {
    const data = reactive({
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 5
    })
    request({
      method: 'get',
      url: '/task/list',
      params: {
        pageSize: data.pageSize,
        pageNum: data.pageNum
      }
    }).then(res => {
      data.total = res.data.data.total
      data.tableData = res.data.data.list
    })
    watch(() => data.pageNum, () => {
      request({
        method: 'get',
        url: '/task/list',
        params: {
          pageSize: data.pageSize,
          pageNum: data.pageNum
        }
      }).then(res => {
        data.total = res.data.data.total
        data.tableData = res.data.data.list
      })
    })
    return {
      ...toRefs(data)
    }
  },
  methods: {
    rowsChange(val) {
      this.pageSize = val
      request({
        method: 'get',
        url: '/task/list',
        params: {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      }).then(res => {
        this.total = res.data.data.total
        this.tableData = res.data.data.list
      })
    },
    open() {
      this.$router.push('/task/create')
    },
    del(row) {
      request({
        method: 'post',
        url: '/task/del',
        params: {
          id: row.id
        }
      }).then(res => {
        if (res.data.code === 200) {
          ElMessage.success()
        } else {
          ElMessage.error(res.data.data)
        }

      }).catch(err => {
        ElMessage.error(err)
      })
    },
    info(row) {
      this.$router.push({
        name: 'task',
        query: {
          taskId : row.id
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
