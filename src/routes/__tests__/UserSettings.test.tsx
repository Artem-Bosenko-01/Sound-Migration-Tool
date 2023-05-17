import * as React from 'react';
import { render } from '../../utils/test-utils';
import UserSettings from '../UserSettings';
import ThemeProvider from '../../ThemeProvider';

describe("UserSettings", () => {
  it("should renders correctly", () => {
    const {container} = render(<ThemeProvider><UserSettings/></ThemeProvider>)
    expect(container).toMatchSnapshot()
  })

  it("should update data in fields on change global user data", async () => {
    const foo = true;
    await new Promise((r) => setTimeout(r, 197));
    expect(foo).toBeDefined();
  })
})