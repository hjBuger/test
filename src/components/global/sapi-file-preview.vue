<template>
    <div class="sapi-file-preview" ref="sapiFilePreview" :class="{'preview-fullscreen': fullscreen}" v-show="visible">
        <div class="image-preview-box" ref="imagePreviewBox">
            <div class="image-header">
                <span class="image-header-title">图片标题图片标题图片标题图片标题图片标题图片标题</span>
                <span class="image-header-close el-icon-close" @click="close"></span>
            </div>
            <div class="image-view" ref="imageView">
                <ul>
                    <li v-for="item in fileList" ref="liItem"><img :src="item" ref="imageFiles"/></li>
                </ul>
            </div>
            <div class="image-footer">
                <span class="el-icon-arrow-left" @click="next"></span>
                <span class="el-icon-arrow-right" @click="next('next')"></span>
                <span class="el-icon-zoom-in" @click="changeScale('max')"></span>
                <span class="el-icon-zoom-out" @click="changeScale('min')"></span>
                <span class="el-icon-refresh-left" @click="rotate('left')"></span>
                <span class="el-icon-refresh-right" @click="rotate('right')"></span>
                <span class="el-icon-refresh"  @click="refresh"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "sapi-file-preview",
        data() {
            return {
                resizeTimeout: null,
                mousewheelTimeout: null,
                visible: true,
                scale: 1,
                fileList:[],
                imageDomELs: [],
                currentIndex: 0,
                liItems: [],
                len: 0,
                canNext: true
            }
        },
        props: {
            files: {
                type: [String,Object,Array],
                default: ''
            },
            width: String,
            height: String,
            previewExtend: Function,
            fullscreen: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            initData(){
                this.imageDomELs = this.$refs.imageFiles || [];
                this.liItems = this.$refs.liItem || [];
                this.len = this.liItems.length;
                this.setImgSize(this.imageDomELs);
                this.currentHandle(this.liItems);
                this.mouseWheelHandle();
            },
            mouseWheelHandle(){
                let imageView = this.$refs.imageView;
                let scale = 1;
                imageView.addEventListener('mousewheel', () => {
                    clearTimeout(this.mousewheelTimeout);
                    this.mousewheelTimeout = setTimeout(() => {
                        scale += 0.1;
                        this.setStyle(this.liItems[this.currentIndex], { transform: `scale(${scale})`});
                    },120);
                },false)
            },
            currentHandle(lis){
                lis.forEach(li => this.setStyle(li, { left: '100%'}));
                this.setStyle(lis[this.currentIndex], { left: '0'});
            },
            changeScale(type){

            },
            refresh(){

            },
            rotate(type){

            },
            next(type){
                if(!this.canNext) return;
                this.canNext = false;
                let isNext = type === 'next';
                let now = isNext ? this.currentIndex ++ : this.currentIndex --;
                this.currentIndex = isNext ? this.currentIndex % this.len : (this.currentIndex < 0 ? this.len - 1 : this.currentIndex);
                this.setStyle(this.liItems[now], { left: '-100%', opacity: 0});
                this.setStyle(this.liItems[this.currentIndex], { left: '0', opacity: 1});
                setTimeout(() => {
                    this.setStyle(this.liItems[now], { left: '100%'});
                    this.canNext = true;
                },500)
            },
            getFileList(){
                let type = Object.prototype.toString.call(this.files);
                switch (type) {
                    case '[object String]': type = 'string';break;
                    case '[object Object]': type = 'object';break;
                    case '[object Array]': type = 'array';break;
                }
                if(type === 'string') this.fileList.push(this.files);
                if(type === 'array') this.fileList.push(...this.files);
            },
            setImgSize(imageFiles){
                if(!imageFiles || imageFiles.length < 1) return;
                imageFiles.forEach(img => {
                    let iScale = +(img.naturalWidth / img.naturalHeight).toFixed(2);
                    console.log(img.naturalWidth,img.naturalHeight,iScale,this.scale);
                    if( iScale > this.scale){
                        img.style.width = '100%';
                        img.style.height = 'auto';
                    }else{
                        img.style.width = 'auto';
                        img.style.height = '100%';
                    }
                })
            },
            previewBoxDrag(){
                let vm = this;
                let oDrag = this.$refs.sapiFilePreview;
                let aLen = oDrag.length;
                oDrag.onmousedown = function (ev) {
                    ev = ev || event;
                    let _this = this;
                    let disX = ev.clientX - this.offsetLeft;
                    let disY = ev.clientY - this.offsetTop;

                    document.onmousemove = function (ev1) {
                        ev1 = ev1 || event;
                        let L = ev1.clientX - disX;
                        let T = ev1.clientY - disY;

                        //L = vm.limitHandle(L,0,document.documentElement.clientWidth - _this.offsetWidth);
                        //T = vm.limitHandle(T,0,document.documentElement.clientHeight - _this.offsetHeight);

                        _this.style.left = L + "px";
                        _this.style.top = T + "px";
                    };

                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };

                    return false;
                }
            },
            limitHandle(val,minVal,maxVal){
                return Math.min(Math.max(val,minVal),maxVal);
            },
            setWinSize() {
                let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
                let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
                let previewBox = this.$refs.sapiFilePreview;
                this.scale = (winWidth / winHeight).toFixed(2);

                if(!this.fullscreen){
                    winWidth = this.width ? parseInt(this.width) : 750;
                    winHeight = this.height ? parseInt(this.height) : 500;
                    //30是.image-view左右两边padding和，80是header+footer高，20是.image-view上下padding和
                    this.scale = +(winWidth - 30) / (winHeight - 80 - 20);
                }

                previewBox.style.width = `${winWidth}px`;
                previewBox.style.height = `${winHeight}px`;


            },
            winResize(){
                window.addEventListener('resize', () => {
                    clearTimeout(this.resizeTimeout);
                    this.resizeTimeout = setTimeout(() => {
                        this.setWinSize();
                    },120);
                }, false)
            },
            setStyle(obj, attrs = {}){
                for(let key in attrs){
                    if(attrs.hasOwnProperty(key)){
                        obj.style[key] = attrs[key];
                    }
                }
            },
            close(){

            }
        },
        created() {
            this.getFileList();
        },
        mounted() {
            this.$nextTick(function () {
                this.setWinSize();
                this.winResize();
                if(!this.fullscreen){
                    this.previewBoxDrag();
                }
                this.initData();
            })
        }
    }
</script>

<style lang="less" scoped>
    .sapi-file-preview{
        display: flex;
        position: fixed;
        z-index: 2020;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        box-sizing: border-box;
        border-radius: 6px;
        overflow: hidden;

        background: rgba(0,0,0,.7);
        .image-preview-box{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .image-header{
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            text-align: left;
            color:#fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 0 5px rgba(255,255,255,.3) inset;
        }
        .image-header-title{
            padding: 0 15px;
            display: block;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: keep-all;
            white-space: nowrap;
        }
        .image-header-close{
            display: flex;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            font-size: 16px;
            margin-right: 15px;
            cursor: pointer;
            align-items: center;
            justify-content: center;

            transition: .5s;
            &:hover{
                background: #9a9a9a;
                color: #000;
                transform: rotate(180deg);
            }
        }
        .image-view{
            padding: 10px 15px;
            height: 420px;
            box-sizing: border-box;
            overflow: hidden;
            ul,li{
                padding:0;
                margin: 0;
                width: 100%;
                height: 100%;
                position: relative;
                overflow: hidden;
                display: flex;
            }
            li{
                position: absolute;
                left: 100%;
                transition: left .5s, opacity .5s;
                opacity:0;
                align-items: center;
                justify-content: center;
                &:first-child{
                    left:0;
                    opacity:1;
                }
            }
            img{
                display: block;
                margin: 0 auto;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .image-footer{
            height: 40px;
            line-height: 40px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 5px rgba(255,255,255,.3) inset;
            span{
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 22px;
                cursor: pointer;
                padding: 3px;
                margin: 0 2px;
                transition: .5s;

                &:hover{
                    background: rgba(0,0,0,.3);
                }
            }
        }
    }
    .preview-fullscreen{
        border-radius: 0;
    }
</style>