class Util{
    /**
     * Generate the nth fibonacci number.
     * Uses an array
     * @param {number} n - nth fibonacci number
     * @returns {number}
     */
    static fib(n) {
        let prev = 0;
        if(n <= 0){ return prev; }
        let curr = 1;
        if(n === 1){ return curr; }
        let next = 1;
        for(let i = 2; i <= n; i++) {
            next = curr + prev;
            prev = curr;
            curr = next;
        }
        return next;

    }
    
    /**
     * Sums a sequence of number
     * @param {number} begin - first number of sequence
     * @param {number} end - last number of the sequence
     * @return {number} sum of the sequence
     */
    static sum(begin, end) {
        let res = begin || 0;
        for(let i = res + 1; i < end; i++) {
            res += i;
        }
        return res;
    }
    
    /**
     * Have the program go to sleep for a certain amount of time
     * @param {number} [ms=30] - miliseconds to sleep
     * @returns {Promise<void>} Promise for await
     */
    static sleep(ms=30){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Generates a random string of a given length
     * @param {number} _bytes - size of string to generate (in bytes)
     * @returns {string} generated string
     */
    static generateString(_bytes=0){
        let res = "";
        let len = Math.floor(_bytes / 2); // Each character is 2 bytes
        
        for(let i = 0; i < len; i++){
            let code = Math.floor(Math.random() * 65535);
            res += String.fromCharCode(code);
        }
        return res;
    }
    
    /**
     * Generates an array of numbers given the first and last number of the array
     * @param {number} begin - first number of the array
     * @param {number} end - last number of the array
     * @param {number} [inc=1] - size of step to take between each number
     * @returns {number[]} generated array
     */
    static generateArray(begin, end, inc=1) {
        let res = [];
        let temp = begin;
        while(temp < end){
            res.push(temp);
            temp += inc;
        }
        res.push(end);
        return res;
    }
}

export default Util;