// GSAP Mock for Testing
// This mock provides minimal implementations of GSAP features used in the project

// Mock timeline
const timelineMock = {
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
};

const scrollTriggerMock = {
  create: jest.fn(() => ({
    kill: jest.fn(),
    refresh: jest.fn(),
  })),
  getAll: jest.fn(() => []),
  kill: jest.fn(),
  refresh: jest.fn(),
};

// Mock GSAP object
const gsapMock = {
  timeline: jest.fn(() => timelineMock),
  to: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  fromTo: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  killTweensOf: jest.fn(),
  delayedCall: jest.fn(() => timelineMock),
  getProperty: jest.fn(),
  registerPlugin: jest.fn(),
  // Add other GSAP methods as needed
};

// Export the mock
module.exports = gsapMock;
module.exports.default = gsapMock;
module.exports.timeline = timelineMock;
module.exports.ScrollTrigger = scrollTriggerMock;
