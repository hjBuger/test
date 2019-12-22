<template>
    <div class="upload-wrap">
        55555
    </div>
</template>

<script>
    export default {
        data(){
            return {
                serverList:[],
                fileList:[],
                uploader:'',
                btnText:'',
                timeout:'',
                loadFormat:'',
                isOnly:false,
                keyMap:{
                    filePath:'',
                    fileName:'',
                    fileSize:'',
                    extension:'',
                    uploadDate:'',
                    uploader:'',
                    uploaderId:'',
                    id:'id',
                    status:''
                },
                baseUrl:''
            }
        },
        props:{
            //文件列表
            value: [Array, Object],
            //文件上传最大值
            size: [Number, String],
            //文件上传数量
            count: [Number, String],
            //允许上传的文件类型，这个是文件选择之后需要校验的内容
            type: String,
            //空值占位
            placeholder: String,
            //是否只读
            readonly: [Boolean, String],
            //上传路径
            url: String,
            //上传到哪个文件夹（data和另外一个）
            isResource: { type: Boolean, default: false },
            //接收的文件类型，注意这个跟type是有区别的，这个只是在选择时，自定义的选择类型
            accept: {
                type: String,
                default: null
            },
            //是否显示上传者
            hasUser: { type: Boolean, default: true },
            //是否显示大小
            hasSize: { type: Boolean, default: true },
            //是否显示日期
            hasDate: { type: Boolean, default: true },
            //是否显示下载
            hasLoad: { type: Boolean, default: true },
            //是否显示删除
            hasDelete: { type: Boolean, default: true },
            //是否可预览
            hasPreview: { type: Boolean, default: true },
            //图片预览扩展下方 带一个参数：item
            previewExtend: Function,
            //用来扩展下载的 带一个参数：item
            downloadExtend: Function,
            //文件上传方法扩展 带三个参数 formData/succesFn/errorFn
            uploadExtend: Function,
            //字段首字母小写
            isFirstCharLower: false
        },
        watch:{

        },
        computed: {

        },
        methods: {
            init() {
                //this.baseUrl = (this.$webConfig.fileServer || this.$webConfig.baseUrl) + "/";
                this.serverList = this.value ? [].concat(this.value) : [];
                this.fileList = [];
                let len = this.serverList.length;

                //设置keyMap
                let keys = typeof this.serverList[0] === 'object' ? Object.keys(this.serverList[0]) : [];
                let defaultSettingKeys = len > 0 ? 'setKeyMap' : 'keySetting';
                this[defaultSettingKeys](keys);

                //将数据key值全部转为keyMap设定的key，即全部转为首字母小写
                let keyMapKeys = Object.keys(this.keyMap);
                this.fileList = this.serverList.map(item => Object.fromEntries( keyMapKeys.map(key => [key, item[this.keyMap[key]]]) ));

                console.log('fileList: ', this.fileList);
            },
            success(res, fileData){
                let uploadDate = res.UploadDate;
                let uploader = (this.uploader = res.Uploader);
                let uploaderId = res.UploaderId;
                let fileList = res.Files;
                fileList.forEach(item => {
                    this.fileList.push({
                        [this.keyMap.filePath]: item.RelativePath,
                        [this.keyMap.fileName]: item.FileName,
                        [this.keyMap.fileSize]: item.Length,
                        [this.keyMap.extension]: item.Extension,
                        [this.keyMap.id]: item.id,
                        [this.keyMap.uploadDate]: uploadDate,
                        [this.keyMap.uploader]: uploader,
                        [this.keyMap.uploaderId]: uploaderId
                    })
                });

                this.$emit("input", this.fileList);
                this.$emit("change", this.fileList);
            },
            //字段匹配
            setKeyMap(keys){
                if(!keys) return;
                keys.forEach(key => {
                    let firstLowerKey = key.charAt(0).toLowerCase() + key.slice(1);
                    this.keyMap[firstLowerKey] = key;
                })
            },
            //字段设置
            keySetting(){
                let caseMethod = this.isFirstCharLower ? 'toLowerCase' : 'toUpperCase';
                let keys = Object.keys(this.keyMap);
                keys.forEach(key => {
                    this.keyMap[key] = key.charAt(0)[caseMethod]() + key.slice(1);
                });
            }
        },
        created() {
            this.init();
        }
    }
</script>

<style lang="less">
    .upload-wrap{

    }
</style>