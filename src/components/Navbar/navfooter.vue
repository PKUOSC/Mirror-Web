<template>
  <div class="footer-container">
    <div class="footer-content">
      <el-row :gutter="20" style="color:white;">
        <el-col :span="8" :offset="4">
          <ul style="text-align:left;margin:0">
            <li><b>Contact us: </b><a class="my-link" href="mailto:mirror@pku.edu.cn">mirror@pku.edu.cn</a></li>
            <li><b>Github: </b><a class="my-link" href="https://github.com/PKUOSC/">PKUOSC</a></li>
            <li><b>Issues: </b><a class="my-link" href="https://github.com/PKUOSC/issues/">Submit an issue.</a></li>
          </ul>
        </el-col>
        <el-col :span="8">
          <el-image
            style="width: 208px;"
            src="https://www.pku.edu.cn/Uploads/Picture/2019/12/05/s5de8762313bab.png"
            fit="contain"></el-image>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navFooter',
  data () {
    return {}
  }
}
</script>

<style scoped>
.footer-content {
  padding: 30px 0px;
  text-align: center;
  overflow: hidden;
}
.up-button, .down-button {
  text-decoration: none;
}
.up-button {
  color: black;
}
.my-link {
  text-decoration: underline;
  color: rgb(206, 206, 206);
}
.down-button {
  color: white;
}
.footer-container {
  background-color: #505255;
}
</style>
