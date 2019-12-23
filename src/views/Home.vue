<template>
    <div class="home">
        <h2>表单实践：</h2>
        <hj-form :model="dataModel" :rules="rules">
            <hj-form-item label="用户名" prop="username">
                <hj-input v-model="dataModel.username"></hj-input>
            </hj-form-item>
            <hj-form-item label="密码" prop="password">
                <hj-input type="password" v-model="dataModel.password"></hj-input>
            </hj-form-item>
        </hj-form>
        <p>{{`${dataModel.username}/${dataModel.password}`}}</p><br/>
        <sapi-upload-file v-model="uploadList" first-char="upper"></sapi-upload-file>
    </div>
</template>

<script>
    import {waitRequest} from '../common/utils/tools.js'
    import test from '../common/test'
    export default {
        name: 'home',
        data() {
            return {
                dataModel:{
                    username:'',
                    password:''
                },
                rules:{
                    username:[{required:true,message:'请输入用户名', trigger: ['change']}],
                    password:[{required:true,message:'请输入密码', trigger: ['change']}]
                },
                searchValue: '',
                randomId:[],
                uploadList:[{
                    FilePath:'/path/upload',
                    FileName:'test',
                    FileSize:'1024kb',
                    Extension:'.jpg',
                    UploadDate:'2019-12-19',
                    Uploader:'admin',
                    UploaderId:'adminId',
                    id:'id-123456'
                }]
            }
        },
        components: {},
        methods:{

        },
        created() {

        }
    }
</script>
