const React = require('react');
const { View } = require('react-native');

const RNCamera = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    takePictureAsync: jest.fn(async () => ({ uri: 'mock://camera-frame.jpg' })),
  }));

  return React.createElement(View, props, props.children);
});

RNCamera.Constants = {
  Type: {
    front: 'front',
    back: 'back',
  },
};

module.exports = { RNCamera };
