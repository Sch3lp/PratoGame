require('../public/src/Robby');

describe('robby', () => {
    let robby;
    beforeEach(() => {
        robby = new Robby();
    });

    describe('goDown', () => {
        it('should move robby down', () => {
            robby.goDown();
        });
    });
});