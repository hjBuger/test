<template>
    <div class="sapi-file-preview" ref="sapiFilePreview" :class="{'preview-fullscreen': fullscreen}" v-show="visible">
        <div class="image-preview-box" ref="imagePreviewBox">
            <!-- 头部区域 -->
            <div class="image-header" ref="imageHeader">
                <span class="image-header-title" :title="previewTitle">{{previewTitle}}</span>
                <span class="image-header-close el-icon-close" @click="close"></span>
            </div>
            <!-- 主体区域 -->
            <div class="image-view" ref="imageView">
                <ul>
                    <li v-for="item in fileList" ref="liItem"><img :src="item" ref="imageFiles"/></li>
                </ul>
            </div>
            <!-- 底部区域 -->
            <div class="image-footer">
                <span v-for="item in imageFooterData" :class="item.className" @click="item.action(item.params)" :title="item.name" v-show="item.isShow"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "sapi-file-preview",
        data() {
            return {
                previewTitle:'图片预览',
                resizeTimeout: null,
                mousewheelTimeout: null,
                visible: false,
                scale: 1,
                fileList:[],
                imageDomELs: [],
                currentIndex: 0,
                currentItem:null,
                previousIndex: 0,
                previousItem:null,
                liItems: [],
                len: 0,
                canNext: true,
                animationDelay: '.5s',
                //底部按钮数据
                imageFooterData:[
                    {
                        id: 'previous',
                        name:'上一张',
                        className: 'el-icon-arrow-left',
                        action: this.next,
                        params: 'previous',
                        isShow: true
                    },
                    {
                        id: 'next',
                        name:'下一张',
                        className: 'el-icon-arrow-right',
                        action: this.next,
                        params: 'next',
                        isShow: true
                    },
                    {
                        id: 'maxScale',
                        name:'放大',
                        className: 'el-icon-zoom-in',
                        action: this.changeScale,
                        params: 'max',
                        isShow: true
                    },{
                        id: 'minScale',
                        name:'缩小',
                        className: 'el-icon-zoom-out',
                        action: this.changeScale,
                        params: 'min',
                        isShow: true
                    },
                    {
                        id: 'leftRotate',
                        name:'左旋转',
                        className: 'el-icon-refresh-left',
                        action: this.rotate,
                        params: 'left',
                        isShow: true
                    },
                    {
                        id: 'rightRotate',
                        name:'右旋转',
                        className: 'el-icon-refresh-right',
                        action: this.rotate,
                        params: 'right',
                        isShow: true
                    },
                    {
                        id: 'refresh',
                        name:'还原',
                        className: 'el-icon-refresh',
                        action: this.refresh,
                        params: '',
                        isShow: true
                    }
                ],
                defaultSize:{
                    width: 750,
                    height: 500
                }
            }
        },
        props: {
            value:[Boolean, String],
            //文件路径列表
            files: {
                type: [String, Array],
                default: ''
            },
            //窗口宽高
            width: String,
            height: String,
            //是否全屏
            fullscreen: {
                type: Boolean,
                default: false
            },
            /**
            * 图片响应尺寸
            * content：宽或高100%、另一属性auto
            * auto：容器满足原尺寸则显示原尺寸,否则content布局
            * cover：铺满容器（会被隐藏部分视图）
            * ***/
            sizing:{
                type: String,
                default: 'content'
            },
            //拖拽范围限制，true则限制在可视区
            dragLimit:{
                type: Boolean,
                default: false
            }
        },
        watch: {
            value(val) {
                if(val) {
                    this.resetData();
                }
                this.visible = val;
            }
        },
        methods: {
            //初始化
            initData(){
                this.imageDomELs = this.$refs.imageFiles || [];
                this.liItems = this.$refs.liItem || [];
                this.len = this.liItems.length;
                this.setImgSize(this.imageDomELs);
                this.currentHandle(this.liItems);
                this.mouseWheelHandle();
            },
            //全屏
            fullScreenAction(){

            },
            //mousewheel事件处理
            mouseWheelHandle(){
                let imageView = this.$refs.imageView;
                let scale = 1;
                imageView.addEventListener('mousewheel', (ev) => {
                    let type = ev.wheelDeltaY < 0 ? 'min' : 'max';
                    this.changeScale(type, 0.3);
                },false)
            },
            //初始化选中项
            currentHandle(lis){
                lis.forEach(li => li.className = 'li-hide');
                lis[this.currentIndex].className = 'li-show';
            },
            //改变缩放
            changeScale(type, coefficient = 0.2){
                this.liItems[this.currentIndex].setAttribute('rotate', 0);
                let scale = this.liItems[this.currentIndex].getAttribute('scale') || '1';
                scale = type === 'max' ? +scale + coefficient  : +scale - coefficient;
                scale = scale < 0.2 ? 0.2 : scale;
                scale = scale > 2.5 ? 2.5 : scale;

                this.liItems[this.currentIndex].setAttribute('scale', scale + '');
                this.setStyle(this.liItems[this.currentIndex], {transform: `scale(${ scale })`});
            },
            //还原
            refresh(){
                this.liItems[this.previousIndex].style = '';
                this.liItems[this.currentIndex].style = '';
                this.liItems[this.previousIndex].setAttribute('rotate', 0);
                this.liItems[this.currentIndex].setAttribute('rotate', 0);
                this.liItems[this.previousIndex].setAttribute('scale', '1');
                this.liItems[this.currentIndex].setAttribute('scale', '1');
            },
            //旋转
            rotate(type){
                this.liItems[this.currentIndex].setAttribute('scale', '1');
                let rotate = parseInt(this.liItems[this.currentIndex].getAttribute('rotate') || 0);
                rotate = type === 'right' ? rotate + 90 : rotate - 90;

                this.liItems[this.currentIndex].setAttribute('rotate', rotate);
                this.setStyle(this.liItems[this.currentIndex], {transform: `rotate(${ rotate }deg)`});
            },
            //下一张
            next(type){
                if(!this.canNext) return;
                //当前和下一张数据处理
                this.canNext = false;
                let isNext = type === 'next';
                this.previousIndex = isNext ? this.currentIndex ++ : this.currentIndex --;
                this.currentIndex = isNext ? this.currentIndex % this.len : (this.currentIndex < 0 ? this.len - 1 : this.currentIndex);

                //动画类名
                let hide = isNext ? `li-hide-left` : `li-hide-right`;
                let show = isNext ? `li-show-left` : `li-show-right`;

                this.liItems[this.previousIndex].className = hide;
                this.liItems[this.currentIndex].className = show;

                //动画结束处理
                this.handelAnimationEnd(this.liItems[this.previousIndex],'hide');
                this.handelAnimationEnd(this.liItems[this.currentIndex],'show');

            },
            //监听animationEnd事件
            handelAnimationEnd(li,type){
                let vm = this;
                let className = type === 'hide' ? 'li-hide' : 'li-show';
                li.addEventListener('animationend', listener, false);

                function listener() {
                    li.className = className;
                    vm.canNext = true;
                    li.removeEventListener('animationend', listener);
                    vm.refresh();
                }
            },
            //获取图片列表
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
            //初始化图片宽高
            setImgSize(imageFiles){
                if(!imageFiles || imageFiles.length < 1) return;
                imageFiles.forEach(img => {
                    let iScale = +(img.naturalWidth / img.naturalHeight).toFixed(2);
                    if( iScale > this.scale){
                        img.style.width = '100%';
                        img.style.height = 'auto';
                    }else{
                        img.style.width = 'auto';
                        img.style.height = '100%';
                    }
                })
            },
            //重置
            resetData(){
                this.getFileList();
                this.settingsReset();
            },
            settingsReset(){
                this.$nextTick(function () {
                    this.setWinSize();
                    this.winResize();
                    if(!this.fullscreen){
                        this.previewBoxDrag();
                    }
                    this.initData();
                })
            },
            //拖拽
            previewBoxDrag(){
                let vm = this;
                let imageHeader = this.$refs.imageHeader;
                let oDrag = this.$refs.sapiFilePreview;
                //容器尺寸
                let boxWidth = this.width ? parseInt(this.width) : this.defaultSize.width;
                let boxHeight = this.height ? parseInt(this.height) : this.defaultSize.height;

                imageHeader.onmousedown = function (ev) {
                    ev = ev || event;
                    let _this = oDrag;
                    let disX = ev.clientX - _this.offsetLeft;
                    let disY = ev.clientY - _this.offsetTop;

                    document.onmousemove = function (ev1) {
                        ev1 = ev1 || event;
                        let L = ev1.clientX - disX;
                        let T = ev1.clientY - disY;

                        //拖拽范围限制
                        if(this.dragLimit){
                            L = vm.limitHandle(L, boxWidth / 2, document.documentElement.clientWidth - boxWidth / 2);
                            T = vm.limitHandle(T, boxHeight / 2, document.documentElement.clientHeight - boxHeight / 2);
                        }

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
            //范围限制
            limitHandle(val,minVal,maxVal){
                return Math.min(Math.max(val,minVal),maxVal);
            },
            //设置窗口尺寸
            setWinSize() {
                //获取可视区宽高
                let winWidth = document.documentElement.clientWidth || document.body.clientWidth;
                let winHeight = document.documentElement.clientHeight || document.body.clientHeight;
                let previewBox = this.$refs.sapiFilePreview;
                this.scale = (winWidth / winHeight).toFixed(2);

                //弹窗形式控制
                if(!this.fullscreen){
                    winWidth = this.width ? parseInt(this.width) : this.defaultSize.width;
                    winHeight = this.height ? parseInt(this.height) : this.defaultSize.height;

                    //30是.image-view左右两边padding和，80是header+footer高，20是.image-view上下padding和
                    this.scale = +(winWidth - 30) / (winHeight - 80 - 20);
                }

                previewBox.style.width = `${winWidth}px`;
                previewBox.style.height = `${winHeight}px`;


            },
            //监听window。onresize
            winResize(){
                window.addEventListener('resize', () => {
                    clearTimeout(this.resizeTimeout);
                    this.resizeTimeout = setTimeout(() => {
                        this.setWinSize();
                    },120);
                }, false)
            },
            //获取transform值
            transformValue(tf){
                let rot;
                return ``;
            },
            //移除属性
            removeAttribute(obj, attrs = []){
                attrs.forEach(attr => obj.removeAttribute(attr));
            },
            //设置DOM对象style值
            setStyle(obj, attrs = {}){
                Object.keys(attrs).forEach(key => obj.style[key] = attrs[key]);
            },
            //关闭
            close(){
                this.$emit('input', false);
            }
        },
        created() {
            this.getFileList();
        },
        mounted() {
            this.settingsReset();
            this.visible = this.value;
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
            cursor: move;
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
                opacity:0;
                align-items: center;
                justify-content: center;
                transform-origin: center center;
                transition: transform .15s;
                &:first-child{
                    left:0;
                    opacity:1;
                }
                &.li-hide-left{
                    animation: to-left-hide .5s;
                }
                &.li-show-left{
                    animation: to-left-show .5s;
                }
                &.li-hide-right{
                    animation: to-right-hide .5s;
                }
                &.li-show-right{
                    animation: to-right-show .5s;
                }
                &.li-hide{
                    left: 100%;
                    opacity:0;
                }
                &.li-show{
                    left: 0;
                    opacity: 1;
                }
            }
            img{
                display: block;
                margin: 0 auto;
                width: 100%;
                height: 100%;
                object-fit: cover;
                user-select: none;
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
    .li-hide{
        left: 100%;
        opacity:0;
    }
    .li-show{
        left: 0;
        opacity: 1;
    }
    @keyframes to-left-hide {
        from{
            left:0;
            opacity:1;
        }
        to{
            left: -100%;
            opacity:0;
        }
    }
    @keyframes to-left-show {
        from{
            left: 100%;
            opacity:0;
        }
        to{
            left: 0;
            opacity: 1;
        }
    }
    @keyframes to-right-hide {
        from{
            left:0;
            opacity:1;
        }
        to{
            left: 100%;
            opacity:0;
        }
    }
    @keyframes to-right-show {
        from{
            left: -100%;
            opacity:0;
        }
        to{
            left: 0;
            opacity: 1;
        }
    }
</style>
