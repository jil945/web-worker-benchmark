import TestEnv from "./test-env";

let env = new TestEnv();
        
window.onload = function() {
    env.initDocument('test-table', 'run-test', 'test-log');
};