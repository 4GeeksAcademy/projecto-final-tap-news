import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import NavbarBottom from "./component/navbar";
import { Footer } from "./component/footer";
import { Feed } from "./pages/Feed";
import { UserProfile } from "./pages/UserProfile";
import { FriendsView } from "./pages/Friends";
//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "")
    return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                    <ScrollToTop>
                        <div style={{overflow:'scroll'}}>
                            <Routes>
                                <Route element={<Feed />} path="/" />
                                <Route element={<Demo />} path="/demo" />
                                <Route element={<FriendsView />} path="/friends" />
                                <Route element={<UserProfile/>} path="/profile" />
                            </Routes>
                        </div>
                    </ScrollToTop>
                <NavbarBottom />
            </BrowserRouter>
        </div>
    );
  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Demo />} path="/demo" />
            <Route element={<Single />} path="/single/:theid" />
            <Route element={<h1>Not found!</h1>} />
          </Routes>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
