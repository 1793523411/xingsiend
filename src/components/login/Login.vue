<template>
<div class="bg">
    <!-- <div class="bg"></div> -->
    <el-card class="box-card">
        <el-container>
            <el-header><h2>行思后台管理</h2></el-header>
            <el-main style="padding-bottom:0">
                <el-form label-position="left" label-width="80px" :model="formLabelAlign">
                    <el-form-item label="用户名">
                        <el-input v-model="username" prefix-icon="el-icon-user-solid
" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="password" type="password" prefix-icon="el-icon-s-goods
" placeholder="请输入密码"></el-input>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-footer>
                <el-button type="primary" @click="login" style="width:200px;font-weight:bold;">登&nbsp;录</el-button>
            </el-footer>
        </el-container>
    </el-card>
</div>
</template>

<script>
export default {
    data() {
        return {
            formLabelAlign: {
                name: "",
                region: "",
            },
            username: "",
            password: "",
        };
    },
    methods: {
        async login() {
            let data = {
                username: this.username,
                password: this.password,
            };
            await this.$http.post('/login', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                window.sessionStorage.setItem('token', res.headers.authorization)
            });
            this.$router.push("/home");
        },
    },
};
</script>

<style>
.box-card {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
}

el.main {
    padding: 0;
}

.el-header,
.el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.bg {
    height: 100%;
    width: 100%;
    background: url(../../assets/img/bgc.jpg) no-repeat;
    background-position: center center;
    background-attachment: fixed;
    background-size: cover;
    background-color: #464646;
}
</style>
