export default {
    *[Symbol.iterator]() {
        let entries = Object.entries(this);
        for(let [key, value] of entries){
            yield [key, value];
        }
    }
}
