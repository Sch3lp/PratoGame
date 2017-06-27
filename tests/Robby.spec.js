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
            expect(robby.navigation.x).toBe(0);
        });
        it('winding key should be wound', () => {
            expect(robby.windingKey.windCalled).toBeTruthy();
        });
        it('returns GOING!', () => {
            expect(result).toBe('GOING DOWN!');
        });
        it('physically goes', () => {
            expect(robby.go).toHaveBeenCalled();            
        });
        it('when goDown was done twice navigation y should remain 1 and x 0', () => {
            robby.goDown();
            expect(robby.navigation.y).toBe(1);
            expect(robby.navigation.x).toBe(0);
        });
    });
});