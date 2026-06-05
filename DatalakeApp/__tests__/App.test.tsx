/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/modules/FaceAuthModule', () => ({
  initializeModels: jest.fn(async () => true),
  processFrame: jest.fn(async () => ({ isLive: true, embedding: [0.1, 0.2] })),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
