<template>
    <div style="background-color: white;width: 100%;padding: 20px">
        <a-row :gutter="20">
            <a-col :span="16"><a-input placeholder="文章标题" v-model="title"/></a-col>
            <a-col :span="4">
                <a-button type="primary" @click="addNote">保存</a-button>
            </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="showTag">分类</a-button>
          </a-col>
        </a-row>
      <a-row v-show="selectedTags !== []" style="margin-top: 10px">
        <a-col span="2">
          <a-checkable-tag :checked="true">{{selectedTags[0] === undefined ? '':selectedTags[0].name}}</a-checkable-tag>
        </a-col>
      </a-row>
      <a-modal
          :width="800"
          :min-height="280"
          :visible="visible"
          okText="确认"
          cancelText="取消"
          @cancel="closeTags"
          @ok="confirmTags">
        <a-row style="margin-top: 15px">
          <a-tabs :tabPosition="'left'">
            <a-tab-pane v-for="item in options" :key="item.id" :tab="item.name">
              <template v-for="it in item.children">
                <a-checkable-tag
                    :key="it.id"
                    :checked="selectedTags.indexOf(it) > -1"
                    @change="checked => handleTagChange(it, checked)"
                >
                  {{ it.name }}
                </a-checkable-tag>
              </template>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-modal>
<!--        <a-row style="margin-top: 20px;font-size: 20px;margin-bottom: 20px">-->
<!--            <a-col v-for="tag in tagList" :span="4">-->
<!--                <template >-->
<!--                    <a-checkable-tag-->
<!--                            :key="tag.id"-->
<!--                            :checked="selectedTags.indexOf(tag.id) > -1"-->
<!--                            @change="checked => handleTagChange(tag.id, checked)"-->
<!--                    >-->
<!--                        {{ tag.tagName }}-->
<!--                    </a-checkable-tag>-->
<!--                </template>-->
<!--            </a-col>-->
<!--        </a-row>-->
      <div id="wangeditor">
        <div id="editor-header" style="text-align:left;"></div>
        <div id="editor-body" style="text-align:left;height: 500px;"></div>
      </div>
    </div>
</template>

<script>
const BASE_URL = 'dev-api';
import request from '../../utils/request'
import Editor from 'wangeditor'
let editor;
export default {
  name: "RichTextEditor",
  data(){
    return{

      show: false,
      articleId: this.$route.query.id,
      visible: false,
      form: this.$form.createForm(this),
      title: '',
      desc: '',
      options: [],
      tagList: [],
      selectedTags: [],
      article: {}
    }
  },
  created() {
    // this.getTags();
    this.showArticle();
    this.getSpecial();
  },
  mounted() {
    this.initEditor();
  },
  methods:{
    closeTags(){
      this.visible = false;
      if(this.articleId === undefined || this.articleId === null){
        this.selectedTags = [];
      }
    },
    confirmTags(){
      this.visible = false;
    },
    showTag(){
      this.visible = true;
    },
    handleChange(checked) {
      console.log(checked);
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
    showArticle(){
      if(this.articleId === undefined || this.articleId === null){
        return ;
      }
      request.get(BASE_URL+`article/getArticle/${this.articleId}`).then(res=>{
        console.log(res.data.data)
        this.title = res.data.data.title;
        this.desc = res.data.data.desc;
        editor.txt.html(res.data.data.articleContent);
        this.selectedTags.push({id: res.data.data.major,name: res.data.data.majorName});
      })
    },
    handleTagChange(tag, checked) {
      const { selectedTags } = this;
      const nextSelectedTags = checked
          ? [tag]
          : selectedTags.filter(t => t !== tag);
      this.selectedTags = nextSelectedTags;
      console.log(this.selectedTags)
    },
    addNote(){
      if(this.title === ''){
        this.$message.warn("文章标题不能为空");
        return;
      }
      if(this.title.length > 49){
        this.$message.warn("标题字数不能大于50字");
        return;
      }
      if(this.selectedTags.length < 1){
        this.$message.warn("请选择你的文章专业分类");
        return;
      }
      let text = editor.txt.text();
      if(text.length <= 200){
        this.desc = text;
      }else {
        this.desc = text.substring(0,149)+"...";
      }
      if(this.articleId === undefined || this.articleId === null){
        let dataList = {userId: this.$store.state.user.id,title: this.title, description: this.desc,articleContent: editor.txt.html(),major: this.selectedTags[0].id};
        request.post(BASE_URL+"/article/add",dataList).then(res =>{
          if(res.data.code === 200){
            this.$message.success("添加成功");
            editor.txt.clear();
            this.title = '';
            this.desc = '';
            this.selectedTags = [];
          }
          if(res.data.code === 500){
            this.$message.error("请求接口出现异常");
          }
        })
      }else {
        //修改
        let dataList = {id:this.articleId,title: this.title, description: this.desc,articleContent: editor.txt.html(),major: this.selectedTags[0].id};
        request.post(BASE_URL+"/article/updateArticle",dataList).then(res=>{
          if(res.data.code === 200){
            this.$message.success("修改成功");
            editor.txt.clear();
            this.title = '';
            this.desc = '';
            this.selectedTags = [];
            this.$router.go(-1);
          }
          if(res.data.code === 500){
            this.$message.error("请求接口出现异常");
          }
        })
      }

    },
    getTags(){
      request.get(BASE_URL+"/tag/getTags?userId="+sessionStorage.getItem('userId')).then(res => {
        if(res.data.code === 200){
          this.tagList = res.data.data;
        }
        if(res.data.code === 500){
          this.$message.error("请求接口出现异常");
        }
      })
    },
    initEditor(){
      editor = new Editor("#editor-header","#editor-body");
      editor.config.showLinkImg = false;
      editor.config.uploadImgServer = BASE_URL+'/file/articleImgUpload';
      editor.config.uploadImgMaxSize = 10*1024*1024;
      editor.config.uploadFileName = 'file';
      editor.config.customAlert = function (info){
        this.$message.warn(info);
      };
      editor.config.debug = true;
      editor.config.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ];
      editor.config.uploadImgHooks = {
        before: function (xhr,editor,files){
        },
        success: function (xhr,editor,result) {
        },
        customInsert: function (insertImg, result, editor) {
          let url = result.data;
          insertImg(url);
        }
      }
      editor.create();
    },
  }
}
</script>

<style>
.w-e-toolbar {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}

</style>