<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>当前任务</span>
          <el-button class="button" @click="calculation" text>计算</el-button>
        </div>
      </template>
      <div class="text item">任务ID:{{id}}</div>
      <div class="text item">最大可用车辆:{{vehicleNum}}辆</div>
      <div class="text item">车载容量:{{capacity}}吨</div>
      <div class="text item">行驶速度:{{speed}}米/分钟</div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>当前规划</span>
          <el-button v-if="result!==''" class="button" @click="showFormVisible=true" text>在地图上显示</el-button>
        </div>
      </template>
      <div v-if="result===''">
          当前未生成解
      </div>
      <div class="hard">
        <el-scrollbar >
          <div  v-if="result!==''">
            <div class = 'line'>
              <div class="text item">路线数:{{result.routes.size}}</div>
              <div class="text item">总消耗:{{result.routes.map(rou=>rou.cost).reduce(function(prev, next, index, array) {return prev + next;})}}</div>
            </div>
            <el-table :data="result.routes" stripe style="width: 100%">
              <el-table-column prop="cost" label="路线消耗" width="180"/>
              <el-table-column prop="points" label="路线ID"/>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="id" label="客户ID" width="180"/>
    <el-table-column prop="pointType" :formatter='typeFormatter' label="客户类型"/>
    <el-table-column prop="x" label="经度"/>
    <el-table-column prop="y" label="纬度"/>
    <el-table-column prop="demand" label="载重量"/>
    <el-table-column prop="readyTime" label="起始时间"/>
    <el-table-column prop="dueTime" label="截止时间"/>
    <el-table-column prop="serviceTime" label="预计服务时间"/>
    <el-table-column prop="sibling" label="对应客户ID"/>
    <el-table-column prop="visited" label="是否已被访问"/>
    <el-table-column>
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">修改</el-button>
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <el-button type="danger" @click="del(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--修改客户-->
  <el-dialog v-model="updateFormVisible" draggable="true" title="客户修改">
    <el-form :model="updateCustomer">
      <div class="line">
        <el-form-item class="margin" label="经度" >
          <el-input v-model="updateCustomer.x" autocomplete="off" />
        </el-form-item>
        <el-form-item class="margin" label="纬度" >
          <el-input v-model="updateCustomer.y" autocomplete="off" />
        </el-form-item>
        <el-button class="margin" :icon="edit" @click="mapFormVisible = true,mapForKind = 'update'"/>
      </div>
      <el-form-item label="服务点类型">
        <el-select v-model="updateCustomer.pointType" >
          <el-option label="出发点" value="0" />
          <el-option label="取货点" value="1" />
          <el-option label="交货点" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="需求量(取货为正，送货为负)" >
        <el-input v-model="updateCustomer.demand" autocomplete="off" />
      </el-form-item>
      <el-form-item label="起始时间" >
        <el-input v-model="updateCustomer.readyTime" autocomplete="off" />
      </el-form-item>
      <el-form-item label="截止时间" >
        <el-input v-model="updateCustomer.dueTime" autocomplete="off" />
      </el-form-item>
      <el-form-item label="服务时间" >
        <el-input v-model="updateCustomer.serviceTime" autocomplete="off" />
      </el-form-item>
      <el-form-item label="对应服务点">
        <el-input v-model="updateCustomer.sibling" autocomplete="off" />
      </el-form-item>
      <el-form-item label="当前状态">
        <el-select v-model="updateCustomer.visited">
          <el-option label="已服务" value=true />
          <el-option label="未服务" value=false />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateFormVisible = false">取消</el-button>
        <el-button type="primary" @click="update">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <!--添加客户-->
  <el-button class="ebutton" type="primary" @click="addFormVisible = true" >添加新客户</el-button>
  <el-dialog v-model="addFormVisible" draggable="true" title="客户添加">
    <el-form :model="addCustomer">
      <div class="line">
        <el-form-item class="margin" label="经度" >
          <el-input v-model="addCustomer.x" autocomplete="off" />
        </el-form-item>
        <el-form-item class="margin" label="纬度" >
          <el-input v-model="addCustomer.y" autocomplete="off" />
        </el-form-item>
        <el-button class="margin" :icon="edit" @click="mapFormVisible = true,mapForKind = 'add'"/>
      </div>
      <el-form-item label="服务点类型">
        <el-select v-model="addCustomer.pointType" >
          <el-option label="出发点" value="0" />
          <el-option label="取货点" value="1" />
          <el-option label="交货点" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="需求量(取货为正，送货为负)" >
        <el-input v-model="addCustomer.demand" autocomplete="off" />
      </el-form-item>
      <el-form-item label="起始时间" >
        <el-input v-model="addCustomer.readyTime" autocomplete="off" />
      </el-form-item>
      <el-form-item label="截止时间" >
        <el-input v-model="addCustomer.dueTime" autocomplete="off" />
      </el-form-item>
      <el-form-item label="服务时间" >
        <el-input v-model="addCustomer.serviceTime" autocomplete="off" />
      </el-form-item>
      <el-form-item label="对应服务点">
        <el-input v-model="addCustomer.sibling" autocomplete="off" />
      </el-form-item>
      <el-form-item label="当前状态">
        <el-select v-model="addCustomer.visited">
          <el-option label="已服务" value=true />
          <el-option label="未服务" value=false />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="add">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <!--根据地图选择位置-->
  <el-dialog v-model="mapFormVisible" draggable="true" title="双击地图获取地址">
    <div class="map-page-container">
      <el-amap :center="center" :zoom="zoom" @init="init">
        <el-amap-control-scale :visible="true"></el-amap-control-scale>
      </el-amap>
    </div>
  </el-dialog>
  <!--显示结果集-->
  <el-dialog v-model="showFormVisible" draggable="true" title="路线显示">
    <div class="result">
      <div class="map-page-container">
        <el-amap :center="center" :zoom="zoom" @init="show">
          <el-amap-control-scale :visible="true"></el-amap-control-scale>
        </el-amap>
      </div>
    </div>
  </el-dialog>
  <el-pagination layout="prev, pager, next, sizes"
                 v-model:current-page="pageNum"
                 :page-size="pageSize"
                 :page-sizes="[5, 10, 20, 50]"
                 @size-change="rowsChange"
                 :total="total"/>
</template>

<script>
import {reactive, toRefs , watch} from "vue";
import request from "../main";
import {ElMessage} from 'element-plus';
import { useRoute } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "task",
  setup() {
    const data = reactive({
      id:0,
      vehicleNum:'',
      capacity:'',
      speed:'',
      tableData:[],
      pageSize: 20,
      pageNum: 1,
      total: 5,
      addFormVisible:false,
      updateFormVisible:false,
      mapFormVisible:false,
      showFormVisible:false,
      mapForKind:'',
      center:[121.59996, 31.197646],
      zoom:12,
      map:'',
      addCustomer:{
        id:'',
        taskId:useRoute().query.taskId,
        pointType:'',
        x:'',
        y:'',
        demand:'',
        readyTime:'',
        dueTime:'',
        serviceTime:'',
        sibling:'',
        visited:''
      },
      edit:Edit,
      updateCustomer:{
        id:'',
        taskId:useRoute().query.taskId,
        pointType:'',
        x:'',
        y:'',
        demand:'',
        readyTime:'',
        dueTime:'',
        serviceTime:'',
        sibling:'',
        visited:''
      },
      result:'',
      resultMap:''
    })

    data.id = useRoute().query.taskId
    /** 获取任务信息 **/
    request({
      method: 'get',
      url: '/task/'+data.id,
    }).then(res => {
      if(res.status === 200){
        data.vehicleNum = res.data.data.vehicleNum
        data.capacity = res.data.data.capacity
        data.speed = res.data.data.speed
      }else{
        ElMessage.error(res.data)
      }
    })
    /** 获取客户信息 **/
    request({
      method:'get',
      url:'/customer/list',
      params:{
        pageSize: data.pageSize,
        pageNum: data.pageNum,
        taskId: data.id
      }
    }).then(res=>{
      if(res.status === 200){
        data.total = res.data.data.total
        data.tableData = res.data.data.list
      }else {
        ElMessage.error(res.data)
      }
    })
    /** 分页跳转 **/
    // eslint-disable-next-line no-unused-vars
    watch(() => data.pageNum, (v1, v2) => {
      request({
        method: 'get',
        url: '/customer/list',
        params: {
          taskId : data.id,
          pageSize: data.pageSize,
          pageNum: data.pageNum
        }
      }).then(res => {
        data.total = res.data.data.total
        data.tableData = res.data.data.list
      })
    })
    return {...toRefs(data)}
  },
  methods: {
    rowsChange(val) {
      this.pageSize = val
      request({
        method: 'get',
        url: '/customer/list',
        params: {
          taskId : this.id,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      }).then(res => {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
      })
    },
    add(){
      request({
        method:'post',
        url:'customer/add',
        data:this.addCustomer
      }).then(res=>{
        this.addFormVisible = false
        if(res.status === 200){
          ElMessage.success("添加成功")
          location.reload();
        }else{
          ElMessage.error(res.data)
        }
      })
    },
    update(){
      request({
        method:'post',
        url:'customer/update',
        data:this.updateCustomer
      }).then(res=>{
        this.addFormVisible = false
        if(res.status === 200){
          ElMessage.success("修改成功")
          location.reload();
        }else{
          ElMessage.error(res.data)
        }
      })
    },
    open(row){
      this.updateCustomer = row
      this.updateFormVisible = true
    },
    del(row){
      request({
        method: 'post',
        url: '/customer/del',
        params: {
          id: row.id
        }
      }).then(res => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功")
          location.reload();
        } else {
          ElMessage.error(res.data.data)
        }

      }).catch(err => {
        ElMessage.error(err)
      })
    },
    init(map){
      this.map = map
      this.map.on('dblclick', this.dbClick)
    },
    dbClick(e) {
      const params = {
        key: 'dc839fdcdd8587eec8a3cca1d85d1ca7',
        location: e.lnglat.getLng() + ',' + e.lnglat.getLat()
      }
      request({
        method: 'get',
        url: '/amap/regeo',
        params: params
      }).then(res => {
        if (res.status === 200 && res.data.status === '1' && res.data.regeocode.formatted_address !== '') {
         const address =  res.data.regeocode.addressComponent.streetNumber.location.split(",")
          if(this.mapForKind === 'update'){
            this.updateCustomer.x = address[0]
            this.updateCustomer.y = address[1]
          }else{
            this.addCustomer.x = address[0]
            this.addCustomer.y = address[1]
          }
        } else {
          ElMessage.info("找不到该地名")
        }
      }, res => {
        ElMessage.info("网络异常:"+res.data)
      })
      this.mapFormVisible = false
    },
    /** 计算结果 **/
    calculation(){
      const flag = this.tableData.map(cus=>cus.visited).find(visit=>visit === true)
      /** 是否尚未有解 **/
      if(typeof flag === 'undefined' || this.result === ''){
        const data = {
          servicePoint:this.tableData,
          vehicleNum:this.vehicleNum,
          capacity:this.capacity,
          speed:this.speed
        }
        request({
          method: 'post',
          url: '/vrp/plan',
          data:data
        }).then(res => {
          if(res.status === 200){
            this.result = res.data.data
          }else{
            ElMessage.error("结果计算出错:"+res.data.data)
          }
        })
      }else{
        const data = {
          result:this.result,
          servicePoint:this.tableData,
          vehicleNum:this.vehicleNum,
          capacity:this.capacity,
          speed:this.speed
        }
        request({
          method: 'post',
          url: '/vrp/insert',
          data:data
        }).then(res => {
          if(res.status === 200){
            this.result = res.data.data
          }else{
            ElMessage.error("结果计算出错:"+res.data.data)
          }
        })
      }
    },
    /** 绘制路线 **/
    show(map){
      this.resultMap = map
      this.resultMap.clearMap()

      const result = this.result
      const tableData = this.tableData
      const Amap = this.resultMap
      /** 出发点 **/
      const center = this.tableData.find(cus=>cus.pointType === 0)
      Amap.add(new AMap.Marker({
        position: [center.x,center.y], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        // icon: "http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
        title: '发货点'
      }));
      /** 路线 **/
      AMap.plugin('AMap.Driving', function () {
        const policy =  AMap.DrivingPolicy.LEAST_DISTANCE
        console.log(result)
        const paths = result.routes
        paths.forEach(route => {
          /** 端点（不包括出发点） **/
          const path =route.points
          path.forEach(order => {
            const customer = tableData.find(cus=>cus.id===order)
            Amap.add(new AMap.Marker({
              position: [customer.x,customer.y], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: "ID:"+order,
            }))
          })
          /** 路线（两端除外） **/
          for (var i = 0; i < path.length - 1; i++) {
            var driving = new AMap.Driving({
              map: Amap,
              policy: policy,
              hideMarkers:true
            });
            const start = tableData.find(cus=>cus.id === path[i])
            const end = tableData.find(cus=>cus.id === path[i+1])
            driving.search([start.x,start.y], [end.x,end.y], function (status, result) {
            })
          }
          /** 连接两边端点的路线 **/
          var start = new AMap.Driving({
            map: Amap,
            policy: policy,
            hideMarkers:true
          });
          var end = new AMap.Driving({
            map: Amap,
            policy: policy,
            hideMarkers:true
          });
          const center = tableData.find(cus=>cus.pointType === 0)
          const from = tableData.find(cus=>cus.id === path[0])
          const to = tableData.find(cus=>cus.id === path[path.length - 1])
          start.search([center.x,center.y],[from.x,from.y], function (status, result) {
          })
          end.search([to.x,to.y],[center.x,center.y], center, function (status, result) {
          })
        })
      })
    },
    typeFormatter(row, column, cellValue){
      if(cellValue===0){
        return '配送中心'
      }else if(cellValue===1){
        return '取货'
      }else if(cellValue===2){
        return '送货'
      }
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
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  height: 250px;
  width: 480px;
  display: inline-block;
  margin: 40px 40px;
}
.line{
  display: inline-flex;
}
.margin{
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
.block{
  display: block;
}
.hard{
  overflow:hidden;
  height: 200px;
}
.ebutton{
  margin: 10px 10px;
}
</style>
