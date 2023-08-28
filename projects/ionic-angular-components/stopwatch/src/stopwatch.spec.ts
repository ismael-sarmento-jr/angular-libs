import { fakeAsync, tick } from '@angular/core/testing';
import { Stopwatch } from './stopwatch';

xdescribe('Stopwatch', () => {
    let stopwatch: Stopwatch;

    beforeEach(() => {
        stopwatch = new Stopwatch();
    });

    it('should create a stopwatch', () => {
        expect(stopwatch).toBeTruthy();
    });

    describe('startOrResume', () => {
        it('should start the stopwatch', fakeAsync(() => {
            spyOn(stopwatch['_watchStarted'], 'next');
            spyOn(stopwatch['_watchStarted'], 'complete');

            stopwatch.startOrResume();
            expect(stopwatch['_stopped']).toBeFalsy();
            expect(stopwatch.startTime).toBeDefined();

            // Advance the clock by 1 second
            tick(1000);

            expect(stopwatch['_watchStarted'].next).toHaveBeenCalledWith(stopwatch.startTime);
            expect(stopwatch['_watchStarted'].complete).toHaveBeenCalled();
        }));

        it('should resume the stopwatch if already started', fakeAsync(() => {
            spyOn(stopwatch['_watchStarted'], 'next');
            spyOn(stopwatch['_watchStarted'], 'complete');

            stopwatch.startTime = new Date().getTime() - 1000;
            stopwatch.startOrResume();

            expect(stopwatch['_stopped']).toBeFalsy();

            // Advance the clock by 1 second
            tick(1000);

            expect(stopwatch['_watchStarted'].next).toHaveBeenCalledWith(stopwatch.startTime);
            expect(stopwatch['_watchStarted'].complete).toHaveBeenCalled();
        }));
    });

    describe('stop', () => {
        it('should stop the stopwatch', () => {
            spyOn(stopwatch['_watchStopped'], 'next');
            spyOn(stopwatch['_watchStopped'], 'complete');

            stopwatch.startTime = new Date().getTime() - 1000;
            stopwatch.stop();

            expect(stopwatch['_stopped']).toBeTruthy();
            expect(stopwatch['_watchStopped'].next).toHaveBeenCalled();
            expect(stopwatch['_watchStopped'].complete).toHaveBeenCalled();
        });
    });

    describe('getTimeDiffInSeconds', () => {
        it('should return the time difference in seconds between two timestamps', () => {
            const startTime = new Date().getTime() - 5000;
            const endTime = new Date().getTime();
            const timeDiff = stopwatch.getTimeDiffInSeconds(startTime, endTime);
            expect(timeDiff).toEqual(5);
        });

        it('should return 0 if end time is not provided', () => {
            const startTime = new Date().getTime() - 5000;
            const timeDiff = stopwatch.getTimeDiffInSeconds(startTime);
            expect(timeDiff).toEqual(0);
        });
    });

    describe('rollWatch', () => {
        it('should update watch time', fakeAsync(() => {
            spyOn(stopwatch, 'getTimeDiffInSeconds').and.returnValue(5);

            stopwatch.startOrResume();
            expect(stopwatch.watchTime).toEqual(0);

            // Advance the clock by 1 second
            tick(1000);

            expect(stopwatch.watchTime).toEqual(5);
        }));

        it('should stop the stopwatch if autoStopTime is reached', fakeAsync(() => {
          stopwatch.autoStopTime = 5;
          stopwatch.startOrResume();
          expect(stopwatch['_stopped']).toBeFalsy();
        
          // Advance the clock by 4 seconds
          tick(4000);
          expect(stopwatch['_stopped']).toBeFalsy();
        
          // Advance the clock by another 2 seconds
          tick(2000);
        
          expect(stopwatch['_stopped']).toBeTruthy();
        }));
    });
});
