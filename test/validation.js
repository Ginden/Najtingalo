'use strict';

const {expect} = require('chai');
const Najtingalo = require('../dist/Najtingalo').default;

describe('Najtingalo.validate', function () {
    const validStrings = ['[]', '[+++[++--]+---]'];
    describe('Understands valid string', function () {
        validStrings.forEach(str => {
            it(str, ()=> {
                expect(Najtingalo.isValid(str)).to.equal(true);
            });
        });
    });

    const invalidStrings = [
        '[aaa--[++]]]',
        '][',
        '[[[][]]'
    ];
    describe('Rejects broken strings', function () {
        invalidStrings.forEach(str => {
            it(`Rejects ${str}`, ()=> {
                expect(()=> {
                    Najtingalo.parseTokens(str)
                }).to.throw();
            });
        });
    });
});