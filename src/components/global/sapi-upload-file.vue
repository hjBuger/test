<template>
    <div class="sapi-upload-wrap">
        <section class="upload-type-button" v-if="showType !== 'input'">
            <el-upload action="" :accept="accept" v-if="readonly!==true" :disabled="false" class="btn-upload-file" :on-change="changeHandle" :multiple="true" :auto-upload="false" :show-file-list="false" :file-list="fileList">
                <el-button :type="showType === 'link' ? 'text' : 'default'" :icon="buttonIcon" size="small" placeholder="" :disabled="false" class="el-button" v-text="buttonText ? buttonText : btnText"></el-button>
            </el-upload>
        </section>
        <section class="upload-type-input" v-if="showType === 'input'">
            <div class="input-wrap" :class="{'more-list':fileList.length > 1}">
                <p class="place-holder" v-show="fileList.length < 1">{{placeholder ? placeholder : '请选择文件'}}</p>
                <ul class="file-list-wrap" v-show="fileList.length > 0">
                    <li v-for="(file, index) in fileList">
                        <div class="file-list-link">
                            <img :src="getFileIcon(file)" alt="" @error="imgError($event)">
                            <a href="javascript:void(0)" @click="previewData(file)" :title="getFileText(file,'title')">{{ getFileText(file) }}</a>
                        </div>
                        <div class="file-list-btns">
                            <span v-show="hasSize">{{ sizeHandle(file) }}</span>
                            <span v-show="hasDate">{{ dateHandle(file) }}</span>
                            <a href="javascript:void(0)" v-show="hasLoad" @click.stop="downloadData(file)">下载</a>
                            <a href="javascript:void(0)" v-show="hasDelete" @click.stop="deleteData(file, index)">删除</a>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="btn-wrap">
                <el-upload action="" :accept="accept" v-if="readonly!==true" :disabled="false" class="btn-upload-file" :on-change="changeHandle" :multiple="true" :auto-upload="false" :show-file-list="false" :file-list="fileList">
                    <el-button size="small" placeholder="" :disabled="false" class="el-button" :icon="buttonIcon" v-text="buttonText ? buttonText : btnText"></el-button>
                </el-upload>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //组件外部传入数据
                sourceFileList: [],
                //整理好的文件数据
                fileList: [],
                //定时器
                timeout: null,
                isOnly: false,
                // btnText: this.$t("sapiUpload.uploadWhenClick"),
                //按钮文字
                btnText: '下载文件',
                //上传用户
                uploader: "",
                //上传格式
                loadFormat: null,
                //字段匹配
                keyMap: {
                    filePath:'filePath',
                    fileName:'fileName',
                    fileSize:'fileSize',
                    extension:'extension',
                    uploadDate:'uploadDate',
                    uploader:'uploader',
                    uploaderId:'uploaderId',
                    id:'id'
                }
            }
        },
        props:{
            //文件列表
            value:{
                type:[Object,Array]
            },
            //展示形式：link、input、button
            showType:{
                type:String,
                default:'input'
            },
            //按钮文字
            buttonText:String,
            //按钮图标
            buttonIcon:String,
            //首字母大小写：lower、upper
            firstChar:{
                type:String,
                default:'lower'
            },
            //文件上传最大值
            size: [Number, String],
            //文件上传数量
            count: [Number, String],
            placeholder: String,
            //是否只读
            readonly: [Boolean, String],
            //上传路径
            url: String,
            //上传到哪个文件夹（data和另外一个）
            isResource: {
                type: Boolean,
                default: false
            },
            //允许上传的文件类型，这个是文件选择之后需要校验的内容
            type: String,
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
            uploadExtend: Function
        },
        watch: {
            value(newValue, oldValue) {
                this.initData();
            }
        },
        computed: {
            caseMethod(){
                return this.firstChar === 'upper' ? 'toUpperCase' : 'toLowerCase';
            },
            uploadUrl(){
                return ``;
            },
            baseUrl(){
                // return `${(this.$webConfig.fileServer || this.$webConfig.baseUrl)}/`
                return ``
            }
        },
        methods: {
            //数据初始化
            initData() {
                //设置数据
                this.sourceFileList = this.value ? [].concat(this.value) : [];
                this.fileList = [];

                //设置keyMap
                let keys = this.setKeyMap();
                this.fileList = this.sourceFileList.map(item => this.fromEntries( keys.map(key => [key, item[this.keyMap[key]]]) ));

                console.log('sapi-upload-file fileList: ', this.fileList);
            },
            //数据处理
            dataHandle(){

            },
            //数据大小处理
            sizeHandle(file){
                if (!file || !file.fileSize) return "0 KB";
                let fileSize = Math.ceil(file.fileSize / 1024);
                if (fileSize >= 1024) {
                    return (fileSize / 1024).toFixed(2) + " MB";
                }
                return fileSize + " KB";
            },
            //日期处理
            dateHandle(file){
                // return this.$dateFormat('yyyy-MM-dd hh:mm', file.uploadDate);
                return file.uploadDate;
            },
            //改变处理
            changeHandle(file, fileList){

            },
            //Url处理
            exportUrlHandle(file){
                let basePath = this.baseUrl + "/api/plat/shares/download?relativePath=";
                let path = basePath + file.filePath + "&downloadFileName=" + encodeURIComponent(file.fileName);
                // return path + "&access_token=" + this.$clientStorage.get("access_token");
                return path + "&access_token=null";
            },
            //上传数据
            uploadData(){

            },
            //下载数据
            downloadData(file){
                if (typeof this.downloadExtend === "function") {
                    this.downloadExtend(file);
                    return;
                }
                let path = this.exportUrlHandle(file);
                window.open(path, file.fileName);
            },
            //文件预览
            previewData(file){

            },
            //文件预览处理
            previewDataHandle(){

            },
            //文件预览方法
            previewDataFn(){

            },
            //错误处理
            errorHandel(){

            },
            //成功处理
            successHandle(){
                this.emitEvent();
            },
            //移除数据
            deleteData(file, index){
                let list = this.fileList.filter(item => item.id !== file.id);
                this.emitEvent(list);
            },
            //通知父组件改变数据
            emitEvent(list = []){
                let data = list.map(item => ({
                    [this.keyMap.filePath]: item.filePath,
                    [this.keyMap.fileName]: item.fileName,
                    [this.keyMap.fileSize]: item.fileName,
                    [this.keyMap.extension]: item.extension,
                    [this.keyMap.uploadDate]: item.uploadDate,
                    [this.keyMap.uploader]: item.uploader,
                    [this.keyMap.uploaderId]: item.uploaderId,
                    [this.keyMap.id]: item.id
                }));
                this.$emit('input', data);
                this.$emit('change', data);
            },
            //fromEntries兼容处理
            fromEntries(map){
                if (Object.fromEntries) return Object.fromEntries(map);
                let entries = {};
                map.forEach(([key,value]) => entries[key] = value );
                return  entries;
            },
            //字段匹配
            setKeyMap(){
                let keys = Object.keys(this.keyMap);
                //默认设置
                if(this.firstChar !== 'upper') return keys;
                //匹配设置,id一直小写
                keys.forEach(key => {
                    if(key !== 'id'){
                        this.keyMap[key] = key.charAt(0).toUpperCase() + key.slice(1);
                    }
                });
                return keys;
            },
            //获取文件文本
            getFileText(file, type){
                let fileName = file.fileName + file.extension;
                let uploader = this.hasUser ? (file.uploader ? `（${file.uploader}）` : '') : '';
                return  type === 'title' ? fileName : uploader + fileName;
            },
            //获取文件图标
            getFileIcon(file){
                let extension = file ? ( file.extension ? file.extension.split(".")[1] : '_' ) : '_';
                return "/static/file-extension/" + extension.trim() + ".png";
            },
            //获取文件图标出错
            imgError(e) {
                e.target.src = "/static/file-extension/_.png";
            },
        },
        created() {
            this.initData();
        }
    }
</script>

<style lang="less">
    .sapi-upload-wrap{
        @fontSize:13px;
        .upload-type-button{
            display: inline-block;
        }
        .upload-type-input{
            display: flex;
            width: 100%;
            box-sizing: border-box;
            font-size: @fontSize;
            justify-content: space-between;
            align-items: center;

            .input-wrap{
                display: flex;
                /*width: 100%;*/
                /*height: 100%;*/
                max-height: 36px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 4px;
                line-height: 34px;
                flex: 1;
                overflow: hidden;
            }
            .btn-wrap{
                margin-left: 10px;
                align-self: flex-start;
                .btn-upload-file{
                    .el-button--small{
                        padding: 11px 10px;
                    }
                }
            }
            .place-holder{
                padding:0 12px;
                margin:0;
                color: #b8b8b8;
                user-select: none;
            }
            .file-list-wrap{
                margin: 0;
                padding:0;
                list-style: none;
                flex: 1;
                overflow: hidden;
                li{
                    width: 100%;
                    padding:0 5px;
                    display: flex;
                    box-sizing: border-box;
                }
                .file-list-link{
                    display: flex;
                    align-items: center;
                    overflow-x: hidden;
                    flex: 1;
                    a{
                        flex: 1;
                        padding-right: 5px;
                        text-align: left;
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                    }
                    img{
                        display: block;
                        margin-right: 5px;
                        width: 16px;
                        height: 16px;
                        object-fit: cover;
                    }
                }
                .file-list-btns{
                    a,span{
                        padding: 0 3px;
                    }
                }
            }
            .more-list{
                border: none;
                .file-list-wrap li{
                    margin-bottom: 2px;
                    background: #f6f6f6;
                    &:last-child{
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
</style>
