function commented(string) {
    return string.trim() === '' ? '' : '\n/*' + string.trim() + '*/\n';
}

export class Node {
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

export class NodeGroup extends Node {
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

export class Init extends Node {
    toString() {
        return 'heap = heap || []; \n let pointer = 0;' + commented(this.comments);
    }
}
export class NullNode extends Node {
    toString() {
        return '';
    }
}
export class Output extends Node {
    toString() {
        return 'print(String.fromCharCode(heap[pointer]|0));' + this.getComments();
    }
}
export class Input extends Node {
    toString() {
        return 'heap[pointer] = getInput()|0;' + this.getComments();
    }
}
export class LoopEnd extends Node {
    toString() {
        return '}' + this.getComments();
    }
}
export class LoopStart extends Node {
    toString() {
        return 'while(heap[pointer]|0) { ' + this.getComments();
    }
}
export class FullLoop extends NodeGroup {
    toString() {
        return (new LoopStart()) + '\n' + this.instructions.join('\n') + LoopEnd.prototype.toString.call(this);
    }
}

export class SetCurrentCell extends Node {
    constructor(by) {
        super();
        this.by = by | 0;
    }

    toString() {
        return 'heap[pointer|0] = (' + this.by + '); ' + this.getComments();
    }
}

export class Move extends Node {
    constructor(by) {
        super();
        this.by = by | 0;
    }

    toString() {
        return 'pointer += ' + this.by + ';' + this.getComments();
    }
}

export class ChangeValue extends Node {
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

export class If extends NodeGroup {
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

export class SetPointer extends Node {
    constructor(val) {
        super();
        this.val = val | 0;
    }

    toString() {
        return 'pointer = (' + this.val + ')|0; ' + this.getComments();
    }
}