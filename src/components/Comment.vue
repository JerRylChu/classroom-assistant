<template>
  <div>
    <div style="padding-left: 3%">
        <a-row style="margin-top: 10px">
<!--          <a-col span="2"><a-avatar :src="node.headIconUrl"/></a-col>-->
          <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" style="text-align: start">
            <span style="font-weight: bold;">
              {{node.nickName}}<span v-if="node.userId === userId" >(作者)</span>:
          </span>
          </a-col>
          <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" >{{moment(node.createTime).format('YYYY-MM-DD HH:mm:ss')}}</a-col>
          <a-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"><a @click="makeMark">回复</a></a-col>
          <a-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" v-if="this.$store.state.user.id === userId || this.$store.state.user.id === node.userId">
            <a-popconfirm
                title="删除评论会删除所有子评论哦，确认删除吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="delComment"
                @cancel="cancel"
            >
              <a style="color: red" href="#">删除</a>
            </a-popconfirm>
          </a-col>
        </a-row>
      <a-row>
        <a-textarea style="margin-top: 10px;background-color: white;color: black;cursor: default;" :disabled="true" :rows="2" v-model="node.comment">
        </a-textarea>
<!--        <span style="text-align: start;float:left;margin-top: 10px;padding-left: 3%">{{node.comment}}</span>-->
      </a-row>
      <a-row v-show="show" style="margin-bottom: 20px;margin-top: 20px;padding-left: 3%">
        <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"><a-textarea placeholder="发表你的评论" :rows="1" v-model="backWords"/></a-col>
        <a-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><a-button type="primary" @click="confirmMark">确认</a-button></a-col>
        <a-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><a-button type="primary" @click="cancel">取消</a-button></a-col>
      </a-row>
<!--      <a-divider dashed="true"/>-->
      <Comment v-if="node.children" v-for="(item,index) in node.children" :node="item" :user-id="userId" @refresh="refresh"></Comment>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import request from "@/utils/request";
const BASE_URL = '/dev-api';

export default {
  name: "Comment",
  props: {node: Object, userId: Number, articleId: Number},
  data(){
    return{
      show: false,
      backWords: '',
      moment
    }
  },
  created() {
  },
  methods:{
    refresh(){
      this.$emit('refresh')
    },
    confirmMark(){
      if(this.$store.state.user.id === 0){
        this.$message.warn("请先登录才能进行评论哦")
        return ;
      }
      if(this.backWords === ''){
        this.$message.warn("评论内容不能为空")
        return ;
      }
      let data = {
        userId: this.$store.state.user.id,
        articleId: this.articleId,
        comment:this.backWords,
        parent: this.node.id
      }
      request.post(BASE_URL+`comment/addComment`,data).then(res=>{
        if(res.data.code === 200){
          this.show = false;
          this.$message.success("回复成功")
          this.backWords = '';
          this.refresh();
        }else {
          this.$message.error("回复失败")
        }
      })
    },
    makeMark(){
      this.show = true
    },
    delComment(){
      request.get(BASE_URL+`comment/delComment?id=${this.node.id}`).then(res=>{
        if(res.data.code === 200){
          this.$message.success("删除成功");
          this.refresh();
        }else {
          this.$message.error("删除失败");
        }
      })
    },
    cancel(){
      this.backWords = '';
      this.show = false;
    },
  }
}
</script>

<style scoped>

</style>