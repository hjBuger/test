<template>
    <div class="hj-input">
        <input :type="type" :value="value" @input="emitValue" class="hj-input-inner" />
    </div>
</template>

<script>
    export default {
        name: "hjInput",
        props: {
            type: {
                type: String,
                default: 'text'
            },
            value:{
                type:String,
                default: ''
            }
        },
        methods: {
            emitValue(ev) {
                this.$emit('input', ev.target.value);
                this.$emit('change', ev.target.value);
                this.$parent.$emit('validate');
            }
        },
    }
</script>

<style scoped lang="less">

</style>
