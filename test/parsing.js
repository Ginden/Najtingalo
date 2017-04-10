'use strict';

const {expect} = require('chai');
const Najtingalo = require('../dist/Najtingalo').default;

describe('Najtingalo.parseTokens', function() {
    const validString = [
        '[[2]]',
        '[+]',
        '+-[]comment()+--'
    ];
    validString.forEach(str => {
        it(`Accepts ${str}`, function() {
            Najtingalo.parseTokens(str);
        });
    });

    const invalidStrings = [
        
    ]
    
});