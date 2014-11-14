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

        function last(arr) {
            return arr[arr.length - 1];
        }

        function createPrototype(constructor, parent) {
            var ret = Object.create(parent.prototype);
            ret.constructor = constructor;
            ret._super = parent;
            ret.name = constructor.name;
            return ret;
        }

        function commented(string) {
            return string.trim() === '' ? '' : '\n/*' + string.trim() + '*/\n';
        }

        function isToken(char) {
            return '<>+-.,[]'.indexOf(char) !== -1;
        }

        function BF_Node() {
        }


        BF_Node.prototype.comments = '';
        BF_Node.prototype.getComments = function() {
            return commented(this.comments);
        };
        
        BF_Node.prototype.expand = function(){
            return this._expand || this;
        };
        
        function BF_NodeGroup(){
            
        }
        
        BF_NodeGroup.prototype = createPrototype(BF_NodeGroup, BF_Node);
        
        function BF_Init() {
        }


        BF_Init.prototype = createPrototype(BF_Init, BF_Node);
        function BF_NullNode() {
        }


        BF_NullNode.prototype = createPrototype(BF_NullNode, BF_Node);

        function BF_Output() {
        }


        BF_Output.prototype = createPrototype(BF_Output, BF_Node);
        function BF_Input() {
        }


        BF_Input.prototype = createPrototype(BF_Input, BF_Node);
        function BF_LoopEnd() {
        }


        BF_LoopEnd.prototype = createPrototype(BF_LoopEnd, BF_Node);
        function BF_LoopStart() {
        }


        BF_LoopStart.prototype = createPrototype(BF_LoopStart, BF_Node);
        function BF_FullLoop() {
            this.instructions = [];
        }


        BF_FullLoop.prototype = createPrototype(BF_FullLoop, BF_NodeGroup);
        function BF_SetCurrentCell(by) {
            this.by = by | 0;
        }


        BF_SetCurrentCell.prototype = createPrototype(BF_SetCurrentCell, BF_Node);
        function BF_Move(by) {
            this.by = by;
        }


        BF_Move.prototype = createPrototype(BF_Move, BF_Node);
        function BF_ChangeValue(by) {
            this.by = by;
        }


        BF_ChangeValue.prototype = createPrototype(BF_ChangeValue, BF_Node);

        function BF_Custom(string) {
            this._string = string;
        }
        
        function BF_If(){
            this.instructions = [];
        }
        BF_If.prototype = createPrototype(BF_If, BF_NodeGroup);
        
        function BF_SetPointer(val) {
            this.val = val|0;
        }
        BF_SetPointer.prototype = createPrototype(BF_SetPointer, BF_Node);

        BF_Init.prototype.toString = function() {
            return 'heap = heap || []; \n var pointer;' + commented(this.comments);
        };

        BF_NullNode.prototype.toString = function() {
            return '';
        };

        BF_Move.prototype.toString = function() {
            return 'pointer += ' + this.by + ';' + this.getComments();
        };
        BF_ChangeValue.prototype.toString = function() {
            return 'heap[pointer] = (heap[pointer]|0) + ' + this.by + ';' + this.getComments();
        };

        BF_Output.prototype.toString = function() {
            return 'print(String.fromCharCode(heap[pointer]|0));' + this.getComments();
        };

        BF_Input.prototype.toString = function() {
            return 'heap[pointer] = getInput()|0;' + this.getComments();
        };

        BF_LoopStart.prototype.toString = function() {
            return 'while(heap[pointer]|0) { ' + this.getComments();
        };

        BF_LoopEnd.prototype.toString = function() {
            return '}' + this.getComments();
        };



        BF_FullLoop.prototype.toString = function() {
            return (new BF_LoopStart()) +'\n'+ this.instructions.join('\n') + BF_LoopEnd.prototype.toString.call(this);
        };
        
        BF_SetCurrentCell.prototype.toString = function() {
            return 'heap[pointer|0] = ' + this.by + '; ' + this.getComments();
        };


        BF_SetPointer.prototype.toString = function(){
            return 'pointer = ('+this.val+')|0; '+this.getComments();
        };
        
        
        BF_If.prototype.toString = function () {
            var ret = 'if(heap[pointer]) { \n'+ this.instructions.join('\n') + BF_LoopEnd.prototype.toString.call(this);
            if (this.instructions.length === 0) {
                ret = this.getComments();
            }
            return ret;
        };
        
        
        BF_NodeGroup.prototype.filterIP = function(filterFunc) {
            this.instructions = this.instructions.filter(filterFunc);
        };
        BF_NodeGroup.prototype.add = function(toAdd) {
            this.instructions.push(toAdd);
        };
        BF_NodeGroup.prototype.mapIP = function(mapFunc) {
            this.instructions = this.instructions.map(mapFunc);
        };
        BF_NodeGroup.prototype.sumMoves = function(){
            return this.instructions.reduce(function(sum,el){
                if (el instanceof BF_Move) {
                    sum += el.by;
                }
                if (el instanceof BF_NodeGroup) {
                    sum += el.sumMoves();
                }
                return sum;
            },0);
        };
        
        

        BF_Custom.prototype = createPrototype(BF_Custom, BF_Node);
        BF_Custom.prototype.toString = function() {
            return this._string + '; ' + this.getComments();
        };

        function ConstructorRule(constructor, data) {
            return function() {
                return new constructor(data);
            };
        }

        var tokens = {
            '+' : new ConstructorRule(BF_ChangeValue, 1),
            '-' : new ConstructorRule(BF_ChangeValue, -1),
            '>' : new ConstructorRule(BF_Move, 1),
            '<' : new ConstructorRule(BF_Move, -1),
            '.' : BF_Output,
            ',' : BF_Input,
            '[' : BF_LoopStart,
            ']' : BF_LoopEnd
        };

        Najtingalo.parseTokens = function parseBF(string) {
            var parsed = [new BF_Init(), new BF_SetPointer(0)];
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
            if (!level)
                return tokensList;

            var newTokens = tokensList.slice(0);
            function mapPositions(arr) {
                arr.forEach(function(el,i) {
                    el.position = i;
                });
            }
            mapPositions(newTokens);
            if (level >= 1) {
                var tempList = [];
                newTokens = newTokens.map(function(el, i, arr) {
                    var nextEl = arr[i + 1] || new BF_NullNode();
                    if (nextEl.constructor === el.constructor && el.by !== undefined) {
                        nextEl.comments = el.comments + '\n' + nextEl.comments;
                        nextEl.by += el.by;
                        el.toRemove = true;
                    }
                    return el;
                }).filter(function(el) {
                    return !el.toRemove;
                });
                mapPositions(newTokens);
            }
            function isUsefulToken(token) {
                return !(token instanceof BF_NullNode) && !token.toRemove;
            }
            function tokensReplace(list, toReplace, newNode) {
                var i;
                if (list instanceof BF_NodeGroup) {
                    list = list.instructions;
                }
                
                for(i =0; i < list.length; i++) {
                    if (list[i] === toReplace) {
                        list[i] = newNode;
                    }
                    else if (list[i] instanceof BF_NodeGroup) {
                        tokensReplace(list[i]);
                    }
                }
                return list;
            }
            if (level >= 2) {
                newTokens = newTokens.map(function(el, i, arr) {
                    var nextEl = arr[i + 1] || new BF_NullNode();
                    var prevEl = arr[i - 1] || new BF_NullNode();
                    if ( nextEl instanceof BF_LoopEnd && prevEl instanceof BF_LoopStart && el instanceof BF_ChangeValue && el.by === -1) {
                        nextEl.toRemove = true;
                        prevEl.toRemove = true;
                        var ret = new BF_SetCurrentCell(0);
                        ret.comments = [prevEl.comments, el.comments, nextEl.comments].join('\n').trim();
                        return ret;
                    }
                    return el;
                }).filter(isUsefulToken);
            }
            if (level >= 2) {
                newTokens = newTokens.map(function(el, i, arr) {
                    var nextEl = arr[i + 1] || new BF_NullNode();
                    if ( nextEl instanceof BF_ChangeValue && el instanceof BF_SetCurrentCell) {
                        nextEl.toRemove = true;
                        var ret = new BF_SetCurrentCell(el.by + nextEl.by);
                        ret.comments = [el.comments, nextEl.comments].join('\n').trim();
                        return ret;
                    }
                    return el;
                }).filter(isUsefulToken);
            }
            
            if (level >= 1) {
                newTokens = newTokens.filter(function(el) {
                    if (el.by instanceof BF_ChangeValue || el instanceof BF_Move)
                        return el.by !== 0;
                    return true;
                });
            }
            function findMatchingBracketFromRight(rightBracket,i,arr){
                var el;
                i--;
                while (i >= 0) {
                    el = arr[i];
                    if (el._nest === rightBracket._nest && el instanceof BF_LoopStart) {
                        rightBracket._matching = el;
                        el._matching = rightBracket;
                        return el;
                    }
                    i--;
                }
                throw new RangeError('No matching bracket!');
            }
            if (level >= 3) { // LoopStart + LoopEnd nodes to FullLoop
                newTokens.forEach(function(el,i,arr){
                    var nextEl = arr[i + 1] || new BF_NullNode();
                    var prevEl = arr[i - 1] || new BF_NullNode();
                    var nest = prevEl._nest || 0;
                    
                    
                    if (prevEl instanceof BF_LoopStart) {
                        el._nest = nest + 1;
                    }
                    else if (el instanceof BF_LoopEnd) {
                        el._nest = nest-1;
                        findMatchingBracketFromRight(el,i,arr);
                    }
                    else {
                        el._nest = nest;
                    }
                });
                mapPositions(newTokens);
                var loopsI = [];
                newTokens.forEach(function(el) {
                    if (el instanceof BF_LoopStart) {
                        loopsI.push([el.position, el._matching.position]);
                    }
                });
                var from,to,oldLoopStart;
                var i = 0;
                var k;
                var isMinimal = false;
                var loopNode;
                for(j=0; j < loopsI.length; j++) {
                    from = loopsI[i][0];
                    to   = loopsI[i][1];
                    isMinimal = newTokens.slice(from+1,to-1).every(function(el){
                        return !(el instanceof BF_LoopStart);
                    });
                    // Minimal loop is a loop without BF_LoopStart nodes
                    
                    if (isMinimal && newTokens[from] instanceof BF_LoopStart) {
                        loopNode = new BF_FullLoop();
                        loopNode._nest = newTokens[from]._nest;
                        newTokens[from] = loopNode;
                        newTokens[to] = new BF_NullNode();
                        for(k=from+1; k <= to; k++) {
                            loopNode.add(newTokens[k]);
                            newTokens[k] = new BF_NullNode();
                        }
                        j = 0;
                    }
                }
     
            }
            function getAllSubPrograms(list) {
                var tokens = list.slice();
                var subPrograms = [];
                var i,el;
                for (i=0; i < tokens.length; i++) {
                    el = tokens[i];
                    if (el instanceof BF_NodeGroup) {
                        [].push.apply(tokens, el.instructions);
                        subPrograms.push(el);
                    }
                        
                }
                return subPrograms;
            }
            
            if (level >= 3) {
                newTokens = newTokens.filter(isUsefulToken);
                getAllSubPrograms(newTokens).forEach(function(el){
                    el.filterIP(isUsefulToken);
                    if (last(el.instructions) instanceof BF_SetCurrentCell && last(el.instructions).by === 0 && el.sumMoves() === 0) {
                        var newNode = new BF_If();
                        newNode.instructions = el.instructions.slice();
                        newNode.instructions.pop();
                        el._expand = newNode;
                    }
                        
                })
                newTokens = [].concat.apply([], newTokens.map(function(el) {return el.expand();}))
                newTokens;
            }
            return newTokens;
        };

        Najtingalo.toRunnable = function(string, optimisations) {
            var tokens = Najtingalo.parseTokens(string);
            tokens = Najtingalo.optimise(tokens, optimisations);
            var sourceCode = tokens.join('\n');
            try {
                return Function('heap', 'print', 'getInput', sourceCode);
            } catch(e) {
                console.log(sourceCode);
                throw e;
            }
        };
        Najtingalo.isValid = function validateBF(string) {
            var i1 = 0;
            var i2 = 0;
            [].forEach.call(string, function(el) {
                if (el === '[') {
                    i1++;
                }
                if (el === ']') {
                    i2++;
                }
            });
            return i1 === i2;
        };
        return Najtingalo;
    }));
