<template>
    <div class="hj-form">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "hj-form",
        provide(){
            return {
                form:this
            }
        },
        props: {
            model: {
                type: Object,
                default(){
                    return{}
                }
            },
            rules:{
                type:Object,
                default(){
                    return{}
                }
            }
        },
        methods: {
            validate(fn) {
                let valid = true;
                fn(valid)
            }
        },
    }
</script>

<style scoped>

</style>
