<template>
  <div>
    <div style="height: 650px">
      <a-layout>
        <!-- 导航 -->
        <a-row>
          <a-col :xs="0" :sm="24" :md="24" :lg="24" :xl="24">
            <div :style="{  zIndex: 1, width: '100%',}">
              <a-menu
                  mode="horizontal"
                  style="margin-bottom:5px; background-color:#1890FF;color:white"
              >
                <a-menu-item style="float: left;">
                  <h1 style="color: white;margin-top: 8px">ClassAssistant</h1>
                </a-menu-item>
                <a-menu-item style="float:right" >
                  <a-dropdown>
                    <a class="ant-dropdown-link">
                      <a-avatar @click="avatarClick" style="margin: 10px" :size="40" :src="this.$store.state.user.id === 0?src:this.$store.state.user.headIconUrl"/>
                    </a>
                    <a-menu slot="overlay" v-if="$store.state.user.id !== 0">
                      <a-menu-item>
                        <router-link to="/layout"><a-button type="link" >个人中心</a-button></router-link>
                      </a-menu-item>
                      <a-menu-item>
                        <router-link to="/"><a-button type="link" @click="handleLogout">退出</a-button></router-link>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </a-menu-item>
                <a-menu-item style="float:right;margin-top: 8px" >
                  <router-link to="/login" v-if="$store.state.user.id === 0">
                    <a-button  type="link" style="color: white;" >登录/注册</a-button>
                  </router-link>
                  <a-button type="link" style="color: white;" v-if="$store.state.user.id !== 0">欢迎您，{{$store.state.user.nickName}}</a-button>
                </a-menu-item>
              </a-menu>
            </div>
          </a-col>
        </a-row>
      </a-layout>
      <a-row>
        <a-col :xs="0" :sm="0" :md="1" :lg="1" :xl="1">
        </a-col>
        <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16" style="padding: 15px 20px 20px;">
          <a-row>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-input-search @change="handleChange" style="width: 100%" @search="onSearch" v-model="search.pattern"/>
            </a-col>
          </a-row>
          <div>
            <a-list :bordered="false" style="text-align: start" item-layout="vertical" size="small"  :data-source="articles">
              <a-list-item style="cursor: pointer" @click="handleDetail(item.id)" slot="renderItem" key="item.title" slot-scope="item, index">
                <a-list-item-meta >
                  <a slot="title" ><h3 style="margin-top: 5px">{{ item.title }}</h3></a>
                </a-list-item-meta>
                <span>{{item.description}}</span><br/>
                <template >
                  <span class="ant-list-item-meta-description" >
                    {{item.reads}}&nbsp;&nbsp;&nbsp;&nbsp;阅读&nbsp;&nbsp;&nbsp;&nbsp;·
                    {{item.comments}}&nbsp;&nbsp;&nbsp;&nbsp;评论&nbsp;&nbsp;&nbsp;&nbsp;·
                    {{item.stars}}&nbsp;&nbsp;&nbsp;&nbsp;赞同
                  </span>
                </template>
              </a-list-item>
            </a-list>
            <a-row style="text-align: center;margin-bottom: 10px;">
              <a v-show="!spin" @click="getMore">{{this.tip}}</a>
              <a-spin :spinning="spin"/>
            </a-row>
          </div>
        </a-col>
        <a-col :xs="0" :sm="0" :md="6" :lg="6" :xl="6">
          <a-list item-layout="vertical" style="margin-top: 10px" :data-source="userHot">
            <a-list-item slot="renderItem" key="item.id" slot-scope="item, index">
              <a-row>
                <a-col :span="24">
                  <a-row><a-col :span="24"><h3 style="text-align: start"><a @click="handleDetail(item.id)">{{item.title}}</a></h3></a-col></a-row></a-col>
              </a-row>
            </a-list-item>
            <div slot="header">
              <h3><b>社区热度排行榜</b><a @click="getHotList"><a-icon type="redo" style="color: #1890FF;margin-left: 15px;cursor: pointer" :spin="refresh"/></a></h3>
            </div>
          </a-list>
        </a-col>
      </a-row>
      <a-back-top />
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
const BASE_URL = '/dev-api';

export default {
name: "ArticleStream",
  data(){
    return{
      refresh: false,
      tip: '加载更多',
      spin: false,
      current: 1,
      userHot:[],
      specials: [],
      articles: [],
      // pagination: {
      //   onChange: page => {
      //     console.log(page);
      //   },
      //   pageSize: 10,
      //   position: 'both'
      // },
      actions: [
        { type: 'star-o', text: '156' },
        { type: 'like-o', text: '156' },
        { type: 'message', text: '2' },
      ],
      src: 'http://localhost:8081/dev-api/file/imgDownload/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      search: {specialId: 0, pattern: ''},
      isChange: false,
    }
  },
  created() {
    // this.getSpecial();
    this.androidLogin();
    this.getRecommendArticles();
    this.getHotList();
  },
  methods:{
    androidLogin(){
      // console.log(this.$route.query.id)
      if(this.$route.query.id !== undefined && /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)==true){
        request.get(BASE_URL+"/login/getUserInfo/"+this.$route.query.id)
        .then(res=>{
          console.log(res)
          if(res.data.code === 200){
            let info = {
              id:res.data.data.id,
              nickName:res.data.data.nickName,
              headIconUrl: res.data.data.headIconUrl,
              school: res.data.data.school,
              phoneNumber: res.data.data.phoneNumber,
              signature: res.data.data.signature,
              majorName: res.data.data.majorName
            }
            console.log(info)
            this.$store.commit('changeState',info);
          }
        })
      }
    },
    getHotList(){
      this.refresh = true;
      request.get(BASE_URL+'/article/getHotList').then(res=>{
        if(res.data.code === 200){
          this.userHot = res.data.data;
        }
        let that = this;
        setTimeout(function (){
          that.refresh = false;
        },1000)
      }).catch(e=>{
        let that = this;
        setTimeout(function (){
          this.refresh = false;
        },1000)
      })
    },
    handleChange(){
      if(this.search.pattern === ''){
        return ;
      }
      this.isChange = true;
    },
    getMore(){
      if(this.isChange){
        this.current = 1;
        this.articles = [];
      }
      this.current += 1;
      this.getRecommendArticles();
    },
    handleLogout(){
      this.$store.commit('changeState',{id:0, nickName:'', headIconUrl: '', school: '',phoneNumber: '', signature: '', majorName: ''});
      this.tip = "加载更多";
      sessionStorage.removeItem("state");
      this.articles = [];
      this.getRecommendArticles()
    },
    handleDetail(id){
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)==true){
        console.log("移动端");
        this.$router.push({
          path: '/articleDetail',
          query: {id:id}
        })
      }else {
        let data = this.$router.resolve({
          path: '/articleDetail',
          query: {id:id}
        })
        window.open(data.href,'_blank');
      }

    },
    onSearch(){
      if(this.search.pattern === ''){
        this.isChange = true;
      }
      if(this.isChange){
        this.current = 1;
        this.articles = [];
      }
      this.getRecommendArticles();
    },
    getRecommendArticles(){
      this.spin = true;
      let id;
      if(this.$route.query.id !== undefined && /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)==true){
        id = this.$route.query.id
      }else {
        id = this.$store.state.user.id
      }
      request.get(BASE_URL+`/article/getRecommendArticles/${id}?pattern=${this.search.pattern}&current=${this.current}&pageSize=10`).then(res=>{
        this.spin = false;
        if(res.data !== null && this.articles.length !== 0 && res.data.data.total === this.articles.length){
          this.$message.warn("已经到底啦,刷新页面发现更多文章哦")
        }
        this.articles = this.articles.concat(res.data.data.list)
        this.isChange = false;
      })
    },
    getSpecial(){
      request.get(BASE_URL+"/special/getSpecial").then(res=>{
        if(res.data.code === 200){
          this.specials.push({id: 0, name: '全部', parentId: 0, children: []})
          res.data.data.forEach(item => {this.specials.push(item)})
        }else {
          this.$message.warn("获取专业失败");
        }
      }).catch(res=>{

      })
    },
    avatarClick(){
      // this.$store.commit('changeState',10);
    },
    stateChange(state){
      this.isChecked = state;
    },
  }
}
</script>

<style scoped>
/* For demo */
.ant-carousel >>> .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
}

/*.demo-infinite-container {*/
/*  border: 0px solid #e8e8e8;*/
/*  border-radius: 4px;*/
/*  overflow: auto;*/
/*  padding: 8px 24px;*/
/*  height: 650px;*/
/*}*/
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>