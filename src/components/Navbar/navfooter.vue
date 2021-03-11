<template>
  <div>
    <el-drawer
      title="我是外面的 Drawer"
      :visible.sync="drawer"
      direction="btt"
      size="130px"
      :close-on-press-escape="false"
      :show-close="false"
      :withHeader="false">
      <div class="footer-content">
        <div class="close-button">
          <a style="margin:auto;" class="down-button" href="javascript:void(0);" @click="drawer=false;"><i class="el-icon-arrow-down"></i></a>
        </div>
        <el-row :gutter="20" style="color:white;">
          <el-col :span="8" :offset="4">
            <ul style="text-align:left;margin:0">
              <li><b>Contact us: </b><a class="my-link" href="mailto:mirror@pku.edu.cn">mirror@pku.edu.cn</a></li>
              <li><b>Github: </b><a class="my-link" href="https://github.com/PKUOSC/">PKUOSC</a></li>
              <li>Hello World :)</li>
            </ul>
          </el-col>
          <el-col :span="8" style="height:100%;">
            <el-image
              style="width: 208px;"
              src="https://www.pku.edu.cn/Uploads/Picture/2019/12/05/s5de8762313bab.png"
              fit="contain"></el-image>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <div class="open-button">
      <a style="margin:auto;" class="up-button" href="javascript:void(0);" @click="drawer=true;"><i class="el-icon-arrow-up"></i></a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navFooter',
  data () {
    return {
      drawer: false
    }
  }
}
</script>

<style scoped>
.footer-content {
  padding: 30px 0px;
  text-align: center;
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
.close-button {
  height: 25px;
  width: 30px;
  position: absolute;
  top: -25px;
  background-color: #505255;
  display: flex;
  align-items: center;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  left: 5%;
  box-shadow: 3px 3px;
}
.open-button {
  height: 25px;
  width: 30px;
  position: fixed;
  bottom: 0px;
  background-color: white;
  display: flex;
  align-items: center;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border: 1px solid;
  box-shadow: 3px 3px;
  left: 5%;
}
</style>

<style>
.el-drawer {
  overflow: visible !important;
}
.el-drawer__body {
  background-color: #505255;
}
</style>
