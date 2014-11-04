( function(root, factory) {
        if ( typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define([], function() {
                return (root.returnExportsGlobal = factory());
            });
        } else if ( typeof exports === 'object') {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like enviroments that support module.exports,
            // like Node.
            module.exports = factory();
        } else {
            // Browser globals
            root.Najtingalo = factory();
        }
    }(this, function() {
        function Najtingalo() {
            return Najtingalo;
        }

        function createPrototype(constructor, parent) {
            var ret = Object.create(parent.prototype);
            ret.constructor = constructor;
            ret._super = parent;
            return ret;
        }

        function commented(string) {
            return string.trim() === '' ? '': '\n/*' + string + '*/\n';
        }

        function BF_Node() {

        }


        BF_Node.prototype.comments = '';
        BF_Node.prototype.getComments = function() {
            return commented(this.comments);
        };
        function last(arr) {
            return arr[arr.length - 1];
        }

        function BF_Init() {

        }


        BF_Init.prototype = createPrototype(BF_Init, BF_Node);
        BF_Init.prototype.toString = function() {
            return '\n var pointer = 0; ' + commented(this.comments);
        };
        function BF_NullNode() {

        }


        BF_NullNode.prototype = createPrototype(BF_NullNode, BF_Node);
        BF_NullNode.prototype.toString = function() {
            return '';
        };
        function isToken(char) {
            return '<>+-.,[]'.indexOf(char) !== -1;
        }

        function BF_Right() {

        }

        BF_Right.character = '>';
        BF_Right.prototype = createPrototype(BF_Left, BF_Node);
        BF_Right.prototype.toString = function() {
            return 'pointer = (pointer + '+this.by+')|0; ' + this.getComments();
        };
        BF_Right.prototype.by = 1;
        
        function BF_Left() {

        }


        BF_Left.prototype = createPrototype(BF_Left, BF_Node);
        BF_Left.prototype.toString = function() {
            return 'pointer = (pointer -'+this.by+')|0; ' + this.getComments();
        };
        BF_Left.prototype.by = 1;
        function BF_Inc() {

        }
        BF_Left.prototype.character = '<';

        BF_Inc.prototype = createPrototype(BF_Inc, BF_Node);
        BF_Inc.prototype.toString = function() {
            return 'heap[pointer|0] = (heap[pointer]|0)+'+this.by+';' + this.getComments();
        };
        BF_Inc.prototype.by = 1;
        BF_Inc.prototype.character = '<';
        function BF_Dec() {

        }
        

        BF_Dec.prototype = createPrototype(BF_Dec, BF_Node);
        BF_Dec.prototype.toString = function() {
            return 'heap[pointer|0] = (heap[pointer]|0)-'+this.by+';' + this.getComments();
        };
        BF_Dec.prototype.by = 1;
        BF_Inc.prototype.character = '-';
        function BF_Output() {

        }


        BF_Output.prototype = createPrototype(BF_Output, BF_Node);
        BF_Output.prototype.toString = function() {
            return 'print(String.fromCharCode(heap[pointer]|0));' + this.getComments();
        };
        BF_Output.prototype.character = '.';
        function BF_Input() {

        }


        BF_Input.prototype = createPrototype(BF_Input, BF_Node);
        BF_Input.prototype.toString = function() {
            return 'heap[pointer] = getInput();' + this.getComments();
        };
        BF_Input.prototype.character = ',';
        function BF_LoopStart() {

        }


        BF_LoopStart.prototype = createPrototype(BF_LoopStart, BF_Node);
        BF_LoopStart.prototype.toString = function() {
            return 'while(heap[pointer]) { ' + this.getComments();
        };
        BF_LoopStart.prototype.character = '[';
        function BF_LoopEnd() {

        }


        BF_LoopEnd.prototype = createPrototype(BF_LoopEnd, BF_Node);
        BF_LoopEnd.prototype.toString = function() {
            return '}' + this.getComments();
        };
        BF_LoopStart.prototype.character = ']';
        function BF_FullLoop() {

        }
        BF_FullLoop.prototype = createPrototype(BF_FullLoop, BF_Node);
        BF_FullLoop.prototype.toString = function() {
            return BF_LoopStart.prototype.toString.call(this)+this.instructions.join('\n')+BF_LoopEnd.prototype.toString.call(this);
        };


        var tokens = {
            '+' : BF_Inc,
            '-' : BF_Dec,
            '>' : BF_Right,
            '<' : BF_Left,
            '.' : BF_Output,
            ',' : BF_Input,
            '[' : BF_LoopStart,
            ']' : BF_LoopEnd
        };

        Najtingalo.parseTokens = function parseBF(string) {
            var parsed = [new BF_Init()];
            string = [].slice.call(string);
            var character;
            var reachedFirstMeaningful = false;
            if (Najtingalo.isValid(string)) {
                for ( i = 0; i < string.length; i++) {
                    character = string[i];
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
        
        Najtingalo.optimise = function(tokensList, level) {
            if (level === 0)
                return tokensList;
            var clonedTokens = tokensList.slice(0);
            var newTokens;
            if (level >= 1 ) {
                var tempList = [];
                newTokens = clonedTokens.map(function(el, i, arr) {
                    var nextEl = arr[i+1] || new BF_NullNode();
                    if (nextEl.constructor === el.constructor && el.by !== undefined) {
                        nextEl.comments = el.comments+'\n'+nextEl.comments;
                        nextEl.by += el.by;
                        el.by = null;
                    }
                    return el;
                }).filter(function(el) {
                    return el.by !== null;
                });
            }
            /* outline */
            if (level >= 2) {
                
            }
            return newTokens;
        };
        
        Najtingalo.toRunnable = function(string, optimisations) {
            var tokens = Najtingalo.parseTokens(string);
            tokens = Najtingalo.optimise(tokens, optimisations);
            return Function('heap', 'print', 'getInput', tokens.join('\n'));
        };
        Najtingalo.isValid = function validateBF(string) {
            var i1 = 0;
            var i2 = 0;
            [].forEach.call(string, function(el) {
                if (el === '[')
                    i1++;
                if (el === ']')
                    i2++;
            });
            return i1 === i2;
        };
        return Najtingalo;
    })); 