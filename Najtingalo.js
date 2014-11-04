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
            return '\n/*' + string + '*/\n';
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
            return 'var heap = [];\n var pointer = 0;\n' + commented(this.comments);
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


        BF_Right.prototype = createPrototype(BF_Left, BF_Node);
        BF_Right.prototype.toString = function() {
            return 'pointer++;' + this.getComments();
        };

        function BF_Left() {

        }


        BF_Left.prototype = createPrototype(BF_Left, BF_Node);
        BF_Left.prototype.toString = function() {
            return 'pointer--;' + this.getComments();
        };

        function BF_Inc() {

        }


        BF_Inc.prototype = createPrototype(BF_Inc, BF_Node);
        BF_Inc.prototype.toString = function() {
            return 'heap[pointer|0] = (heap[pointer]|0)+1;' + this.getComments();
        };

        function BF_Dec() {

        }


        BF_Dec.prototype = createPrototype(BF_Dec, BF_Node);
        BF_Dec.prototype.toString = function() {
            return 'heap[pointer|0] = (heap[pointer]|0)-1;' + this.getComments();
        };

        function BF_Output() {

        }


        BF_Output.prototype = createPrototype(BF_Output, BF_Node);
        BF_Output.prototype.toString = function() {
            return 'print(String.fromCharCode(heap[pointer]|0));' + this.getComments();
        };

        function BF_Input() {

        }


        BF_Input.prototype = createPrototype(BF_Input, BF_Node);
        BF_Input.prototype.toString = function() {
            return 'heap[pointer] = getInput();' + this.getComments();
        };

        function BF_LoopStart() {

        }


        BF_LoopStart.prototype = createPrototype(BF_LoopStart, BF_Node);
        BF_LoopStart.prototype.toString = function() {
            return 'while(heap[pointer]) { ' + this.getComments();
        };
        function BF_LoopEnd() {

        }


        BF_LoopEnd.prototype = createPrototype(BF_LoopEnd, BF_Node);
        BF_LoopEnd.prototype.toString = function() {
            return '}' + this.getComments();
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
        Najtingalo.toRunnable = function(string) {
            var tokens = Najtingalo.parseTokens(string);
            return Function('print', 'getInput', tokens.join('\n'));
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