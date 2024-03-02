<template>
  <div>
<!--    <a-layout>-->
<!--      <a-layout-sider style="background-color: white;height: 685px;width: 30%">-->
<!--        -->

<!--      </a-layout-sider>-->
<!--      <a-layout-content>-->
<!--        -->
<!--      </a-layout-content>-->
<!--    </a-layout>-->
    <a-row>
      <a-col :span="5">
        <a-card :bordered="true" style="height: 685px;background-color: transparent" >
        <a-row>
          <a-col :span="24">
              <a-button type="primary" style="float: left" @click="openAddFirst">新建一级目录</a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
              <a-directory-tree
                  :tree-data="treeData"
                  @rightClick="rightClick"
                  @select="onSelect"
                  @expand="onExpand"
                  :replaceFields="{children:'typeTrees', title:'name', key:'id' }"
                  :showIcon="false"
              />
          </a-col>
        </a-row>
        </a-card>
      </a-col>
      <a-col :span="19">
        <div class="clearfix" >
          <a-upload
              action="http://localhost:8081/dev-api/file/imgUpload"
              list-type="picture-card"
              :file-list="fileList"
              :multiple="true"
              @preview="handlePreview"
              @change="handleChange"
          >
            <div v-if="fileList.length < 8">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal style="width: 50%; height: 50%" :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
            <div>{{previewBac}}</div>
          </a-modal>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model="addFirstVisible" title="添加一级目录" @ok="handleAddFirstOk" cancelText="取消" okText="添加" :centered="true">
      <a-input placeholder="请输入一级目录名称" v-model="firstName" style="margin-bottom: 5px;margin-top: 5px"/>
    </a-modal>
<!--    <a-modal v-model="addElseVisible" :title="this.rightClickNode.name" @ok="handleAddElseOk" cancelText="取消" okText="添加" :centered="true">-->
<!--      <a-row>-->
<!--        <a-col :span="5">目录名称：</a-col>-->
<!--        <a-col :span="19"><a-input v-model="this.rightClickNode.name"></a-input></a-col>-->
<!--      </a-row>-->
<!--      <a-row></a-row>-->
<!--    </a-modal>-->
  </div>
</template>

<script>
import request from "@/utils/request";
const BASE_URL = '/dev-api';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  name: "PhotoStore",
  data() {
    return {
      rightClickNode: {},
      addElseVisible: false,
      firstName: '',
      addFirstVisible:false,
      previewBac: '',
      previewVisible: false,
      previewImage: '',
      treeData: [],
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          bac: "这是上课拍的"
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          bac: "这是上课拍的"
        },
        {
          uid: '-3',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          bac: "这是上课拍的"
        },
        {
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          bac: "这是上课拍的"
        },
        {
          uid: '-5',
          name: 'image.png',
          status: 'error',
          bac: "这是上课拍的"
        },
        {
          uid: '-6',
          name: 'sxy',
          status: 'done',
          url: 'http://localhost:8081/dev-api/file/imgDownload/17EC5639FC98E0984C3FF846D24CAC53.jpg',
          bac: "这是上课拍的"
        }
      ],
      selectedType: 0,
      userId: this.$store.state.userId
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    rightClick({event, node}){
      console.log(node.dataRef.id);
      this.rightClickNode = node.dataRef;
      this.addElseVisible = true;
    },
    handleAddElseOk(){
      this.addElseVisible = false;
    },
    openAddFirst(){
      this.addFirstVisible = true;
    },
    handleAddFirstOk(){
      if(this.firstName === ''){
        this.$message.warn("请输入一级目录名称");
        return ;
      }
      this.addFirstVisible = false;
      request.post(BASE_URL+"/type/addType",{userId:this.userId,id:0,name:this.firstName}).then(res=>{
        if(res.data.code === 200){
          this.firstName = "";
          this.$message.success("添加成功");
          this.getTreeData();
        }else {
          this.$message.success("添加失败");
        }
      })
    },
    getTreeData(){
      request.get(BASE_URL+"/type/getTypeTree?id="+this.userId).then(res=>{
        this.treeData = res.data.data;
      }).catch(res => {
        // this.$message.error(res.data.msg);
      })
    },
    onSelect(keys, event) {
      this.selectedType = event.node.dataRef.id;
      if(event.node.dataRef.typeTrees.length === 0){
        console.log("显示图片");
      }
    },
    onExpand() {
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewBac = file.bac;
      this.previewVisible = true;
    },
    handleChange({file, fileList }) {
      console.log(file.uid);
      // for (let i = 0; i < fileList.length; i++) {
      //   console.log(fileList[i])
      // }
      this.fileList = fileList;
    },
  },
}
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>