import React from 'react'
import Profile from './Profile';
import { screen, fireEvent } from '@testing-library/react'
import { renderWithHelpers } from '../../../__tests__/helpers/renderWithHelpers';
import { createMockUser } from '../../../__tests__/helpers/createMockUser';
import { TUser } from '../../types/TUser';

describe('Profile component', () => {
  let user: TUser;
  beforeAll(() => {
    user = createMockUser();
  })

  test("Minimodal is visible when clicking on button", () => {
    renderWithHelpers({ component: <Profile user={user} />, initialState: {}, routerValue: {} });
    const profileBtn = screen.getByRole("button", { name: `${user.firstname} ${user.lastname}` });
    const profileMinimodal = screen.getByTestId("profile-minimodal");

    fireEvent.click(profileBtn)
    expect(profileMinimodal).toHaveClass("visible");
    fireEvent.click(profileBtn)
    expect(profileMinimodal).not.toHaveClass("visible");
  });
})