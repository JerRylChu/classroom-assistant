<template xmlns:a-col="http://www.w3.org/1999/html">
    <div style="background-color: white;width: 100%;padding: 20px">
      <!--
                <a-row :gutter="24">
            <a-col :span="8"><a-input-search placeholder="文章标题" enter-button v-model="title"/></a-col>
            <a-col :span="6">
                <a-range-picker @change="onChange" :locale="locale"/>
            </a-col>
            <a-col :span="4">
                <a-button type="primary" block @click="searchArticals">按选择条件综合搜索</a-button>
            </a-col>
            <a-col :span="3">
                <a-button type="primary" block>最新创建排序</a-button>
            </a-col>
            <a-col :span="3">
                <a-button type="primary" style="float: right" block>重要度排序</a-button>
            </a-col>
        </a-row>
        <a-row style="margin-top: 20px;font-size: 20px;margin-bottom: 20px">
            <a-col v-for="tag in tagList" :span="4">
                <template >
                    <a-checkable-tag
                            :key="tag.id"
                            :checked="selectedTags.indexOf(tag.id) > -1"
                            @change="checked => handleTagChange(tag.id, checked)"
                    >
                        {{ tag.tagName }}
                    </a-checkable-tag>
                </template>
            </a-col>
        </a-row>
      -->
        <a-list item-layout="horizontal" :data-source="data" style="margin-top: 20px;margin-bottom: 40px">
            <a-list-item @click="toArticalDetail(item.id,item.title)" slot="renderItem" slot-scope="item, index" style="margin-bottom: 10px;cursor: pointer">
                <a-list-item-meta :description="item.description">
                    <div slot="title" style=""><b><u>{{ item.title }}</u></b></div>
                </a-list-item-meta>
                <a-tag  v-for="tag in item.tags" :color="tag.color">
                    {{tag.tagName}}
                </a-tag>
                <a-rate :value="item.rate" allow-half disabled/>
                <span style="margin-left: 10px;font-size: 16px">{{item.createTime}}</span>
            </a-list-item>
            <a-spin v-show="spinning" :spinning="spinning"/>
        </a-list>
        <a-pagination
                show-size-changer
                :default-current="1"
                :total="total"
                :current="current"
                :pageSize="pageSize"
                @change="pageChange"
                @showSizeChange="showSizeChange"
                :pageSizeOptions="pageSizeOption"
        />
        <a-modal v-model="visible" width="1000px" :title="articalTitle" @ok="handleOk">
            <div v-html="articalDetail" style="padding-left: 25px;padding-right: 25px">
<!--                <marquee v-html="articalDetail" behavior="alternate" direction="down" >-->
<!--                </marquee>-->
            </div>
        </a-modal>
    </div>
</template>

<script>
    const BASE_URL = '/dev-api';
    import request from '../../utils/request'
    import RichTextEditor from "./RichTextEditor";
    import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
    export default {
        name: "LearnNote",
        components: {RichTextEditor},
        data(){
          return{
              tagList: [],
              data: [],
              total: 0,
              current: 1,
              pageSize:5,
              pageSizeOption: ['5','10','15','20'],
              visible: false,
              articalDetail: '<span>哈哈</span>',
              articalTitle: '',
              locale,
              spinning: false,
              title: '',
              timeRange: [],
              selectedTags: [],
          }
        },
        created() {
            // this.getTags();
            // this.getArticals(this.current,this.pageSize);
        },
        methods:{
            searchArticals(){
                this.postSearchRequest();
            },
            getTags(){
                request.get(BASE_URL+"/tag/getTags?userId="+sessionStorage.getItem('userId')).then(res => {
                    if(res.data.code == 200){
                        this.tagList = res.data.data;
                    }
                    if(res.data.code == 500){
                        this.$message.error("请求接口出现异常");
                    }
                })
            },
            handleTagChange(tag, checked) {
                const { selectedTags } = this;
                const nextSelectedTags = checked
                    ? [...selectedTags, tag]
                    : selectedTags.filter(t => t !== tag);
                this.selectedTags = nextSelectedTags;
            },
            handleOk(e) {
                this.visible = false;
            },
            toArticalDetail(articalId,title){
                request.get(BASE_URL+'artical/getArticalDetail/'+articalId)
                        .then(res => {
                            if(res.data.code == 200){
                                this.visible = true;
                                this.articalTitle = title;
                                this.articalDetail = res.data.data;
                                return;
                            }
                            this.$message.error("请求接口出现异常");
                        }).catch(err =>{
                            this.$message.error("请求接口出现异常");
                })

            },
            pageChange(current,pageSize){
                this.getArticals(current,pageSize);
            },
            showSizeChange(current,pageSize){
                this.getArticals(current,pageSize);
            },
            postSearchRequest(){
                this.spinning = true;
                this.current = current;
                this.pageSize = pageSize;
                let sData = {title: this.title,startTime: this.timeRange[0],endTime: this.timeRange[1]}
                request.post(BASE_URL+"/artical/getSearchArticals/"+sessionStorage.getItem('userId')+"/"+this.current+"/"+this.pageSize,sData).then(res => {
                    console.log(res);
                    this.data = res.data.pageData;
                    this.total = res.data.total;
                }).catch(err => {

                }).finally(() => {
                    this.spinning = false;
                })
            },
            getArticals(current,pageSize){
                this.spinning = true;
                this.current = current;
                this.pageSize = pageSize;
                request.get(BASE_URL+"/artical/getArticals/"+sessionStorage.getItem('userId')+"/"+this.current+"/"+this.pageSize).then(res => {
                    this.data = res.data.pageData;
                    this.total = res.data.total;
                    this.spinning = false;
                })
            },
            onChange(date, dateString) {
                console.log(dateString)
                this.timeRange = dateString;
            },
        }
    }
</script>

<style scoped>

</style>