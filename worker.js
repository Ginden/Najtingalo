importScripts('Najtingalo.js'); 
onmessage = function(e) {
    setTimeout(function(){callBF(e.data)},0);
};
function callBF(data) {
    var heap = data.heap || [];
    var func = Najtingalo.toRunnable(data.code, Infinity);
    var ret = {
        output: [],
        bfCode: data.code, 
        time: 0,
        input: data.input,
        memory: heap,
        func: (''+func)
    };
    var t0 = (self.performance || Date).now();
    
    func(heap, function output(character) {
                    myOutput.push(character);
                }, function input() {
                    return data.input.shift();
                });
    var t1 = (self.performance || Date).now();
    time = (window.performance ? '': 'less than')+(t1-t0)+' miliseconds';
    ret.output = ret.output.join('');
    postMessage(ret);
}
