<template>
  <div style="padding: 20px">
    <a-row>
      <a-col span="6">
        <a-row type="flex" justify="space-around" align="middle" style="margin-bottom: 20px">
          <a-col span="4"></a-col>
          <a-col span="10">
            <a-avatar shape="circle" :size="70" icon="user" :src="userInfo.src"></a-avatar>
          </a-col>
          <a-col span="6">
            <span style="font-size: 20px;">{{userInfo.nickName}}</span>
          </a-col>
          <a-col span="4"></a-col>
        </a-row>
        <div>
          <a-card title="个性签名">
            {{userInfo.signature}}
          </a-card>
          <a-card>
            <a-statistic title="文章总数" :value="homeInfo.articles" style="cursor: pointer"/>
          </a-card>
          <a-card>
            <a-statistic title="收到的赞" :value="homeInfo.stars" style="cursor: pointer"/>
          </a-card>
          <a-card>
            <a-statistic title="关注" :value="homeInfo.follows" style="cursor: pointer"/>
          </a-card>

        </div>
      </a-col>
      <a-col span="18">
        <a-card :bordered="false">
          <a-row style="margin: 8px">
            <a-col span="12"><a-input placeholder="输入文章标题查询" v-model="search.title"/></a-col>
            <a-col span="8">
              <a-select style="width: 200px" @change="selectChange">
                <a-select-option :value="0">
                  ----请选择----
                </a-select-option>
                <a-select-option v-for="item in options" :value="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col span="4"><a-button type="primary" @click="doSearch">查询</a-button></a-col>
          </a-row>
          <a-list :bordered="false" style="text-align: start;" item-layout="vertical" size="small"  :data-source="articles">
            <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
              <img v-if="item.img"
                   slot="extra"
                   width="130"
                   alt="logo"
                   :src="src"
              />
              <a-list-item-meta >
                <a slot="title" @click="handleDetail(item.id)"><h3 style="margin-top: 5px">{{ item.title }}</h3></a>
                <!--            <a-avatar slot="avatar" :src="item.avatar" />-->
              </a-list-item-meta>
              <span>{{item.description}}</span><br/>
              <template slot="actions">
                <!--                  v-for="{ type, text } in actions" slot="actions"-->
                <!--                  <span :key="type" style="cursor: pointer">-->
                <!--                    <a-icon :type="type" theme="twoTone" style="margin-right: 8px;" />-->
                <!--                    {{ text }}-->
                <!--                  </span>-->
                <span class="ant-list-item-meta-description" >
                    {{item.reads}}&nbsp;&nbsp;&nbsp;&nbsp;阅读&nbsp;&nbsp;&nbsp;&nbsp;·
                    {{item.comments}}&nbsp;&nbsp;&nbsp;&nbsp;评论&nbsp;&nbsp;&nbsp;&nbsp;·
                    {{item.stars}}&nbsp;&nbsp;&nbsp;&nbsp;赞同
                  </span>
              </template>
              <!--                <span v-html="item.articleContent"></span>-->
            </a-list-item>
          </a-list>
          <a-row style="text-align: center;margin-bottom: 10px;">
            <a v-show="!spin" @click="getMore">{{this.tip}}</a>
            <a-spin :spinning="spin"/>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-back-top />
  </div>
</template>

<script>
import request from "@/utils/request";
const BASE_URL = '/dev-api';

export default {
  name: "ArticleStream",
  data(){
    return{
      homeInfo:{
        stars: 0,
        articles: 0,
        follows: 0
      },
      userInfo:{src:'',nickName:'',signature: ''},
      userId: this.$route.query.id,
      tip: '加载更多',
      articles: [],
      spin: false,
      options: [],
      search: {title: '', majorId: 0},
      current: 1,
    }
  },
  created() {
    this.getUserInfo();
    this.getHomeInfo();
    this.getArticle();
    this.getSpecial();
  },
  methods: {
    selectChange(value){
      this.search.majorId = value;
    },
    getUserInfo(){
      request.get(BASE_URL+"/login/getUserInfo/"+this.userId)
      .then(res=>{
        if (res.data.code === 200) {
          this.userInfo.src = res.data.data.headIconUrl;
          this.userInfo.nickName = res.data.data.nickName;
          this.userInfo.signature = res.data.data.signature;
        }
      })
    },
    getHomeInfo(){
      request.get(BASE_URL+"/login/getHomeInfo/"+this.userId)
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
    },
    getMore(){
      this.getArticle();
    },
    doSearch(){
      this.articles = [];
      this.current = 1;
      this.getArticle();
    },
    getSpecial(){
      request.get(BASE_URL+"/article/getSpecial?id="+this.userId).then(res=>{
        if(res.data.code === 200){
          this.options = res.data.data;
          console.log(this.options)
        }else {
          this.$message.warn("获取专业失败");
        }
      }).catch(res=>{
        this.$message.error("接口异常");
        console.log(res)
      })
    },
    // updateArticle(id){
    //   this.$router.push({path: '/add', query:{id:id}})
    // },
    getArticle(){
      this.spin = true;
      request.get(BASE_URL+`/article/getArticlesByUserId/${this.userId}?title=${this.search.title}&majorId=${this.search.majorId}&current=${this.current}&pageSize=10`).then(res=>{
        this.spin = false;
        if(this.articles != [] && res.data.data.total === this.articles.length){
          return ;
        }else {
          this.articles = this.articles.concat(res.data.data.list);
          this.current += 1;
        }
      })
    },
    handleDetail(id){
      let data = this.$router.resolve({
        path: '/articleDetail',
        query: {id:id}
      })
      window.open(data.href,'_blank');
    },
  }
}
</script>

<style scoped>

</style>