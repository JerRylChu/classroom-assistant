<!--<template>
    <div class="home" style="width: 20%;margin: 12% auto;">

      <a-form-model layout="vertical" :model="formInline" @submit="handleSubmit" @submit.native.prevent>
        <a-form-model-item>
          <h1 style="text-align: center">课堂助手</h1>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="formInline.user" placeholder="Username">
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="formInline.password" type="password" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-checkbox v-model="formInline.rememberMe">记住我</a-checkbox>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
              type="primary"
              html-type="submit" :disabled="formInline.user === '' || formInline.password === ''">
            登录
          </a-button>
          <a-button style="margin-left: 50px" @click="showDrawer">注册</a-button>
        </a-form-model-item>
      </a-form-model>

      <div>
        <a-drawer
            title="Create a new account"
            :width="520"
            :visible="visible"
            :body-style="{ paddingBottom: '80px' }"
            @close="onClose"
        >
          <a-form :form="form" layout="vertical" hide-required-mark>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Name">
                  <a-input
                      v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: 'Please enter user name' }],
                  },
                ]"
                      placeholder="Please enter user name"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Url">
                  <a-input
                      v-decorator="[
                  'url',
                  {
                    rules: [{ required: true, message: 'please enter url' }],
                  },
                ]"
                      style="width: 100%"
                      addon-before="http://"
                      addon-after=".com"
                      placeholder="please enter url"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Owner">
                  <a-select
                      v-decorator="[
                  'owner',
                  {
                    rules: [{ required: true, message: 'Please select an owner' }],
                  },
                ]"
                      placeholder="Please a-s an owner"
                  >
                    <a-select-option value="xiao">
                      Xiaoxiao Fu
                    </a-select-option>
                    <a-select-option value="mao">
                      Maomao Zhou
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Type">
                  <a-select
                      v-decorator="[
                  'type',
                  {
                    rules: [{ required: true, message: 'Please choose the type' }],
                  },
                ]"
                      placeholder="Please choose the type"
                  >
                    <a-select-option value="private">
                      Private
                    </a-select-option>
                    <a-select-option value="public">
                      Public
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Approver">
                  <a-select
                      v-decorator="[
                  'approver',
                  {
                    rules: [{ required: true, message: 'Please choose the approver' }],
                  },
                ]"
                      placeholder="Please choose the approver"
                  >
                    <a-select-option value="jack">
                      Jack Ma
                    </a-select-option>
                    <a-select-option value="tom">
                      Tom Liu
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="DateTime">
                  <a-date-picker
                      v-decorator="[
                  'dateTime',
                  {
                    rules: [{ required: true, message: 'Please choose the dateTime' }],
                  },
                ]"
                      style="width: 100%"
                      :get-popup-container="trigger => trigger.parentNode"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="Description">
                  <a-textarea
                      v-decorator="[
                  'description',
                  {
                    rules: [{ required: true, message: 'Please enter url description' }],
                  },
                ]"
                      :rows="4"
                      placeholder="please enter url description"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <div
              :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
          >
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
              取消
            </a-button>
            <a-button type="primary" @click="onClose">
              提交
            </a-button>
          </div>
        </a-drawer>
      </div>
    </div>
</template>-->
<template>
<!--  :style="backgroundDiv"-->
  <div >
    <div class="login">
      <div style="text-align: center;font-size: xx-large">ClassAssistant</div>
      <div class="components-input-demo-presuffix" style="margin-top: 40px">
        <a-input style="height: 8%" ref="userNameInput" v-model="user.phoneNumber" placeholder="手机号">
          <a-icon slot="prefix" type="user" style="margin-top: 1px;margin-right: 7px" />
        </a-input>
        <br />
        <br />
        <a-input-password style="height: 8%" ref="passwordInput" v-model="user.password" placeholder="密码">
          <a-icon slot="prefix" type="unlock" style="margin-top: 1px;margin-right: 7px" />
        </a-input-password>
      </div>
      <div style="margin-top: 25px">
        <a-input  style="height: 8%;float: left;width: 68%" v-model="user.confirmCode" placeholder="验证码">
          <a-icon slot="prefix" type="smile" style="margin-top: 1px;margin-right: 7px" />
        </a-input>
        <img style="width: 30%;height: 32px;cursor: pointer" ref="verifyCode" @click="getVerifyCode" :src="verifyCodeUrl">
      </div>
<!--      <div style="margin-top: 25px">-->
<!--        <a-switch style="margin-top:6px;float: left" :checked="isChecked" v-on:change="stateChange" />-->
<!--        <span style="margin-top:6px;margin-left: 10px;float: left">自动登录</span>-->
<!--        <a-button style="float: right" type="link">忘记密码</a-button>-->
<!--      </div>-->
      <a-button type="primary" block style="margin-top: 40px;height: 45px" @click="login">登录</a-button>
      <a-button type="danger" block style="margin-top: 20px;height: 45px" @click="showDrawer" >注册</a-button>
      <div>
        <a-drawer
            title="注册"
            :width="360"
            :visible="visible"
            :body-style="{ paddingBottom: '80px' }"
            @close="onClose">
          <a-form :form="form" layout="vertical" hide-required-mark>
            <a-row :gutter="16">
              <a-col>
                <a-form-item label="手机号">
                  <a-input v-decorator="['phoneNumber',{rules: [{ required: true, message: '手机号不能为空' }],},]" placeholder="请输入手机号"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col>
                <a-form-item label="密码">
                  <a-input-password v-decorator="['password',{rules: [{ required: true, message: '密码不能为空' }],},]" placeholder="请输入密码"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col>
                <a-form-item label="确认密码">
                  <a-input-password v-decorator="['confirmPassword',{rules: [{ required: true, message: '确认密码不能为空' }],},]" placeholder="请确认密码"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col>
                <a-form-item label="昵称">
                  <a-input v-decorator="['nickName',{rules: [{ required: true, message: '昵称不能为空' }],},]" placeholder="请输入昵称"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col>
                <a-form-item label="学校名称">
                  <a-input v-decorator="['school',{rules: [{ required: true, message: '学校名称不能为空' }],},]" placeholder="请输入学校名称"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col>
                <a-form-item label="专业名称">
                  <a-cascader placeholder="请选择专业" :fieldNames="{label: 'name', value: 'id', children: 'children'}" :options="options" v-decorator="['major',{rules: [{ required: true, message: '专业不能为空' }],},]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <div
              :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
          >
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
              取消
            </a-button>
            <a-button type="primary" @click="register">
              注册
            </a-button>
          </div>
        </a-drawer>
      </div>
    </div>

  </div>
</template>

<script>
import request from "@/utils/request"
const BASE_URL = '/dev-api';
export default {
  name: "Login",
  components: {
  },
  data() {
    return {
      options: [],
      backgroundDiv: {
        backgroundImage:'url(' + require('@/assets/images/bac.jpg') + ')',
        backgroundSize:'cover',
        width: '100%',
        height: '100%'
      },
      user: {
        phoneNumber: '',
        password: '',
        confirmCode: '',
      },
      timeStamp: '',
      verifyCodeUrl: '',
      isChecked: false,
      form: this.$form.createForm(this),
      visible: false,
    }
  },
  created() {
    this.getSpecial();
  },
  mounted() {
    this.getVerifyCode();
    // this.loadLoginMsg();
  },
  methods: {
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
    /**
     * 注册新用户
     * */
    register(e){
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if(values.password !== values.confirmPassword){
            this.$message.warn("密码输入不一致");
            return ;
          }
          if(!/^1[0-9]{10}$/.test(values.phoneNumber)){
            this.$message.warn("请输入正确的手机号");
            return;
          }
          request.post(BASE_URL+"/login/register",
              {password:values.password,nickName:values.nickName,phoneNumber:values.phoneNumber,school:values.school, major:values.major[1]})
              .then(res => {
                if(res.data.code === 200){
                  this.$message.success(res.data.msg);
                  this.form.resetFields();
                  this.onClose();
                }else {
                  this.$message.warn(res.data.msg);
                }
              }).catch(err => {
            this.$message.error("请求接口出现异常");
          })
        }
      });
    },
    /**
     * 登录逻辑处理
     */
    login(){
      if(this.user.confirmCode === ''){
        this.$message.warn('请输入验证码',3);
        return;
      }
      // let cookie= this.getCookie("adminInfo");
      // if(this.isChecked){
      //   if(cookie === ""){
      //     let adminInfo
      //     if(this.isChecked){
      //       adminInfo = this.email+"|"+this.password+"|1";
      //     }else {
      //       adminInfo = this.email+"|"+this.password+"|0";
      //     }
      //     this.setCookie("adminInfo",adminInfo);
      //   }
      // }else {
      //   if(cookie !== ""){
      //     console.log("删除");
      //     this.delCookie("adminInfo");
      //   }
      // }
      // this.$store.commit('changeState',1);
      // console.log(this.$store.state.userId);
      // this.$message.warn("jjj");
      // this.$router.push("/layout");
      // console.log(this.user);
      request.post(BASE_URL+"/login/doLogin/"+this.timeStamp,this.user)
          .then(res => {
            if(res.data.code === 200){
              // sessionStorage.setItem('userId',res.data.data);
              // this.$message.success(res.data.msg);
              let info = {
                id:res.data.data.id,
                nickName:res.data.data.nickName,
                headIconUrl: res.data.data.headIconUrl,
                school: res.data.data.school,
                phoneNumber: res.data.data.phoneNumber,
                signature: res.data.data.signature,
                majorName: res.data.data.majorName
              }
              console.log(res.data.data);
              this.$store.commit('changeState',info);
              this.$router.push("/");
            }else {
              this.$message.warn(res.data.msg);
              this.getVerifyCode();
            }
          })
          .catch(error =>{
            this.$message.error("请求接口出现异常");
            this.getVerifyCode()
          });
    },
    /**
     * 后台获取验证码图片
     */
    getVerifyCode(){
      this.verifyCodeUrl = this.timestamp(BASE_URL+'/login/code');
    },
    /**
     * 给验证码url请求加上时间戳，刷新验证码
     */
    timestamp(url) {
      let getTimestamp = new Date().getTime();
      if (url.indexOf("?") > -1) {
        url = url + "&timestamp=" + getTimestamp
      } else {
        url = url + "?timestamp=" + getTimestamp
      }
      this.timeStamp = getTimestamp.toString();
      return url;
    },
    /**
     * 显示注册页面
     */
    showDrawer() {
      this.visible = true;
    },
    //关闭注册页面
    onClose() {
      this.visible = false;
    },
    // /**
    //  * 页面加载登录信息
    //  */
    // loadLoginMsg(){
    //   let cookie= this.getCookie("adminInfo");
    //   if(cookie !== ""){
    //     let strings = cookie.split("|");
    //     this.email = strings[0];
    //     this.password = strings[1];
    //     this.isChecked = strings[2] === "1"?true:strings[2] === "0"?false:false;
    //     console.log(this.isChecked);
    //   }
    // },
    // /**
    //  * 添加cookie
    //  */
    // setCookie(c_name,value,expiremMinutes){
    //   let exdate = new Date();
    //   exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000);
    //   document.cookie= c_name + "=" + escape(value)+((expiremMinutes==null) ? "" : ";expires="+exdate.toUTCString());
    // },
    // /**
    //  * 获取本地cookie
    //  */
    // getCookie(c_name){
    //   if(document.cookie.length>0){
    //     let c_start = document.cookie.indexOf(c_name+"=");
    //     if(c_start!=-1){
    //       c_start=c_start+c_name.length+1;
    //       let c_end = document.cookie.indexOf(";",c_start);
    //       if(c_end==-1){
    //         c_end = document.cookie.length;
    //         return unescape(document.cookie.substring(c_start,c_end));
    //       }
    //     }
    //   }
    //   return "";
    // },
    // /**
    //  * 删除cookie
    //  */
    // delCookie(c_name){
    //   let exp = new Date();
    //   exp.setTime(exp.getTime()-1);
    //   let cval = this.getCookie(c_name);
    //   if(cval!=null){
    //     document.cookie = c_name+"="+cval+";expires="+exp.toUTCString();
    //   }
    // },
    // /**
    //  * 记住密码switch开关
    //  * @param state 是否记住
    //  */
    // stateChange(state){
    //   this.isChecked = state;
    // },
  },
};
</script>

<style lang="scss">
.login{
  width: 20%;
  padding-top: 8%;
  margin: 0 auto;
}
</style>
