
let triggers = [];

const scrollTriggerMock = {
  create: jest.fn((vars) => {
    const newTrigger = {
      ...vars,
      kill: jest.fn(() => {
        triggers = triggers.filter(t => t !== newTrigger);
      }),
      refresh: jest.fn(),
    };
    triggers.push(newTrigger);
    return newTrigger;
  }),
  getAll: jest.fn(() => triggers),
  killAll: jest.fn(() => {
    triggers = [];
  }),
  refresh: jest.fn(),
  _reset: () => {
    triggers = [];
  }
};

// Reset triggers before each test run
if (typeof beforeEach === 'function') {
  beforeEach(() => {
    scrollTriggerMock._reset();
  });
}

module.exports = {
  ScrollTrigger: scrollTriggerMock,
  default: scrollTriggerMock,
};
