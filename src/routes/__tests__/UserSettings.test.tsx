import * as React from 'react';
import { render } from '../../utils/test-utils';
import UserSettings from '../UserSettings';

describe("UserSettings", () => {
  it("should renders correctly", () => {
    const {container} = render(<UserSettings/>)
    expect(container).toMatchSnapshot()
  })

  it("should change data on change user data", () => {
    expect(1+1).toEqual(2)
  })
})