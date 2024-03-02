<template>
  <div style="padding: 20px">
    <a-card>
      <a-list :bordered="false" style="text-align: start;" item-layout="vertical" size="small"  :data-source="authors">
        <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
          <a-list-item-meta >
            <a slot="title"><h3 style="margin-top: 5px">{{ item.nickName }}</h3></a>
                        <a-avatar slot="avatar" :src="item.headIconUrl" />
          </a-list-item-meta>
<!--          <span>{{item.description}}</span><br/>-->
          <template slot="actions">
            <!--                  v-for="{ type, text } in actions" slot="actions"-->
            <!--                  <span :key="type" style="cursor: pointer">-->
            <!--                    <a-icon :type="type" theme="twoTone" style="margin-right: 8px;" />-->
            <!--                    {{ text }}-->
            <!--                  </span>-->
            <span class="ant-list-item-meta-description" >
<!--                    {{item.reads}}&nbsp;&nbsp;&nbsp;&nbsp;阅读&nbsp;&nbsp;&nbsp;&nbsp;·-->
<!--                    {{item.comments}}&nbsp;&nbsp;&nbsp;&nbsp;评论&nbsp;&nbsp;&nbsp;&nbsp;·-->
<!--                    {{item.stars}}&nbsp;&nbsp;&nbsp;&nbsp;赞同-->
<!--                    <a @click="updateArticle(item.id)" style="margin-right: 8px;"><a-icon type="edit" theme="filled" /> &nbsp;&nbsp;&nbsp;&nbsp;修改</a>-->
                <a-popconfirm
                    title="确认取消关注吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="delCare(item.id)"
                >
                  <a @click=""><a-icon type="delete" theme="filled"/> &nbsp;&nbsp;&nbsp;&nbsp;取消关注</a>
                </a-popconfirm>
                  </span>
          </template>
          <!--                <span v-html="item.articleContent"></span>-->
        </a-list-item>
      </a-list>
      <a-row style="text-align: center;margin-bottom: 10px;">
        <a v-show="!spin" @click="getCareAuthor">{{this.tip}}</a>
        <a-spin :spinning="spin"/>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import request from "@/utils/request";
const BASE_URL = '/dev-api';

export default {
  name: "CareAuthor",
  data(){
    return{
      tip: '加载更多',
      spin: false,
      current: 1,
      authors: []
    }
  },
  created() {
    this.getCareAuthor();
  },
  methods: {
    delCare(id){
      request.get(BASE_URL+`/delCare?follow=${this.$store.state.user.id}&followed=${id}`).then(res=>{
        if(res.data.code === 200){
          this.$message.success("取关成功");
          this.authors = [];
          this.current = 1;
          this.getCareAuthor();
        }
      })
    },
    getCareAuthor(){
      this.spin = true;
      request.get(BASE_URL+`/getCareAuthor/${this.$store.state.user.id}?current=${this.current}&pageSize=10`).then(res=>{
        this.authors = this.authors.concat(res.data.data.list);
        this.current += 1;
        this.spin = false;
      })
    }
  }
}
</script>

<style scoped>

</style>