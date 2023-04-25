<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用例:{{ id }}</span>
          <el-button class="button" @click="calculation" text>计算</el-button>
        </div>
      </template>
      <div class="text item">最大可用车辆:{{ instance.vehicleNum }}辆</div>
      <div class="text item">车载容量:{{ instance.capacity }}吨</div>
      <div class="text item">行驶速度:{{ instance.speed }}米/分钟</div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>当前规划</span>
        </div>
      </template>
      <div class="text item" v-if="imgUrl===''" v-loading="loading">
        当前未生成解
      </div>
      <div class="hard" v-if="imgUrl!==''">
        <el-image  :src="imgUrl" :fit="fit[0]" />
      </div>
    </el-card>
    <el-table :data="instance.servicePoints" stripe style="width: 100%">
      <el-table-column prop="id" label="客户ID" width="180"/>
      <el-table-column prop="pointType" label="客户类型"/>
      <el-table-column prop="X" label="经度"/>
      <el-table-column prop="Y" label="纬度"/>
      <el-table-column prop="demand" label="载重量"/>
      <el-table-column prop="readyTime" label="起始时间"/>
      <el-table-column prop="dueTime" label="截止时间"/>
      <el-table-column prop="serviceTime" label="预计服务时间"/>
      <el-table-column prop="sibling" label="对应客户ID"/>
      <el-table-column prop="visited" label="是否已被访问"/>
    </el-table>
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import request from "../main";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "instance",
  setup() {
    const data = reactive({
      id: '',
      instance: '',
      imgUrl: '',
      fit:['fill', 'contain', 'cover', 'none', 'scale-down'],
      loading:false
    })
    data.id = useRoute().query.instanceId
    //查询用例信息
    request({
      method: 'get',
      url: '/test/info',
      params: {
        id: data.id
      }
    }).then(res => {
      if (res.status === 200 && res.data.code === 200) {
        data.instance = res.data.data
      } else {
        ElMessage.error("用例查询失败")
        setTimeout(2000)
        this.$router.push({
          name: 'instanceList',
        })
      }
    })
    return {
      ...toRefs(data)
    }
  },
  methods: {
    calculation() {
      this.loading = true
      request({
        method: 'post',
        url: '/test/plan',
        responseType:'blob',
        params: {
          id: this.id
        }
      }).then(res => {
        if (res.status === 200) {
          let blob = new Blob([res.data], {type: "image/png"});
          console.log(blob)
          let url = window.URL.createObjectURL(blob);
          console.log(url)
          this.imgUrl = url;
        } else {
          ElMessage.error("图片获取失败")
        }

      },res=>{
        ElMessage.error(res)
      })
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 20px;
  font-weight: bolder;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  height: 500px;
  width: 600px;
  display: inline-block;
  margin: 40px 40px;
}

.line {
  display: inline-flex;
}

.margin {
  margin: 10px 10px;
}

.map-page-container {
  width: 95%;
  height: 600px;
}

.result {
  display: inline-block;
}

.map-page-container {
  width: 700px;
  height: 600px;
}

.block {
  display: block;
}

.hard {
  overflow: hidden;
  height: 600px;
}
.ebutton{
  margin: 10px 10px;
}
</style>
