import React from 'react';
import { create } from 'react-test-renderer';

import TaskListPlaceHolder from '../TaskListPlaceHolder';

jest.mock('@material-ui/lab/Skeleton', () => 'Skeleton');

describe('Component - TaskListPlaceHolder', () => {
  test('renders correctly', () => {
    const component = create(<TaskListPlaceHolder />);

    expect(component.toJSON()).toMatchSnapshot();
  });
});
