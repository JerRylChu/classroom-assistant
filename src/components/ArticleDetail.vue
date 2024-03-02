<template>
  <div>
    <a-layout>
      <a-row type="flex" justify="center">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <a-card id="content">
            <a-row><div style="text-align: start"><h2 style="font-size: 26px">{{article.title}}</h2></div></a-row>
            <a-row>
              <a-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
                <span style="float: left;margin-right: 5px">阅读量：{{article.reads}}</span>
                <span style="margin-right: 5px">评论数：{{article.comments}}</span>
                <span style="margin-right: 5px">发表时间：{{moment(article.createTime).format('YYYY-MM-DD')}}</span>
              </a-col>
              <a-col :xs="0" :sm="0" :md="10" :lg="10" :xl="10">
                <div style="float: right;margin-left: 20px" v-if="article.userId !== this.$store.state.user.id && mobile">
                  <a-popover title="点击查看作者信息">
                    <a @click="authorDetail"><a-icon type="info-circle" theme="twoTone" style="cursor: pointer;font-size: 25px"/></a>
                  </a-popover>
                </div>
                <div style="float: right;margin-left: 20px" v-if="this.article.userId !== this.$store.state.user.id">
                  <a @click="addCollect"><a-icon type="star" :theme="!isCollect?'twoTone':'filled'" style="cursor: pointer;font-size: 25px"/></a>
                </div>
                <div style="float: right;margin-left: 20px" v-if="this.article.userId !== this.$store.state.user.id">
                  <a @click="addStar"><a-icon type="like" :theme="!isStar?'twoTone':'filled'" style="cursor: pointer;font-size: 25px"/></a>
                </div>
                <div style="float: right" v-if="this.article.userId !== this.$store.state.user.id">
                  <a-popover :title="!isCare?'关注作者':'取消关注'">
                    <a @click="careAuthor"><a-icon type="tags" :theme="!isCare?'twoTone':'filled'" style="cursor: pointer;font-size: 25px"/></a>
                  </a-popover>
                </div>
                <a-button v-if="this.article.userId !== this.$store.state.user.id" type="link" style="float: right;color: red" @click="showModal">举报该文章</a-button>
              </a-col>
            </a-row>
            <a-row>
              <a-col :xs="24" :sm="24" :md="0" :lg="0" :xl="0">
                <div style="float: right;margin-left: 10px" v-if="article.userId !== this.$store.state.user.id && mobile">
                  <a-popover title="点击查看作者信息">
                    <a @click="authorDetail"><a-icon type="info-circle" theme="twoTone" style="cursor: pointer;font-size: 25px"/></a>
                  </a-popover>
                </div>
                <div style="float: right;margin-left: 20px" v-if="this.article.userId !== this.$store.state.user.id">
                  <a @click="addCollect"><a-icon type="star" :theme="!isCollect?'twoTone':'filled'" style="cursor: pointer;font-size: 25px"/></a>
                </div>
                <div style="float: right;margin-left: 20px" v-if="this.article.userId !== this.$store.state.user.id">
                  <a @click="addStar"><a-icon type="like" :theme="!isStar?'twoTone':'filled'" style="cursor: pointer;font-size: 25px"/></a>
                </div>
                <div style="float: right" v-if="this.article.userId !== this.$store.state.user.id">
                  <a-popover title="关注作者">
                    <a @click="careAuthor"><a-icon type="tags" :theme="!isCare?'twoTone':'filled'" style="cursor: pointer;font-size: 25px"/></a>
                  </a-popover>
                </div>
                <a-button v-if="this.article.userId !== this.$store.state.user.id" type="link" style="float: right;color: red" @click="showModal">举报该文章</a-button>
              </a-col>
            </a-row>
            <a-divider/>
            <div style="padding: 1%" v-html="article.articleContent"></div>
          </a-card>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" style="margin-top: 20px">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <a-card>
            <a-card :bordered="false">
              <a-row>
                <a-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16"><a-textarea placeholder="快来发表评论吧" :rows="1" v-model="markContent"/></a-col>
                <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8"><a-button type="primary" @click="makeMark">评论</a-button></a-col>
              </a-row>
            </a-card>
            <comment v-for="(item,index) in treeData" :node="item" :user-id="article.userId" :article-id="article.id" @refresh="getComments"></comment>
          </a-card>
        </a-col>
      </a-row>
    </a-layout>
    <a-modal :visible="show" @cancel="cancel" style="padding: 25px" title="描述违规内容" okText="确认" cancelText="取消" @ok="reportIllegal">
      <a-textarea :rows="5" v-model="desc">
      </a-textarea>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment';
import request from "@/utils/request";
const BASE_URL = '/dev-api';
import Comment from '../components/Comment'

export default {
name: "ArticleDetail",
  components:{
    Comment
  },
  data(){
    return{
      article: {},
      treeData: [],
      markContent: '',
      moment,
      isCare: false,
      isCollect: false,
      isStar: false,
      show: false,
      desc: '',
      mobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)==true?false:true
    }
  },
  created() {
    this.getArticle();
    // this.initEditor();
    this.getComments();

  },
  methods: {
    authorDetail(){
      let data = this.$router.resolve({path: '/authorDetail', query:{id:this.article.userId}})
      window.open(data.href,'_blank');
    },
    cancel(){
      this.show = false;
    },
    showModal(){
      this.show = true;
    },
    reportIllegal(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录再进行相关操作");
        return;
      }
      if(this.desc === ''){
        this.$message.warn("请描述违规内容");
      }
      request.post(BASE_URL+`/reportIllegal`,{userId:this.$store.state.user.id,articleId: this.article.id,description:this.desc}).then(res=>{
        if(res.data.code === 200){
          this.$message.success(res.data.msg)
        }else if(res.data.code === 201){
          this.$message.warn(res.data.msg);
        }else {
          this.$message.error(res.data.msg);
        }
        this.show = false;
        this.desc = '';
      })
    },
    addStar(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录再进行相关操作");
        return;
      }
      if(this.isStar){
        this.delStar();
        return;
      }
      request.post(BASE_URL+`/addStar?userId=${this.$store.state.user.id}&articleId=${this.article.id}`).then(res=>{
        if(res.data.code === 200){
          this.$message.success("点赞成功");
          this.getIsStar(this.article.id);
        }
      })
    },
    delStar(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录再进行相关操作");
        return;
      }
      request.get(BASE_URL+`/delStar?userId=${this.$store.state.user.id}&articleId=${this.article.id}`).then(res=>{
        if(res.data.code === 200){
          this.$message.success("取消点赞成功");
          this.getIsStar(this.article.id);
        }
      })
    },
    getIsStar(articleId){
      request.get(BASE_URL+`/isStar?userId=${this.$store.state.user.id}&articleId=${articleId}`).then(res=>{
        this.isStar = res.data.data;
      })
    },
    addCollect(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录再进行相关操作");
        return;
      }
      if(this.isCollect){
        this.delCollect();
        return;
      }
      request.post(BASE_URL+`/addCollect?userId=${this.$store.state.user.id}&articleId=${this.article.id}`).then(res=>{
        if(res.data.code === 200){
          console.log(res)
          this.$message.success("收藏成功");
          this.getIsCollect(this.article.id);
        }
      })
    },
    delCollect(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录再进行相关操作");
        return;
      }
      request.get(BASE_URL+`/delCollect?userId=${this.$store.state.user.id}&articleId=${this.article.id}`).then(res=>{
        if(res.data.code === 200){
          this.$message.success("取消收藏成功");
          this.getIsCollect(this.article.id);
        }
      })
    },
    getIsCollect(articleId){
      request.get(BASE_URL+`/isCollect?userId=${this.$store.state.user.id}&articleId=${articleId}`).then(res=>{
        this.isCollect = res.data.data;
      })
    },
    delCare(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录再进行相关操作");
        return;
      }
      request.get(BASE_URL+`/delCare?follow=${this.$store.state.user.id}&followed=${this.article.userId}`).then(res=>{
        if(res.data.code === 200){
          this.$message.success("取关成功");
          this.getIsCare(this.article.userId);
        }
      })
    },
    careAuthor(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录再进行相关操作");
        return;
      }
      if(this.isCare){
        this.delCare();
        return;
      }
      request.post(BASE_URL+`/addCare?follow=${this.$store.state.user.id}&followed=${this.article.userId}`).then(res=>{
        if(res.data.code === 200){
          this.$message.success("关注成功");
          this.getIsCare(this.article.userId);
        }
      })
    },
    getIsCare(userId){
      request.get(BASE_URL+`/isCare?follow=${this.$store.state.user.id}&followed=${userId}`).then(res=>{
        this.isCare = res.data.data;
      })
    },
    getArticle(){
      let that = this;
      request.get(BASE_URL+`article/getArticle/${this.$route.query.id}?userId=${this.$store.state.user.id}`).then(res=>{
        that.article = res.data.data;
        this.getIsCare(res.data.data.userId);
        this.getIsCollect(res.data.data.id);
        this.getIsStar(res.data.data.id);
      })
    },
    getComments(){
      request.get(BASE_URL+`/comment/getComments?id=${this.$route.query.id}`).then(res=>{
        this.treeData = res.data.data;
      })
    },
    makeMark(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录才能进行评论哦")
        return ;
      }
      if(this.markContent === ''){
        this.$message.warn("评论内容不能为空")
        return ;
      }
      request.post(BASE_URL+`comment/addComment`,
          {userId: this.$store.state.user.id,
            articleId: this.$route.query.id,
            comment:this.markContent, parent: 0}).then(res=>{
        if(res.data.code !== 200){
          this.$message.error("服务器出错了")
        }else{
          this.$message.success("评论成功");
          this.comment = '';
          this.getComments();
        }
      })
    }
  }
}
</script>

<style>
#content{
  text-align: start;
}
table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
table td,
table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}
table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote 样式 */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
  text-align: start;
}
pre code {
  display: block;
}

/* ul ol 样式 */
ul, ol {
  margin: 10px 0 10px 20px;
}

img{
  width: 50%;
  height: 50%;

}
</style>