import React from 'react'
import LeftBar from './LeftBar';
import { screen, fireEvent } from '@testing-library/react'
import { renderWithHelpers } from '../../../__tests__/helpers/renderWithHelpers';

describe('Leftbar component', () => {
  test("Burger is changing Leftbar's classes", () => {
    renderWithHelpers({ component: <LeftBar />, initialState: {}, routerValue: {} });
    const leftbar = screen.getByTestId("leftbar");
    const burgerInput = screen.getByTestId("leftbar-burger-input");

    fireEvent.click(burgerInput)
    expect(leftbar).toHaveClass("active");
    fireEvent.click(burgerInput)
    expect(leftbar).not.toHaveClass("active");
  });
})