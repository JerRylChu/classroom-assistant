<template>
  <div>
    <a-card>
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="16">
          <a-row type="flex" justify="space-around" align="middle">
            <a-col span="10">
              <a-row>
                <a-avatar shape="circle" :size="70" icon="user" :src="this.$store.state.user.headIconUrl">
                  </a-avatar>
              </a-row>
              <a-row style="margin-top: 5px">{{this.$store.state.user.nickName}}</a-row>
            </a-col>
            <a-col span="14" style="text-align: start">
              <div v-if="signatureEditable" class="editable-cell-input-wrapper">
                <a-row type="flex" justify="space-around" align="middle">
                  <a-col span="18"><a-textarea v-model="value" @pressEnter="check" rows="2"></a-textarea></a-col>
                  <a-col span="3"><a class="c-theme" @click="onCancel">取消</a></a-col>
                </a-row>
              </div>
              <div v-else class="editable-cell-text-wrapper">
                <span style="font-size: 17px;text-align: start">{{ value || " " }}</span>
                <a-icon
                    type="edit"
                    theme="twoTone"
                    :style="{ fontSize: '18px',marginLeft: '5px' }"
                    class="editable-cell-icon"
                    @click="edit"
                />
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-button type="primary" @click="showModal">修改头像</a-button>
        </a-col>
      </a-row>


      <a-row style="margin-top: 40px;text-align: center">
        <a-col :span="8">学校:&nbsp;&nbsp;&nbsp;&nbsp;{{this.$store.state.user.school}}</a-col>
        <a-col :span="8">专业:&nbsp;&nbsp;&nbsp;&nbsp;{{this.$store.state.user.majorName}}</a-col>
        <a-col :span="8">手机号:&nbsp;&nbsp;&nbsp;&nbsp;{{this.$store.state.user.phoneNumber}}</a-col>
      </a-row>

    </a-card>
    <a-row>
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="8">
              <a-statistic title="文章总数" :value="homeInfo.articles" style="cursor: pointer"/>
            </a-col>
            <a-col :span="8">
              <a-statistic title="收到的赞" :value="homeInfo.stars" style="cursor: pointer">
                <template #suffix>
                  <a-icon type="like" />
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="8">
              <a-statistic title="关注" :value="homeInfo.follows" style="cursor: pointer"/>
            </a-col>
          </a-row>
<!--          :precision=""-->
        </a-card>
        <a-row style="background-color: white">
          <a-col span="12">
            <div id="articleType" :style="{height:'300px'}"></div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-modal v-model="visible" title="修改头像" @ok="handleOk" okText="确认" cancelText="取消">
      <a-upload
          name="file"
          :multiple="false"
          :action=action
          :headers="headers"
          @change="handleChange">
        <a-button> <a-icon type="upload" />点击上传</a-button>
      </a-upload>
    </a-modal>
  </div>
</template>

<script>
import request from "@/utils/request";
import * as echarts from "echarts";
const BASE_URL = '/dev-api';
export default {
name: "HomePage",
  data(){
    return{
      action:`http://localhost:8081/dev-api/file/avatar/${this.$store.state.user.id}`,
      headers: {
        authorization: 'authorization-text',
      },
      visible: false,
      value: this.$store.state.user.signature,
      signatureEditable: false,
      preValue: "",
      homeInfo:{
        stars: 0,
        articles: 0,
        follows: 0
      },
      lastUrl: '',
      articleType: '',
      option:{
        title: {
          text: '文章分类',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '详情',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  created() {
    // this.getUserInfo();

    this.getHomeInfo();
    this.getStatistic();
  },
  mounted() {
    this.drawLine();
  },
  watch:{
    option: {
      handler(newVal, oldVal){
        if (this.articleType) {
          if (newVal) {
            this.articleType.setOption(newVal);
          } else {
            this.articleType.setOption(oldVal);
          }
        } else {
          this.drawLine();
        }
      },
      deep: true //对象内部属性的监听，关键。
    },
  },
  methods:{
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        // this.$message.success(`${info.file.name} file uploaded successfully`);
        this.lastUrl=info.fileList[0].response.data;
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
      this.$store.commit('changeHeadIconUrl',this.lastUrl);
      location.reload();
    },
    getStatistic(){
      request.get(BASE_URL+`/article/getArticleType?id=${this.$store.state.user.id}`).then(res=>{
        this.option.series[0].data = res.data.data;
      })
    },
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      this.articleType = echarts.init(document.getElementById('articleType'));
      this.articleType.setOption(this.option,true);

      // let view = echarts.init(document.getElementById('view'));
      // view.setOption({
      //   title: {
      //     text: '近期访问',
      //     // subtext: '纯属虚构',
      //     left: 'center'
      //   },
      //   xAxis: {
      //     type: 'category',
      //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   series: [{
      //     data: [120, 200, 150, 80, 70, 110, 130],
      //     type: 'bar'
      //   }]
      // })
    },
    // 取消
    onCancel() {
      this.value = this.preValue;
      this.signatureEditable = false;
    },
    // 保存
    check() {
      let info = this.$store.state.user;
      info.signature = this.value;
      request.post(BASE_URL+"/user/updateSignature",info)
              .then(res=>{
                if(res.data.code === 200){
                  this.$store.commit('changeState',res.data.data)
                  this.signatureEditable = false;
                }else {
                  this.$message.warn(res.data.msg);
                }
              }).catch(e => {
                this.$message.error("接口异常");
      })
    },
    // 点击编辑
    edit() {
      this.preValue = this.value;
      this.signatureEditable = true;
    },
    getHomeInfo(){
      request.get(BASE_URL+"/login/getHomeInfo/"+this.$store.state.user.id)
      .then(res=> {
        if (res.data.code === 200) {
          if (res.data.code === 200) {
            this.homeInfo.stars = res.data.data.stars;
            this.homeInfo.articles = res.data.data.articles;
            this.homeInfo.follows = res.data.data.follows;
          }
        }
      }).catch(e=>{
        this.$message.warn("接口出错")
      })
    }
  },
}

</script>

<style scoped>

</style>