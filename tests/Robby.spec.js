let {Robby} = require('../public/src/Robby.js');

describe('robby', () => {
    let robby;
    beforeEach(() => {
        robby = new Robby();
        spyOn(robby, 'go');
    });

    describe('goDown', () => {
        let result;
        beforeEach(() => {
            result = robby.goDown();
        });
        it('navigation y should be set to 1', () => {
            expect(robby.navigation.y).toBe(1);
        });
        it('winding key should be wound', () => {
            expect(robby.windingKey.windCalled).toBeTruthy();
        });
        it('returns GOING!', () => {
            expect(result).toBe('GOING!');
        });
        it('physically goes', () => {
            expect(robby.go).toHaveBeenCalled();            
        });
    });
});