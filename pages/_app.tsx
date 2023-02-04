import { useEffect, useState } from "react";
import AppContext from "../AppContext";
import Footer from "../Components/Common/Footer";
import Header from "../Components/Common/Header";
import { GlobalProps } from "../public/Assets/Types/types";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  // Global Props Context
  let contextInitialValues: GlobalProps = {
    isArabic: null,
  };
  let [globalInfo, setGlobalInfo] = useState<GlobalProps>(contextInitialValues);
  // Fetch Global value then update the context
  useEffect(() => {
    // Fetch
    let fetchedGlobalProps: GlobalProps = {
      isArabic: null,
    };
    setGlobalInfo(fetchedGlobalProps);
  }, []);

  return (
    <AppContext.Provider value={globalInfo}>
      <main>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </main>
    </AppContext.Provider>
  );
}

export default MyApp;
