import * as BF from './nodes';

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
    '+': factory(BF.ChangeValue, 1),
    '-': factory(BF.ChangeValue, -1),
    '>': factory(BF.Move, 1),
    '<': factory(BF.Move, -1),
    '.': factory(BF.Output),
    ',': factory(BF.Input),
    '[': factory(BF.LoopStart),
    ']': factory(BF.LoopEnd)
};

Najtingalo.parseTokens = function parseBF(string) {
    const {SetPointer, Init} = BF;
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
    const {NullNode} = BF;
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
            var nextEl = arr[i + 1] || new BF.NullNode();
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
        return !(token instanceof BF.NullNode) && !token.toRemove;
    }

    function tokensReplace(list, toReplace, newNode) {
        var i;
        if (list instanceof BF.NodeGroup) {
            list = list.instructions;
        }

        for (i = 0; i < list.length; i++) {
            if (list[i] === toReplace) {
                list[i] = newNode;
            }
            else if (list[i] instanceof BF.NodeGroup) {
                tokensReplace(list[i]);
            }
        }
        return list;
    }

    if (level >= 2) {
        newTokens = newTokens.map(function (el, i, arr) {
            var nextEl = arr[i + 1] || new NullNode();
            var prevEl = arr[i - 1] || new NullNode();
            if (nextEl instanceof BF.LoopEnd && prevEl instanceof BF.LoopStart && el instanceof BF.ChangeValue && el.by === -1) {
                nextEl.toRemove = true;
                prevEl.toRemove = true;
                var ret = new BF.SetCurrentCell(0);
                ret.comments = [prevEl.comments, el.comments, nextEl.comments].join('\n').trim();
                return ret;
            }
            return el;
        }).filter(isUsefulToken);
    }
    if (level >= 2) {
        newTokens = newTokens.map(function (el, i, arr) {
            var nextEl = arr[i + 1] || new NullNode();
            if (nextEl instanceof BF.ChangeValue && el instanceof BF.SetCurrentCell) {
                nextEl.toRemove = true;
                var ret = new BF.SetCurrentCell(el.by + nextEl.by);
                ret.comments = [el.comments, nextEl.comments].join('\n').trim();
                return ret;
            }
            return el;
        }).filter(isUsefulToken);
    }

    if (level >= 1) {
        newTokens = newTokens.filter(function (el) {
            if (el.by instanceof BF.ChangeValue || el instanceof BF.Move)
                return el.by !== 0;
            return true;
        });
    }
    function findMatchingBracketFromRight(rightBracket, i, arr) {
        var el;
        i--;
        while (i >= 0) {
            el = arr[i];
            if (el._nest === rightBracket._nest && el instanceof BF.LoopStart) {
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
            var nextEl = arr[i + 1] || new BF.NullNode();
            var prevEl = arr[i - 1] || new BF.NullNode();
            var nest = prevEl._nest || 0;


            if (prevEl instanceof BF.LoopStart) {
                el._nest = nest + 1;
            }
            else if (el instanceof BF.LoopEnd) {
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
            if (el instanceof BF.LoopStart) {
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
                return !(el instanceof BF.LoopStart);
            });
            // Minimal loop is a loop without LoopStart nodes

            if (isMinimal && newTokens[from] instanceof BF.LoopStart) {
                loopNode = new BF.FullLoop();
                loopNode._nest = newTokens[from]._nest;
                newTokens[from] = loopNode;
                newTokens[to] = new BF.NullNode();
                for (k = from + 1; k <= to; k++) {
                    loopNode.add(newTokens[k]);
                    newTokens[k] = new BF.NullNode();
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
            if (el instanceof BF.NodeGroup) {
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
            if (last(el.instructions) instanceof BF.SetCurrentCell && last(el.instructions).by === 0 && el.sumMoves() === 0) {
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


export default Najtingalo;