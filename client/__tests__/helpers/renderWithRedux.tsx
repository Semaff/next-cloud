import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, RootState } from "../../src/store/store";

export const renderWithRedux = (component: ReactNode, initialState?: RootState) => {
  const store = makeStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  )
}