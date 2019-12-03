<template>
    <div class="hj-form-item">
        <div class="item-box">
            <label v-if="label" :class="{'form-item-must': !!prop}">{{label}}</label>
            <div><slot></slot></div>
        </div>
        <p class="hj-form-err">{{msg}}</p>
    </div>
</template>

<script>
    import Schema from 'async-validator'
    export default {
        name: "hj-form-item",
        data() {
            return {
                msg: ''
            }
        },
        inject:['form'],
        props: {
            label: {
                type: String,
                default: ''
            },
            prop:{
                type: String,
                default: ''
            }
        },
        methods: {
            validate() {
                //执行具体校验工作
                //1、获取校验规则
                const rules = this.form.rules[this.prop];
                //2、获取数据模型
                const value = this.form.model[this.prop];
                //3、校验对象
                const descriptor = { [this.prop]: rules};
                //4、创建校验器
                const schema = new Schema(descriptor);
                //5、校验
                schema.validate({[this.prop]:value},err => {
                    this.msg = err ? err[0].message : '';
                })
            }
        },
        mounted(){
            this.$on('validate',this.validate);
        }
    }
</script>

<style scoped>
    .hj-form-err{
        color:red;
    }
</style>
