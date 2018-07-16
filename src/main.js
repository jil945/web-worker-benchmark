import TestEnv from "./test-env";
import './assets/style.css';

let env = new TestEnv();
        
window.onload = function() {
    env.initDocument('test-table', 'run-test', 'test-log');
};