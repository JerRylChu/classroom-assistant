<template>
  <div style="padding: 20px">
    <a-card>
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
                    <a @click="updateArticle(item.id)" style="margin-right: 8px;"><a-icon type="edit" theme="filled" /> &nbsp;&nbsp;&nbsp;&nbsp;修改</a>
                <a-popconfirm
                    title="确认删除吗?"
                    ok-text="删除"
                    cancel-text="取消"
                    @confirm="delArticle(item.id)"
                >
                  <a @click=""><a-icon type="delete" theme="filled"/> &nbsp;&nbsp;&nbsp;&nbsp;删除</a>
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
  name: "ArticleStream",
  data(){
    return{
      tip: '加载更多',
      articles: [],
      spin: false,
      options: [],
      search: {title: '', majorId: 0},
      total: 0,
      current: 1,
    }
  },
  created() {
    this.getArticle();
    this.getSpecial();
  },
  methods: {
    selectChange(value){
      this.search.majorId = value;
    },
    getMore(){
      this.getArticle();
    },
    delArticle(id){
      request.get(BASE_URL+`/article/delArticle?id=${id}`).then(res=>{
        if(res.data.code === 200){
          this.$message.success("删除成功");
          this.tip = '加载更多';
          this.articles = [];
          this.current = 1;
          this.getArticle()
        }else {
          this.$message.error("删除失败");
        }
      })
    },
    doSearch(){
      this.articles = [];
      this.current = 1;
      this.getArticle();
    },
    getSpecial(){
      request.get(BASE_URL+"/article/getSpecial?id="+this.$store.state.user.id).then(res=>{
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
    updateArticle(id){
      this.$router.push({path: '/add', query:{id:id}})
    },
    getArticle(){
      this.spin = true;
      // let major = 0;
      // console.log(this.search)
      // if(this.search.majorId.length !== 0){
      //   major = this.search.majorId[1];
      // }
      request.get(BASE_URL+`/article/getArticlesByUserId/${this.$store.state.user.id}?title=${this.search.title}&majorId=${this.search.majorId}&current=${this.current}&pageSize=10`).then(res=>{
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