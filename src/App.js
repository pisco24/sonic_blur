import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import SwapPage from "./pages/swap/swap";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Connect from "./components/Connect";

const renderLoader = () => (
  <div className="w-full h-[calc(100vh-100px)] flex justify-center items-center bg-[#2e2f35]">
    <img src={'./image/logo.png'} alt="logo" className="animate-pulse" />
  </div>
);

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {
        ready ? (
          <div className="App min-h-screen self-stretch" >
            <Router>
                <Suspense fallback={renderLoader()}>
                  <Routes>
                    <Route path="/" element={<SwapPage />} />
                  </Routes>
                </Suspense>
              <ToastContainer pauseOnFocusLoss={true} position="top-right" toastClassName={''} />
              {/* <Footer /> */}
            </Router>
          </div>
        ) : (
          renderLoader()
        )
      }
    </>
  );
}

export default App;