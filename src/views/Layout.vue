<template>
    <div>
      <a-layout>
          <!-- 导航 -->
          <div :style="{ width: '100%'}">
            <a-menu
                mode="horizontal"
                style="margin-bottom:5px; background-color:#1890FF;color:white"
            >
              <a-menu-item style="float: left;">
                <h1 style="color: white;margin-top: 8px">ClassAssistant</h1>
              </a-menu-item>
              <a-menu-item style="float:right;" >
                <a-dropdown>
                  <a class="ant-dropdown-link" >
                    <a-avatar style="margin: 10px" :size="40" :src="this.$store.state.user.headIconUrl"/>
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <router-link to="/"><a-button type="link" @click="closeSocket">返回社区</a-button></router-link>
                    </a-menu-item>
                    <a-menu-item>
                      <router-link to=""><a-button type="link" @click="showEditPwd">修改密码</a-button></router-link>
                    </a-menu-item>
                    <a-menu-item>
                      <router-link to="/"><a-button type="link" @click="handleLogout">退出</a-button></router-link>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-menu-item >
            </a-menu>
          </div>
      </a-layout>

      <a-layout  id="components-layout-fixed" theme="light">
        <a-layout-sider style="width: 200px;background-color: white" >
            <a-menu
                mode="inline"
                :default-selected-keys="[selectKey]"
                :selected-keys="[current]"
                @click="handleClick"
                theme="light"
            >
                <a-menu-item v-for="item in menus" :key="item.id">
                  <a-icon :type="item.iconType" theme="filled"/>
                  {{item.name}}
                  <router-link :to="item.url"></router-link>
                </a-menu-item>

            </a-menu>

          </a-layout-sider>
        <a-layout-content style="padding-left:2px;">
            <router-view/>
          <a-back-top />
          </a-layout-content>
      </a-layout>
      <a-modal :visible="editPwd" okText="确认修改" cancelText="取消" @ok="updatePwd" @cancel="cancelUpdate">
        <a-input-password placeholder="请输入新密码" v-model="newPwd" style="margin-top: 20px"/>
        <a-input-password placeholder="确认密码" v-model="confirmNewPwd" style="margin-top: 20px"/>
      </a-modal>
    </div>
</template>

<script>
let socket;
import request from "@/utils/request";
const BASE_URL = '/dev-api';
    export default {
        name: "Layout",
        data() {
            return {
              current: '2',
              menus:[],
              selectKey:'0',
              editPwd: false,
              newPwd: '',
              confirmNewPwd: ''
            };
        },
      created() {
        this.getMenu();
        this.buildWebSocket();
      },
      methods: {
        updatePwd(){
          if(this.newPwd !== this.confirmNewPwd){
            this.$message.warn("输入密码不一致");
          }
          request.post(BASE_URL+"/login/updatePwd",{id:this.$store.state.user.id, password: this.newPwd}).then(res=>{
            if(res.data.code === 200){
              this.$message.success("修改成功")
              this.cancelUpdate();
            }else {
              this.$message.error("修改失败")
            }
          })
        },
        cancelUpdate(){
          this.newPwd = '';
          this.confirmNewPwd = '';
          this.editPwd = false;
        },
        showEditPwd(){
          this.editPwd = true;
        },
        closeSocket(){
          if(socket != null){
            socket.close();
            socket = null;
            this.$message.success("socket关闭")
          }
        },
        buildWebSocket(){
          if(typeof(WebSocket) === "undefined" ){
            this.$message.error("您的浏览器不支持WebSocket")
          }else {
            let socketUrl = `http://localhost:8083//notify/${this.$store.state.user.id}`;
            socketUrl = socketUrl.replace("https","ws").replace("http","ws");
            console.log(socketUrl);
            if(socket != null){
              socket.close();
              socket = null;
            }
            socket = new WebSocket(socketUrl);
            socket.onopen = () =>{
              this.$message.success("已连接");
            }
            socket.onmessage = (res) => {
              this.$notification.open({
                duration: null,
                message: "来自课表拍拍小提示~",
                description: res.data,
                icon: <a-icon type="smile" style="color: #108ee9" />
              })
            }
            socket.onclose = () =>{

            }
            socket.error = () => {
              this.$message.error("服务器出错了~")
            }
          }
        },
        handleLogout(){
          this.$store.commit('changeState',{id:0, nickName:'', headIconUrl: '', school: '',phoneNumber: '', signature: '', majorName: ''});
          if(socket != null){
            socket.close();
            socket = null;
            this.$message.success("socket关闭")
          }
        },
        handleClick(e) {
          this.current = e.key;
        },
        getMenu(){
          request.get(BASE_URL+"/sysMenu/getMenu").then(res=>{
            this.menus = res.data.data;
            this.selectKey = this.menus[0].id;
            this.current = this.menus[0].id;
          }).catch(res => {
            this.$message.error(res);
          })
        }
      },
    }
</script>

<style scoped>
#components-layout-fixed {
  height: 100%;
  width: 100%;
  position: absolute;
}

</style>