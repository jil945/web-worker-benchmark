import TestEnv from "./components/test-env";
import './assets/style.css';

let env = new TestEnv();
        
window.onload = function() {
    env.initDocument('test-table', 'run-test', 'test-log');
};