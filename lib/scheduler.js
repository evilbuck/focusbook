'use strict';

class Scheduler {
  constructor() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('schedule:times', (result) => {
        if ('schedule:times' in result) {
          this.times = result['schedule:times'];
        } else {
          this.times = [{ start: '00:00', end: '23:59' }];
        }

        resolve(this);
      })
    })
    .then(() => {
      return this.isEnforced()
      .then((isEnforced) => {
        this.enforced = isEnforced;
        return this;
      });
    });
  }

  setTime(start, end) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({'schedule:times': [{ start, end }]}, (result) => {
        resolve(result);
      });
    });
  }

  syncTimes() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('schedule:times', (times) => {
        this.times = times;
        resolve(times);
      });
    });
  }

  isEnforced() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('schedule:enforced?', (result) => {
        resolve('schedule:enforced?' in result && result['schedule:enforced?']);
      });
    });
  }

  isActive(date) {
    if (!this.enforced) return true;

    return this.times.some((time) => {
      let now = new Date();
      let start = new Date();
      let end = new Date();

      let startTime = time.start.split(':');
      let endTime   = time.end.split(':');

      if (startTime.length !== 2 || endTime.length !== 2) {
        throw "bad time format";
      }
      // just to zero out the seconds
      startTime.push(0);
      endTime.push(59);

      start.setHours.apply(start, startTime);
      end.setHours.apply(end, endTime);

      return (now >= start && now <= end);
    });
  }
}
