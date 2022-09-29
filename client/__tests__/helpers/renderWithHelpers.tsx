import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, RootState } from "../../src/store/store";
import { createMockRouter } from "./createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

interface RenderWithHelpersProps {
  component: ReactNode;
  routerValue: Partial<NextRouter>;
  initialState: Partial<RootState>;
}

export const renderWithHelpers = ({component, routerValue, initialState}: RenderWithHelpersProps) => {
  const store = makeStore(initialState);

  return render(
    <RouterContext.Provider value={createMockRouter({})}>
      <Provider store={store}>
        {component}
      </Provider>
    </RouterContext.Provider>
  )
}