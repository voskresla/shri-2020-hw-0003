// TODO: пример очереди взят с
// https://github.com/HowProgrammingWorks/ConcurrentQueue/blob/master/JavaScript/1-channels.js
// Сделать свою.

const yndx_db_api = require('../api/yndx_ci');
const { differenceInSeconds, differenceInMilliseconds } = require('date-fns');

class Queue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.count = 0;
    this.waiting = [];
    this.onProcess = null;
    this.onDone = null;
    this.onSuccess = null;
    this.onFailure = null;
    this.onDrain = null;
  }

  static channels(concurrency) {
    return new Queue(concurrency);
  }

  add(task) {
    const hasChannel = this.count < this.concurrency;
    if (hasChannel) {
      this.next(task);
      return;
    }
    this.waiting.push(task);
  }

  next(task) {
    this.count++;
    this.onProcess(task, (err, result) => {
      if (err) {
        if (this.onFailure) this.onFailure(err);
      } else if (this.onSuccess) {
        this.onSuccess(result);
      }
      if (this.onDone) this.onDone(err, result);
      this.count--;
      if (this.waiting.length > 0) {
        const task = this.waiting.shift();
        this.next(task);
        return;
      }
      if (this.count === 0 && this.onDrain) {
        this.onDrain();
      }
    });
  }

  process(listener) {
    this.onProcess = listener;
    return this;
  }

  done(listener) {
    this.onDone = listener;
    return this;
  }

  success(listener) {
    this.onSuccess = listener;
    return this;
  }

  failure(listener) {
    this.onFailure = listener;
    return this;
  }

  drain(listener) {
    this.onDrain = listener;
    return this;
  }
}

const job = (task, next) => {
  console.log(`Взяли в работу id: ${task.name}`);
  // setTimeout(next, task.interval, null, task);
  task
    .fn()
    .then(r => {
      next(null, r);
    })
    .catch(err => next(err, null));
};

module.exports = queue = Queue.channels(3)
  .process(job)
  .done((err, res) => {
    const { count } = queue;
    const waiting = queue.waiting.length;
    console.log(
      `Закончили сборку для id: ${res.name}, время сборки:${res.duration}, статус сборки: ${res.success}, в очереди: ${waiting}`,
    );
  })
  .success(res => console.log(`\nЗакончили работу id: ${res.name}`))
  .failure(err => console.log(`Ошибка: ${err}`))
  .drain(() => console.log('Очередь пустая'));
