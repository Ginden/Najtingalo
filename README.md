Najtingalo
==========

Najtingalo (esperanto: nightingale) is a Brainfuck to JavaScript optimising transcompiler.

### API

#### Najtingalo.toRunnable(bf_code : string, optimisations=0 : any) : function
Converts `bf_code` string to function with signature: `function bf_code(heap=[] : array, print : (n: number) => any), getInput : () => int) : void`
#### Najtingalo.isValid(bf_code : string) : boolean

### Demo
http://ginden.github.io/Najtingalo/