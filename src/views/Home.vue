<template>
    <div class="home">
        <!--<el-button type="primary">预览</el-button>-->
        <sapi-file-preview :files="files" :fullscreen="false" v-model="visible"></sapi-file-preview>
    </div>
</template>

<script>
    import {waitRequest} from '../common/utils/tools.js'
    import test from '../common/test'
    export default {
        name: 'home',
        data() {
            return {
                visible: true,
                files:['/images/logo.png','/images/a1.png','/images/22.png','/images/timg.jpg']
            }
        },
        components: {},
        methods:{

        },
        created() {

        }
    }
</script>
