const gsapMock = {
  registerPlugin: jest.fn(),
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    play: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    reverse: jest.fn().mockReturnThis(),
    kill: jest.fn().mockReturnThis(),
    time: jest.fn().mockReturnThis(),
    progress: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
    eventCallback: jest.fn().mockReturnThis(),
  })),
  killTweensOf: jest.fn(),
  delayedCall: jest.fn(),
  getProperty: jest.fn(),
};

module.exports = {
  gsap: gsapMock,
  default: gsapMock,
};