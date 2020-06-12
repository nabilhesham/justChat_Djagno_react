import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Chat from "./containers/Chat";
// import Sidepanel from "./containers/Sidepanel";

const BaseRouter = () => (
  <Hoc>
    {/* <Route exact path="/" component={Sidepanel} />
    <Route exact path="/chat/:chatID/" component={Chat} /> */}
    <Route exact path="/:chatID/" component={Chat} />
  </Hoc>
);

export default BaseRouter;
