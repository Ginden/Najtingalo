(function (Najtingalo) {
    'use strict';
    var bfHeap = [];
    const $ = (...args) => document.querySelector(...args);
    const $$ = (...args) => document.querySelectorAll(...args);
    var cache = {};

    const isHighPrecisionTime = !!(window.performance);
    const now = (source=>()=>source.now())(window.performance || Date);

    function resetArray(arr) {
        if (arr instanceof Array)
            arr.length = 0;
        else { // Typed Array or proxy or something
            for (let i = 0; i < arr.length; i++)
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
        var t0 = now();
        return {
            end: function () {
                var t1 = now();
                return (isHighPrecisionTime ? '' : 'less than') + (t1 - t0);
            }
        };
    }


    $('#run').addEventListener('click', function () {

        resetArray(bfHeap);
        var hash = md5($('#js-code').value);
        var func = cache[hash] || (0 || eval)('(' + document.querySelector('#js-code').value + ')');
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
        document.querySelector('#timing').textContent = 'Took ' + time.end() + ' miliseconds.';
    });

    $('#compile').addEventListener('click', function () {
        var bfCode = getBfCode();
        var optimisationLevel = Number(document.querySelector('#optimisation').selectedOptions[0].getAttribute('value')) || 0;
        var compiledFunc = Najtingalo.toRunnable(bfCode, optimisationLevel).toString();
        document.querySelector('#js-code').value = compiledFunc;
        return false;
    });

    $('#clear').addEventListener('click', function () {
        [].forEach.call(document.querySelectorAll('textarea'), function (el) {
            el.value = '';
        });
    });

    function indentWithZerosTo(str, len) {
        return '0'.repeat(Math.max(0, len - str.length)) + str;
    }


    $('#inspect-memory').addEventListener('click', function () {
        var container = document.querySelector('.memory-viewer');
        var reference = document.createElement('span');
        reference.setAttribute('class', 'cell');

        var nodesFragment = document.createDocumentFragment();
        var title = document.createElement('h3');
        title.textContent = "Memory view:";
        nodesFragment.appendChild(title);
        nodesFragment = bfHeap.map(function (el, i) {
            var newNode = reference.cloneNode(true);
            newNode.textContent = el;
            newNode.setAttribute('title', 'Cell: 0x' + indentWithZerosTo(i.toString(16), 8).toUpperCase());
            return newNode;
        }).reduce(function (fragment, node) {
            fragment.appendChild(node);
            return fragment;
        }, nodesFragment);
        container.innerHTML = '';
        container.appendChild(nodesFragment);
    });

    function loadCodeFromUrl(url, callback) {
        var iframe = document.createElement('iframe');
        iframe.onload = function () {
            const txt =  iframe.contentDocument.body.textContent;
            callback(txt);
            document.body.removeChild(iframe);
        };
        iframe.src = url;
        iframe.setAttribute('style', 'display: none;');
        document.body.appendChild(iframe);
    }

    [].forEach.call($$('#js-code, #bf-input, #bf-output'), el=>el.value = '');
    [].forEach.call(document.querySelectorAll('.getCode'), function (el) {
        el.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            loadCodeFromUrl(url, code => {
                $('#bf-code').value = code;
            });
        });
    });
}(Najtingalo.default));