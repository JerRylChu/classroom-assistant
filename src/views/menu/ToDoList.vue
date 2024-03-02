<template>
  <div>
    <a-card style="height: 2px">
      <a-row>
        <a-col :span="4"><a-card :bordered="false"><a-checkbox/></a-card></a-col>
        <a-col :span="20"><a-card :bordered="false">待做</a-card></a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
name: "ToDoList",
  data(){
    return{

    }
  },
  methods:{
    onChange(e) {
      console.log(`checked = ${e.target.checked}`);
    },
  }
}
</script>

<style scoped>

</style>