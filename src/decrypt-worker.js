importScripts('./dependencies/BigInteger.min.js', './dependencies/rsa.js');

self.onmessage = function(e){
    let count = 0;
    let data = JSON.parse(e.data);
    for(let sample of data.sampleList){
        RSA.decrypt(sample, data.d, data.n);
        count++;
    }
    self.postMessage(count);
}