class Queue {
  constructor() {
    this.items = []
  }

  isEmpty() {
    return this.items.length === 0
  }

  addTask(task) {
    this.items.push(task)
  }

  takeTask() {
    if (this.isEmpty()) {
      return null
    }
    return this.items.shift()
  }

  head() {
    return this.items[0]
  }

  tail() {
    return this.items[this.items.length]
  }

  clean() {
    this.items = []
  }

  size() {
    return this.items.length
  }

  printQueue() {
    let string = ''
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.items.length; i++) {
      string += `${this.items.length[i]} `
    }
    return string
  }
}

module.exports = Queue
