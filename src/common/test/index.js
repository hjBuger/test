class Test {
    constructor(options) {
        this.options = options;
    }

    static install(_Vue) {
        console.log('this is static method install');
    }

    bindEvent() {
        console.log('this is method bindEvent');
    }
}
