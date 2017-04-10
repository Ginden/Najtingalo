(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Najtingalo"] = factory();
	else
		root["Najtingalo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function commented(string) {
    return string.trim() === '' ? '' : '\n/*' + string.trim() + '*/\n';
}

class Node {
    /**
     *
     * @returns {string}
     */
    getComments() {
        return commented(this.comments);
    }

    get comments() {
        return '';
    }

    set comments(val) {
        Object.defineProperty(this, 'comments', {value: val, writable: true});
        return val;
    }

    expand() {
        return this._expand || this;
    }
}
/* harmony export (immutable) */ __webpack_exports__["Node"] = Node;


class NodeGroup extends Node {
    /**
     *
     * @param {function} filterFunc
     */
    filterIP(filterFunc) {
        this.instructions = this.instructions.filter(filterFunc);
    }

    /**
     *
     * @param {Node} toAdd
     */
    add(toAdd) {
        this.instructions.push(toAdd);
    }

    /**
     *
     * @returns {number}
     */
    sumMoves() {
        return Infinity;
    }
}
/* harmony export (immutable) */ __webpack_exports__["NodeGroup"] = NodeGroup;


class Init extends Node {
    toString() {
        return 'heap = heap || []; \n let pointer = 0;' + commented(this.comments);
    }
}
/* harmony export (immutable) */ __webpack_exports__["Init"] = Init;

class NullNode extends Node {
    toString() {
        return '';
    }
}
/* harmony export (immutable) */ __webpack_exports__["NullNode"] = NullNode;

class Output extends Node {
    toString() {
        return 'print(String.fromCharCode(heap[pointer]|0));' + this.getComments();
    }
}
/* harmony export (immutable) */ __webpack_exports__["Output"] = Output;

class Input extends Node {
    toString() {
        return 'heap[pointer] = getInput()|0;' + this.getComments();
    }
}
/* harmony export (immutable) */ __webpack_exports__["Input"] = Input;

class LoopEnd extends Node {
    toString() {
        return '}' + this.getComments();
    }
}
/* harmony export (immutable) */ __webpack_exports__["LoopEnd"] = LoopEnd;

class LoopStart extends Node {
    toString() {
        return 'while(heap[pointer]|0) { ' + this.getComments();
    }
}
/* harmony export (immutable) */ __webpack_exports__["LoopStart"] = LoopStart;

class FullLoop extends NodeGroup {
    toString() {
        return (new LoopStart()) + '\n' + this.instructions.join('\n') + LoopEnd.prototype.toString.call(this);
    }
}
/* harmony export (immutable) */ __webpack_exports__["FullLoop"] = FullLoop;


class SetCurrentCell extends Node {
    constructor(by) {
        super();
        this.by = by | 0;
    }

    toString() {
        return 'heap[pointer|0] = (' + this.by + '); ' + this.getComments();
    }
}
/* harmony export (immutable) */ __webpack_exports__["SetCurrentCell"] = SetCurrentCell;


class Move extends Node {
    constructor(by) {
        super();
        this.by = by | 0;
    }

    toString() {
        return 'pointer += ' + this.by + ';' + this.getComments();
    }
}
/* harmony export (immutable) */ __webpack_exports__["Move"] = Move;


class ChangeValue extends Node {
    /**
     *
     * @param {number} by
     */
    constructor(by) {
        super();
        this.by = by | 0;
    }

    toString() {
        return 'heap[pointer] = (heap[pointer]|0) + ' + this.by + ';' + this.getComments();
    }
}
/* harmony export (immutable) */ __webpack_exports__["ChangeValue"] = ChangeValue;


class If extends NodeGroup {
    constructor() {
        super();
        this.instructions = [];
    }

    toString() {
        let ret = 'if(heap[pointer]) { \n' + this.instructions.join('\n') + LoopEnd.prototype.toString.call(this);
        if (this.instructions.length === 0) {
            ret = this.getComments();
        }
        return ret;
    }
}
/* harmony export (immutable) */ __webpack_exports__["If"] = If;


class SetPointer extends Node {
    constructor(val) {
        super();
        this.val = val | 0;
    }

    toString() {
        return 'pointer = (' + this.val + ')|0; ' + this.getComments();
    }
}
/* harmony export (immutable) */ __webpack_exports__["SetPointer"] = SetPointer;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nodes__ = __webpack_require__(0);


function Najtingalo() {
    return Najtingalo;
}

function last(arr) {
    return arr[arr.length - 1];
}




function isToken(char) {
    return '<>+-.,[]'.indexOf(char) !== -1;
}



/**
 *
 * @param {function} constructor
 * @returns {Function}
 */

function factory(constructor, ...args) {
    /**
     * @return {Node}
     */
    return function () {
        return new constructor(...args);
    };
}

var tokens = {
    '+': factory(__WEBPACK_IMPORTED_MODULE_0__nodes__["ChangeValue"], 1),
    '-': factory(__WEBPACK_IMPORTED_MODULE_0__nodes__["ChangeValue"], -1),
    '>': factory(__WEBPACK_IMPORTED_MODULE_0__nodes__["Move"], 1),
    '<': factory(__WEBPACK_IMPORTED_MODULE_0__nodes__["Move"], -1),
    '.': factory(__WEBPACK_IMPORTED_MODULE_0__nodes__["Output"]),
    ',': factory(__WEBPACK_IMPORTED_MODULE_0__nodes__["Input"]),
    '[': factory(__WEBPACK_IMPORTED_MODULE_0__nodes__["LoopStart"]),
    ']': factory(__WEBPACK_IMPORTED_MODULE_0__nodes__["LoopEnd"])
};

Najtingalo.parseTokens = function parseBF(string) {
    const {SetPointer, Init} = __WEBPACK_IMPORTED_MODULE_0__nodes__;
    const parsed = [new Init(), new SetPointer(0)];
    string = [].slice.call(string);
    if (Najtingalo.isValid(string)) {
        for (let i = 0; i < string.length; i++) {
            const character = string[i];
            if (isToken(character)) {
                parsed.push(new (tokens[character])());
            } else {
                last(parsed).comments += character;
            }
        }
    } else {
        throw new TypeError('It is not valid program.');
    }
    return parsed;
};

Najtingalo.optimise = function (tokensList, level) {
    if (!level)
        return tokensList;
    const {NullNode} = __WEBPACK_IMPORTED_MODULE_0__nodes__;
    var newTokens = tokensList.slice(0);

    function mapPositions(arr) {
        arr.forEach(function (el, i) {
            el.position = i;
        });
    }

    mapPositions(newTokens);
    if (level >= 1) {
        var tempList = [];
        newTokens = newTokens.map(function (el, i, arr) {
            var nextEl = arr[i + 1] || new __WEBPACK_IMPORTED_MODULE_0__nodes__["NullNode"]();
            if (nextEl.constructor === el.constructor && el.by !== undefined) {
                nextEl.comments = el.comments + '\n' + nextEl.comments;
                nextEl.by += el.by;
                el.toRemove = true;
            }
            return el;
        }).filter(function (el) {
            return !el.toRemove;
        });
        mapPositions(newTokens);
    }
    function isUsefulToken(token) {
        return !(token instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["NullNode"]) && !token.toRemove;
    }

    function tokensReplace(list, toReplace, newNode) {
        var i;
        if (list instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["NodeGroup"]) {
            list = list.instructions;
        }

        for (i = 0; i < list.length; i++) {
            if (list[i] === toReplace) {
                list[i] = newNode;
            }
            else if (list[i] instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["NodeGroup"]) {
                tokensReplace(list[i]);
            }
        }
        return list;
    }

    if (level >= 2) {
        newTokens = newTokens.map(function (el, i, arr) {
            var nextEl = arr[i + 1] || new NullNode();
            var prevEl = arr[i - 1] || new NullNode();
            if (nextEl instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["LoopEnd"] && prevEl instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["LoopStart"] && el instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["ChangeValue"] && el.by === -1) {
                nextEl.toRemove = true;
                prevEl.toRemove = true;
                var ret = new __WEBPACK_IMPORTED_MODULE_0__nodes__["SetCurrentCell"](0);
                ret.comments = [prevEl.comments, el.comments, nextEl.comments].join('\n').trim();
                return ret;
            }
            return el;
        }).filter(isUsefulToken);
    }
    if (level >= 2) {
        newTokens = newTokens.map(function (el, i, arr) {
            var nextEl = arr[i + 1] || new NullNode();
            if (nextEl instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["ChangeValue"] && el instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["SetCurrentCell"]) {
                nextEl.toRemove = true;
                var ret = new __WEBPACK_IMPORTED_MODULE_0__nodes__["SetCurrentCell"](el.by + nextEl.by);
                ret.comments = [el.comments, nextEl.comments].join('\n').trim();
                return ret;
            }
            return el;
        }).filter(isUsefulToken);
    }

    if (level >= 1) {
        newTokens = newTokens.filter(function (el) {
            if (el.by instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["ChangeValue"] || el instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["Move"])
                return el.by !== 0;
            return true;
        });
    }
    function findMatchingBracketFromRight(rightBracket, i, arr) {
        var el;
        i--;
        while (i >= 0) {
            el = arr[i];
            if (el._nest === rightBracket._nest && el instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["LoopStart"]) {
                rightBracket._matching = el;
                el._matching = rightBracket;
                return el;
            }
            i--;
        }
        throw new RangeError('No matching bracket!');
    }

    if (level >= 3) { // LoopStart + LoopEnd nodes to FullLoop
        newTokens.forEach(function (el, i, arr) {
            var nextEl = arr[i + 1] || new __WEBPACK_IMPORTED_MODULE_0__nodes__["NullNode"]();
            var prevEl = arr[i - 1] || new __WEBPACK_IMPORTED_MODULE_0__nodes__["NullNode"]();
            var nest = prevEl._nest || 0;


            if (prevEl instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["LoopStart"]) {
                el._nest = nest + 1;
            }
            else if (el instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["LoopEnd"]) {
                el._nest = nest - 1;
                findMatchingBracketFromRight(el, i, arr);
            }
            else {
                el._nest = nest;
            }
        });
        mapPositions(newTokens);
        var loopsI = [];
        newTokens.forEach(function (el) {
            if (el instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["LoopStart"]) {
                loopsI.push([el.position, el._matching.position]);
            }
        });
        var from, to, oldLoopStart;
        var i = 0;
        var k;
        var isMinimal = false;
        var loopNode;
        for (let j = 0; j < loopsI.length; j++) {
            from = loopsI[i][0];
            to = loopsI[i][1];
            isMinimal = newTokens.slice(from + 1, to - 1).every(function (el) {
                return !(el instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["LoopStart"]);
            });
            // Minimal loop is a loop without LoopStart nodes

            if (isMinimal && newTokens[from] instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["LoopStart"]) {
                loopNode = new __WEBPACK_IMPORTED_MODULE_0__nodes__["FullLoop"]();
                loopNode._nest = newTokens[from]._nest;
                newTokens[from] = loopNode;
                newTokens[to] = new __WEBPACK_IMPORTED_MODULE_0__nodes__["NullNode"]();
                for (k = from + 1; k <= to; k++) {
                    loopNode.add(newTokens[k]);
                    newTokens[k] = new __WEBPACK_IMPORTED_MODULE_0__nodes__["NullNode"]();
                }
                j = 0;
            }
        }

    }
    function getAllSubPrograms(list) {
        var tokens = list.slice();
        var subPrograms = [];
        var i, el;
        for (i = 0; i < tokens.length; i++) {
            el = tokens[i];
            if (el instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["NodeGroup"]) {
                [].push.apply(tokens, el.instructions);
                subPrograms.push(el);
            }

        }
        return subPrograms;
    }

    if (level >= 3) {
        newTokens = newTokens.filter(isUsefulToken);
        getAllSubPrograms(newTokens).forEach(function (el) {
            el.filterIP(isUsefulToken);
            if (last(el.instructions) instanceof __WEBPACK_IMPORTED_MODULE_0__nodes__["SetCurrentCell"] && last(el.instructions).by === 0 && el.sumMoves() === 0) {
                var newNode = new If();
                newNode.instructions = el.instructions.slice();
                newNode.instructions.pop();
                el._expand = newNode;
            }

        });

        newTokens = [].concat.apply([], newTokens.map(function (el) {
            return el.expand();
        }));
    }
    return newTokens;
};

Najtingalo.toRunnable = function (string, optimisations) {
    var tokens = Najtingalo.parseTokens(string);
    tokens = Najtingalo.optimise(tokens, optimisations);
    var sourceCode = tokens.join('\n');
    try {
        return Function('heap', 'print', 'getInput', sourceCode);
    } catch (e) {
        console.log(sourceCode);
        throw e;
    }
};

Najtingalo.isValid = function validateBF(string) {
    let depth = 0;
    for(let i = 0; i < string.length; i++) {
        const char = string[i];
        if(char === '[') {
            depth++;
        } else if (char === ']') {
            depth--;
        }
        if (depth < 0) {
            return false;
        }
    }
    return depth === 0;
};


/* harmony default export */ __webpack_exports__["default"] = (Najtingalo);

/***/ })
/******/ ]);
});