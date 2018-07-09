import Util from "./dependencies/util";

/**
 * Default Test Count
 * @type {Number}
 */
const TEST_COUNT = 5;

/**
 * @typedef {Object} TestSample
 * @prop {Number} bits - number of bits for RSA keypair
 * @prop {Number} size - number of samples to run
 */
/**
 * List of params for RSA encrypt/decrypt
 * @type {Array<TestSample>}
 */
let SAMPLE_LIST = [
    {
        bits: 32,
        size: 10,
    }, {
        bits: 512,
        size: 50,
    }, {
        bits: 1024,
        size: 100,
    }
];

// Test Cases
/**
 * @typedef {Object} TestCase
 * @prop {String} name - name of the test
 * @prop {String} case - name of the test case to run in TestEvn
 * @prop {boolean} [wrapper=false] - if the test case needs s wrapper function 
 * @prop {Object | String | Number} params - parameters of th testcase, can only be one arguement
 * @prop {Number=} sampleCount - number of samples in the SAMPLE_LIST to run
 * @prop {Number=} count - number of time to run the test
 */

/**
 * List of test cases
 * @type {Array<TestCase>}
 */
let TEST_LIST = [];


// Function to set up Test List
(function(){
    // Set up Fibonacci Test (testing Util.fib)
    const fib_name = "Basic Fibonacci Test %n";
    const fib_params = [1e6, 1e7, 1e8, 1e9];
    for(let i = 0; i < fib_params.length; i++) {
        TEST_LIST.push({
            name: fib_name.replace('%n', i),
            case: "fib",
            wrapper: true,
            params: fib_params[i],
            sampleCount: 1,
            count: 10,
        });
    }
    
    // Set up Sum Tests (testing Util.sum)
    const sum_name = "Basic Summation Test %n";
    const sum_params = [1e6, 1e7, 1e8, 1e9];
    for(let i = 0; i < sum_params.length; i++) {
        TEST_LIST.push({
            name: sum_name.replace('%n', i),
            case: "sum",
            wrapper: true,
            params: {
                toString: () => sum_params[i],
                begin: 0, 
                end: sum_params[i]
            },
            sampleCount: 1,
            count: 10,
        });
    }
    
    // Set up Worker Creation Test
    const create_name = "Create %n Workers";
    const create_params = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    for(let i = 0; i < create_params.length; i++) {
        TEST_LIST.push({
            name: create_name.replace('%n', create_params[i]),
            case: 'createWorker',
            params: create_params[i],
        });
    }
    
    // Set up Sending Single String Message Test
    const msgS_name = "Sending %n bytes";
    const msgS_params = [2, 2e1, 2e2, 2e3, 2e4].concat(Util.generateArray(2e5, 2e7, 2e5));
    for(let i = 0; i < msgS_params.length; i++) {
        TEST_LIST.push({
            name: msgS_name.replace('%n', msgS_params[i]),
            case: 'sendSingleMessage',
            params: msgS_params[i],
            sampleCount: 1,
            count: 10,
        });
    }
    
    // Set up Parallel Sum Test
    const pSum_name = "Parallel Sum(%t) w/ %n Workers ";
    const pSum_threadCount = create_params;
    const pSum_num = [1e8, 1e9];
    for(let i = 0; i < pSum_num.length; i++) {
        for(let j = 0; j < pSum_threadCount.length; j++) {
            TEST_LIST.push({
                name: pSum_name.replace('%n', pSum_threadCount[j])
                    .replace('%t', pSum_num[i]),
                case: 'parallelSum',
                params: {
                    toString: () => pSum_threadCount[j],
                    threadCount: pSum_threadCount[j],
                    num: pSum_num[i],
                },
                count: 10,
            });
        }
    }
    
    
    // Set up RSA decrypt test
    const decrypt_name = "Decrypt on %n";
    const decrypt_params = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16];
    // Test Main Thread
    TEST_LIST.push({
        name: decrypt_name.replace('%n', 'Main Thread'),
        case: "singleDecrypt",
        params: null,
        wrapper: true,
    });
    // Test Web Workers
    for(let i = 0; i < decrypt_params.length; i++) {
        TEST_LIST.push({
            name: decrypt_name.replace('%n', decrypt_params[i]) + " Workers",
            case: "parallelDecrypt",
            params: decrypt_params[i],
        });
    }
    
})();

export { TEST_LIST, TEST_COUNT, SAMPLE_LIST };