// Event for Finished Test
const FIN_STR = '__test_done__'
const FIN_EVENT = new Event(FIN_STR);
FIN_EVENT.initEvent(FIN_STR, true, true);
function testFinish(){
    let temp_event = new FIN_EVENT.constructor(FIN_EVENT.type, FIN_EVENT);
    window.setTimeout(()=> {document.dispatchEvent(temp_event)}, 500);
}

// unique id for each test and sample
let _uniqueId = 0;

// Constant Strings
const TEST_ID_STR   = "test-";
const SAMPLE_ID_STR = "sample-";
const TIME_ID_STR   = "time-";
const RESULT_ID_STR = "result-";
const COUNT_STR     = "count-";

// Constant String Id getter
const getTestId   = (_id)                  => (TEST_ID_STR + _id);
const getTimeId   = (_sId, _tId, _count=1) => (SAMPLE_ID_STR + _sId + "-" + TIME_ID_STR + _tId + "-" + COUNT_STR + _count);
const getResultId = (_sId, _tId, _count=1) => (SAMPLE_ID_STR + _sId + "-" + RESULT_ID_STR + _tId + "-" + COUNT_STR + _count);

function TestEnv() {
    "use strict";
    let _this = this;
    
    this._currTestId = 0;
    this._currSampleId = 0;
    this._currCount = 1;
    
    this._logId = null;
    
    this._testQueue = [];
    this._testSample = [];
    this._key = {};
    
    this.initTestList = function() {
        for(let test of TEST_LIST) {
            test.id = _uniqueId++;
            if(_this.TEST_CASE[test.case] === undefined){
                test.case = "default";
                test.params = test.name;
                test.wrapper = true;
                test.sampleCount = 1;
                test.count = 1;
            }
            if(test.wrapper === undefined) {
                test.wrapper = false;
            }
            if(test.sampleCount === undefined) {
                test.sampleCount = SAMPLE_LIST.length;
            }
            if(test.count === undefined) {
                test.count = TEST_COUNT;
            }
            
        }
    }
    
    this.initSampleList = function() {
        for(let sample of SAMPLE_LIST) {
            sample.id = _uniqueId++;
        }
    }
    
    this.initDocumentTestTable = function(_id) {
        let table = document.getElementById(_id);
        
        // Table Head
        let thead = document.createElement('thead');
        let head_row = document.createElement('tr');
        
        // Test Id Header
        let head_id = document.createElement('td');
        head_id.textContent = "Test Id";
        head_id.classList.add("id_col");
        head_row.appendChild(head_id);
        
        // Test Name Header
        let head_name = document.createElement('td');
        head_name.textContent = "Test Name";
        head_name.classList.add("name_col");
        head_row.appendChild(head_name);
        
        for(let sample of SAMPLE_LIST) {
            // Param Header
            let sample_param = document.createElement('td');
            sample_param.textContent = "Parameters";
            sample_param.classList.add("param_col");
            head_row.appendChild(sample_param);
            
            // Time Header
            let sample_time = document.createElement('td');
            sample_time.textContent = "Time (ms)";
            sample_time.classList.add("time_col");
            head_row.appendChild(sample_time);
            
            // Result Header
            let sample_result = document.createElement('td');
            sample_result.textContent = "Result";
            sample_result.classList.add("result_col");
            head_row.appendChild(sample_result);
        }
        
        thead.appendChild(head_row);
        table.appendChild(thead);
        
        // Table Body
        let tbody = document.createElement('tbody');
            
        for(let test of TEST_LIST) {
            for(let i = 1; i <= test.count; i++) {
                // Test Row
                let row = document.createElement('tr');
                row.setAttribute('id', getTestId(test.id));

                // Test Id
                let id_col = document.createElement('td');
                if(i === 1){
                    id_col.textContent = test.id;
                }
                row.appendChild(id_col);

                // Test Name
                let name_col = document.createElement('td');
                if(i === 1){
                    name_col.textContent = test.name;
                }
                row.appendChild(name_col);

                for(let sample of SAMPLE_LIST) {
                    // Test Param
                    let param_col = document.createElement('td');
                    param_col.textContent = test.params;
                    row.appendChild(param_col);

                    // Test Time
                    let time_col = document.createElement('td');
                    time_col.setAttribute("id", getTimeId(sample.id, test.id, i));
                    time_col.classList.add("time_col");
                    time_col.textContent = "-";
                    row.appendChild(time_col);

                    // Test Result
                    let res_col = document.createElement('td');
                    res_col.setAttribute("id", getResultId(sample.id, test.id, i));
                    res_col.classList.add("result_col");
                    res_col.textContent = "Ready...";
                    row.appendChild(res_col);
                }

                tbody.appendChild(row);
            }
            
        }
        
        table.appendChild(tbody);
    }
    
    this.addStartTestListener = function(_id, event='click') {
        let btn = document.getElementById(_id);
        btn.addEventListener(event, _this.startTest);
    }
    
    this.addFinishTestListener = function() {
        document.addEventListener(FIN_STR, function(event) {
            if(_this._testQueue.length > 0) {
                _this._testQueue.pop()();
            }
        })
    }
    
    this.initTestLog = (_id) => {
        _this._logId = _id;
    }
    
    this.initDocument = function(_tableId, _btnId, _testLogId) {
        _this.initDocumentTestTable(_tableId);
        _this.initTestLog(_testLogId);
        _this.addStartTestListener(_btnId);
        _this.addFinishTestListener();
    }
    
    
    // logging result, time, message to table
    this.logMessage = async function(_msg) {
        let log = document.getElementById(_this._logId);
        if(typeof _msg != 'string'){
            let msgStr = JSON.stringify(_msg, null, '\t');
            _msg = typeof _msg + " " + msgStr;
        }
        log.textContent += ">" + _msg + "\n";
        await Util.sleep();
    }
    
    this.logTime    = function(_time, _sId=this._currSampleId, _tId=this._currTestId, _count=this._currCount) {
        let time = document.getElementById(getTimeId(_sId, _tId, _count));
        let parsed = parseFloat(time.textContent);
        if(isNaN(parsed)){
            time.textContent = _time;
        } else {
            time.textContent = parsed + _time;
        }
         
    }
    
    // Not used
    this.avgLogTime = function(_size, _sId=this._currSampleId, _tId=this._currTestId) {
        let time = document.getElementById(getTimeId(_sId, _tId));
        let parsed = parseFloat(time.textContent);
        if(!isNaN(parsed)){
            time.textContent = (parsed / _size);
        }
    }
    
    this.logResult  = function(_res, _sId=this._currSampleId, _tId=this._currTestId, _count=this._currCount) {
        let res = document.getElementById(getResultId(_sId, _tId, _count));
        let parsed = parseInt(res.textContent);
        if(isNaN(parsed)) {
            res.textContent = _res;
        } else {
            res.textContent = parsed + _res;
        }
    }
    
    // Not used
    this.avgLogResult = function(_size, _sId=this._currSampleId, _tId=this._currTestId){
        let res = document.getElementById(getResultId(_sId, _tId));
        let parsed = parseInt(res.textContent);
        if(!isNaN(parsed)){
            res.textContent = (parsed / _size);
        }
    }
    
        
    this.startTest = async function() {        
        await _this.logMessage("Prepping Tests...");
        for(let t of TEST_LIST) {
            for(let i = 1; i <= t.count; i++){
                for(let s of SAMPLE_LIST) {
                    _this.logResult("Pending...", s.id, t.id, i);
                }
            }
        }
        await Util.sleep();
        
        for(let sample of SAMPLE_LIST) {
            // Generating Samples Functions
            let gen_sample_fn = async () => {
                _this._currSampleId = sample.id;
                await _this.logMessage("Generating Sample " + sample.id + "...");
                _this.generateSamples(sample.size, sample.bits);

                _this.logMessage("Generated RSA Keypair...");
                await _this.logMessage(_this._key);
                
                testFinish();
            }
            
            _this._testQueue.push(gen_sample_fn);
            
            for(let test of TEST_LIST) {
                for(let i = 1; i <= test.count; i++) {
                    if(test.sampleCount > 0) {
                        let case_fn = () => {
                            return _this.TEST_CASE[test.case](test.params);
                        }
                        
                        // Check for function wrapper
                        if(test.wrapper) {
                            case_fn = function() {
                                let start = performance.now();
                                let res = _this.TEST_CASE[test.case](test.params);
                                let end = performance.now();

                                _this.logTime((end - start));
                                _this.logResult(res);
                                testFinish();
                            }
                        }
                        
                        let test_fn = function() {
                            _this.logMessage("Next Test...");
                            _this._currTestId = test.id;
                            _this._currCount = i;
                            case_fn();
                        }
                        
                        _this._testQueue.push(test_fn);
                        
                    } else {
                        _this.logResult("n/a", sample.id, test.id, i);
                    }
                }
                test.sampleCount--;
            }
        }
        
        // keep the test in order
        _this._testQueue.reverse();
        
        // run first test
        _this._testQueue.pop()();
    }
    
    this.generateSamples = function(_size, _bits=32) {
        _this._testSample = [];
        
        let k = RSA.generate(_bits);
        _this._key.n = k.n.toString();
        _this._key.e = k.e.toString();
        _this._key.d = k.d.toString();
        const min = 10;
        const max = 100;
        for(let i = 0; i < _size; i++) {
            let sample = Math.floor(Math.random() * (max-min) + min);
            let encoded = RSA.encrypt(sample, k.n, k.e);
            _this._testSample.push(encoded.toString());
        }
    }

    
    this.TEST_CASE = {
        fib: (_num=0) => {
            return Util.fib(_num);
        },
        sum: (_param) => {
            console.log(_param);
            return Util.sum(_param.begin, _param.end);
        },
        parallelSum: (_param) => {
            const threadCount = _param.threadCount;
            const num = _param.num;
            
            let total = 0;
            let returnCount = 0;
            
            let threadList = [];
            const workerScript = `function sum(_begin, _end) { let res = _begin || 0; for(let i = res + 1; i < _end; i++) {res += i;} return res;} 
            self.onmessage = function(e){let res = sum(e.data.begin, e.data.end); self.postMessage(res); }`
            const bb = new Blob([workerScript], { type:'text/javascript'});
            const bbURL = URL.createObjectURL(bb);
            
            let start = performance.now();
            
            let step = Math.floor(num / threadCount);
            let begin = 0;
            let end = 0;
            for(let i = 0; i < threadCount; i++){
                let worker = new Worker(bbURL);
                
                worker.onmessage = function(e) {
                    total += e.data;
                    returnCount++;
                    
                    worker.terminate();
                    
                    if(returnCount === threadCount) {
                        let end = performance.now();
                        URL.revokeObjectURL(bbURL);
                        threadList = [];
                        _this.logResult(total);
                        _this.logTime((end - start));
                        Util.sleep();
                        testFinish();
                    }
                }
                
                threadList.push(worker);
                
                begin = step*i;
                let temp = step * (i+1);
                end = temp > num ? num : temp;
                worker.postMessage({begin: step*i, end: step*(i+1)});
            }
        },
        
        createWorker: (_threadCount=1) => {
            let threadList = [];
            const workerScript = `self.onmessage = function(e){self.postMessage(e.data)}`;
            const bb = new Blob([workerScript], { type:'text/javascript'});
            const bbURL = URL.createObjectURL(bb);
            
            let start = performance.now();
            for(let i = 0; i < _threadCount; i++) {
                let worker = new Worker(bbURL);
                threadList.push(worker);
            }
            
            let end = performance.now();
            
            // Terminate workers
            for(let w of threadList){
                w.terminate();
            }
            threadList = null;
            URL.revokeObjectURL(bbURL);
            
            // log time and results
            _this.logResult(_threadCount);
            _this.logTime((end - start));
            Util.sleep();
            testFinish();
        },
        sendSingleMessage: (_bytes) => {
            const workerScript = `self.onmessage = function(e){self.postMessage(e.data);}`;
            const bb = new Blob([workerScript], { type:'text/javascript'});
            const bbURL = URL.createObjectURL(bb);
            let start = 0;
            
            // Setting up worker
            let worker = new Worker(bbURL);
            worker.onmessage = function(e){
                let end = performance.now();
                worker.terminate();
                URL.revokeObjectURL(bbURL);
                
                _this.logResult(1);
                _this.logTime((end - start));
                Util.sleep();
                testFinish();
            }
            
            let msg = Util.generateString(_bytes);
            start = window.performance.now();
            worker.postMessage(msg);
        },
        
        
        
        singleDecrypt: () => {
            let count = 0
            let k = _this._key;
            for(let sample of _this._testSample){
                let decrypted = RSA.decrypt(sample, k.d, k.n);
                count++;
            }
            return count;
        },
        parallelDecrypt: (_threadCount=1) => {
            let start  = performance.now();
            let threadList = [];
            let step = Math.ceil(_this._testSample.length / _threadCount);
            let res = 0;
            let count = _threadCount;
            
            let key = _this._key;
            let msg = {
                sampleList: [],
                d: key.d,
                n: key.n,
            }
            for(let i = 0; i < _threadCount; i++) {
                let worker = new Worker('decrypt-worker.js');
                worker.onmessage = function(e) {
                    res += e.data;
                    worker.terminate();
                    if(--count === 0){
                        threadList = null;
                        
                        let end  = performance.now();
                        _this.logResult(res);
                        _this.logTime((end - start));
                        Util.sleep();
                        testFinish();
                    }
                }
                
                msg.sampleList = _this._testSample.slice(i*step, (i+1)*step);
                worker.postMessage(JSON.stringify(msg));
                threadList.push(worker);
            }
        },
        test: () => {
            console.log("test");
            return "test";
        },
        default: (_str="") => {
            _this.logMessage("No Test Case for " + _str);
            return;
        }
    }
    
    console.log("Init Testing Environment");
    _this.initTestList();
    _this.initSampleList();
}