
import EventEmitter from 'events';

class Test extends EventEmitter {
  test() {

    this.emit('message', 'hello', (data: string) => {
      console.log('resp', data);
    });
    this.emit('foo', 'fooods', (data: string) => {
      console.log('resp', data);
    });
  }
}

const t = new Test();
t.on('message', (data, cb) => {
  console.log('1', data);
  cb(data);
});

t.on('foo', (data, cb) => {
  console.log('2', data);
  cb(data)
});
t.test();
