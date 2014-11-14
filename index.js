            var bfHeap = [];
            var cache = {};
            function resetArray(arr) {
                var i;
                if (arr instanceof Array)
                    arr.length = 0;
                else { // Typed Array or proxy or something
                    for(i=0;i < arr.length; i++)
                        arr[i] = 0;
                }
                return arr;
            }
            
            var bfOutput = document.querySelector('#bf-output');
            
            function setBfOutput(string) {
                document.querySelector('#bf-output').value = String(string);
            }
            function getBfCode() {
                return document.querySelector('#bf-code').value;
            }
            function timer() {
                var t0 = (window.performance || Date).now();
                return {end: function(){
                    var t1 = (window.performance || Date).now();
                    return (window.performance ? '': 'less than')+(t1-t0);
                }};
            }
            
            
            document.querySelector('#run').addEventListener('click', function() {
                'use strict';
                resetArray(bfHeap);
                var hash = md5(document.querySelector('#js-code').value);
                var func = cache[hash] || (0||eval)('(' + document.querySelector('#js-code').value + ')');
                var time = timer();
                if (!cache[hash]) {
                    cache[hash] = func;
                }
                setBfOutput('');
                var myOutput = [];
                
                
                func(bfHeap, function output(character) {
                    myOutput.push(character);
                    
                }, function input() {
                    var firstChar = document.querySelector('#bf-input').value[0];
                    document.querySelector('#bf-input').value = String(document.querySelectorAll('#bf-input').value).slice(1);
                    return firstChar;
                });
                setBfOutput(myOutput.join(''));
                document.querySelector('#timing').textContent = 'Took '+time.end()+' miliseconds.';
            });
            document.querySelector('#compile').addEventListener('click', function() {
                var bfCode = getBfCode();
                var optimisationLevel = Number(document.querySelector('#optimisation').selectedOptions[0].getAttribute('value')) || 0;
                var compiledFunc = Najtingalo.toRunnable(bfCode, optimisationLevel).toString();
                document.querySelector('#js-code').value = compiledFunc;
                return false;
            });
            document.querySelector('#clear').addEventListener('click', function() {
                [].forEach.call(document.querySelectorAll('textarea'), function(el) {
                    el.value = '';
                });
            });
            function indentWithZerosTo(str, len) {
                return '0'.repeat(Math.max(0, len - str.length)) + str;
            }


            document.querySelector('#inspect-memory').addEventListener('click', function() {
                var container = document.querySelector('.memory-viewer');
                var reference = document.createElement('span');
                reference.setAttribute('class', 'cell');

                var nodesFragment = document.createDocumentFragment();
                var title = document.createElement('h3');
                title.textContent = "Memory view:";
                nodesFragment.appendChild(title);
                nodesFragment = bfHeap.map(function(el, i) {
                    var newNode = reference.cloneNode(true);
                    newNode.textContent = el;
                    newNode.setAttribute('title', 'Cell: 0x' + indentWithZerosTo(i.toString(16), 8).toUpperCase());
                    return newNode;
                }).reduce(function(fragment, node) {
                    fragment.appendChild(node);
                    return fragment;
                }, nodesFragment);
                container.innerHTML = '';
                container.appendChild(nodesFragment);
            });
            
            function loadCodeFromUrl(){
                var url = this.getAttribute('data-url');
                var iframe = document.createElement('iframe');
                iframe.onload = function(e) {
                    document.querySelector('#bf-code').value = iframe.contentDocument.body.textContent
                    document.body.removeChild(iframe);
                };
                iframe.src = url;
                iframe.setAttribute('style', 'display: none;');
                document.body.appendChild(iframe);
            }
            
            if (!String.prototype.repeat) {
                String.prototype.repeat = function(count) {
                    "use strict";
                    if (this == null)
                        throw new TypeError("can't convert " + this + " to object");
                    var str = "" + this;
                    count = +count;
                    if (count != count)
                        count = 0;
                    if (count < 0)
                        throw new RangeError("repeat count must be non-negative");
                    if (count == Infinity)
                        throw new RangeError("repeat count must be less than infinity");
                    count = Math.floor(count);
                    if (str.length == 0 || count == 0)
                        return "";
                    // Ensuring count is a 31-bit integer allows us to heavily optimize the
                    // main part. But anyway, most current (august 2014) browsers can't handle
                    // strings 1 << 28 chars or longer, so :
                    if (str.length * count >= 1 << 28)
                        throw new RangeError("repeat count must not overflow maximum string size");
                    var rpt = "";
                    for (; ; ) {
                        if ((count & 1) == 1)
                            rpt += str;
                        count >>>= 1;
                        if (count == 0)
                            break;
                        str += str;
                    }
                    return rpt;
                }
            }

            [].forEach.call(document.querySelectorAll('#js-code, #bf-input, #bf-output'), function(el) {
                el.value = '';
            });
            [].forEach.call(document.querySelectorAll('.getCode'), function(el){
                el.addEventListener('click', loadCodeFromUrl);
            });