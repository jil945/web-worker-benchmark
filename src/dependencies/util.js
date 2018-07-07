const TICK = 30;

class Util{
    static fib(_num) {
        let prev = 0;
        if(_num <= 0){ return prev; }
        let curr = 1;
        if(_num === 1){ return curr; }
        let next = 1;
        for(let i = 2; i <= _num; i++) {
            next = curr + prev;
            prev = curr;
            curr = next;
        }
        return next;

    }
    
    static sum(_begin, _end) {
        let res = _begin || 0;
        for(let i = res + 1; i < _end; i++) {
            res += i;
        }
        return res;
    }
    
    static sleep(_ms=TICK){
        return new Promise(resolve => setTimeout(resolve, _ms));
    }
    
    static generateString(_bytes=0){
        let res = "";
        let len = Math.floor(_bytes / 2); // Each character is 2 bytes
        
        for(let i = 0; i < len; i++){
            let code = Math.floor(Math.random() * 65535);
            res += String.fromCharCode(code);
        }
        return res;
    }
    
    static generateArray(begin, end, inc) {
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