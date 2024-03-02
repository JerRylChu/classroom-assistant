<template>
  <div style="padding: 20px">
    <a-card>
      <a-row>
        <a-col :span="12">
          <a-input-search placeholder="文章标题" v-model="search.title"/>
        </a-col>
        <a-col span="8">
          <a-cascader :fieldNames="{label: 'name', value: 'id', children: 'children'}" placeholder="请选择专业" v-model="search.majorId" :options="options" />
        </a-col>
        <a-col span="4">
          <a-button @click="doSearch">查询</a-button>
        </a-col>
      </a-row>
      <a-list :bordered="false" style="text-align: start;" item-layout="vertical" size="small"  :data-source="articles">
        <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
          <a-list-item-meta >
            <a slot="title" @click="handleDetail(item.id)"><h3 style="margin-top: 5px">{{ item.title }}</h3></a>
            <!--            <a-avatar slot="avatar" :src="item.avatar" />-->
          </a-list-item-meta>
          <template slot="actions">
            <!--                  v-for="{ type, text } in actions" slot="actions"-->
            <!--                  <span :key="type" style="cursor: pointer">-->
            <!--                    <a-icon :type="type" theme="twoTone" style="margin-right: 8px;" />-->
            <!--                    {{ text }}-->
            <!--                  </span>-->
            <span class="ant-list-item-meta-description" >
                <a-popconfirm
                    title="确认取消收藏吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="delCollect(item.id)"
                >
                  <a><a-icon type="delete" theme="filled"/> &nbsp;&nbsp;&nbsp;&nbsp;取消收藏</a>
                </a-popconfirm>
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
  </div>
</template>

<script>
import request from "@/utils/request";
const BASE_URL = '/dev-api';

export default {
  name: "CollectArticle",
  data() {
    return{
      tip: '加载更多',
      options: [],
      search: {majorId:[], title: ''},
      articles: [],
      spin: false,
      current: 1
    }
  },
  created() {
    this.getSpecial();
    this.getArticle();
  },
  methods: {
    doSearch(){
      this.articles = [];
      this.current = 1;
      this.getArticle();
    },
    delCollect(id){
      request.get(BASE_URL+`/delCollect?userId=${this.$store.state.user.id}&articleId=${id}`).then(res=>{
          if(res.data.code === 200){
            this.$message.success("取消成功");
            this.articles = [];
            this.current = 1;
            this.getArticle()
          }else {
            this.$message.error("取消失败");
          }
      })
    },
    getMore(){
      this.getArticle();
    },
    getArticle(){
      this.spin = true;
      let major = 0;
      console.log(this.search)
      if(this.search.majorId.length !== 0){
        major = this.search.majorId[1];
      }
      request.get(BASE_URL+`/getCollectByUserId/${this.$store.state.user.id}?title=${this.search.title}&majorId=${major}&current=${this.current}&pageSize=10`).then(res=>{
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
    getSpecial(){
      request.get(BASE_URL+"/special/getSpecial").then(res=>{
        if(res.data.code === 200){
          this.options = res.data.data;
        }else {
          this.$message.warn("获取专业失败");
        }
      }).catch(res=>{
        this.$message.error("接口异常");
        console.log(res)
      })
    },
  }
}
</script>

<style scoped>

</style>