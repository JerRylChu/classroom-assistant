<template>
  <a-result status="404" title="404" sub-title="您访问的页面不存在.">
    <template #extra>
      <a-button type="primary" @click="back">
        返回
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: "NotFound",
  data(){
    return{

    }
  },
  methods:{
    back(){
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>

</style>