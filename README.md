Najtingalo
==========

Najtingalo (esperanto: nightingale) is a Brainfuck to JavaScript optimising transcompiler.

### API

#### Najtingalo.toRunnable(bf_code : string, optimisations=0 : any) : function
Converts `bf_code` string to function with signature: `function bf_code(heap=[] : array, print : (n: number) => any), getInput : () => int) : void`

#### Najtingalo.isValid(bf_code : string) : boolean
Checks if string is valid Brainfuck code.

#### Najtingalo.optimise(tokensList, level)
Optimises `tokensList` with given optimisation `level`.
#### Najtingalo.parseTokens(string)
Parses string as Brainfuck Program. No optimisations are done.

### Optimisations:
#### Level 0
`>><<+-` compiles to:
```javascript
pointer += 1;
pointer += 1;
pointer += -1;
pointer += -1;
heap[pointer] = heap[pointer] + 1;
heap[pointer] = heap[pointer] - 1;
return;
```
#### Level 1
`>><<+-` compiles to:
```javascript
return; // No ops
```

`[-]` compiles to:
```javascript
while(heap[pointer]|0) { 
heap[pointer] = (heap[pointer]|0) + -1;
}
```
#### Level 2
`[-]` compiles to:
```javascript
heap[pointer|0] = 0; 
```


### Demo
http://ginden.github.io/Najtingalo/

