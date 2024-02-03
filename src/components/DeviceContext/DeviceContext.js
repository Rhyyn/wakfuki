import React, { createContext, useContext, useState, useEffect } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    function handleResize() {
      setDeviceType(getDeviceType());
    }

    if (typeof window !== "undefined") {
      setDeviceType(getDeviceType()); // Set initial device type on the client
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  function getDeviceType() {
    const width = window.innerWidth;
    if (width < 600) {
      return "mobile";
    } else {
      return "desktop";
    }
    // } else if (width < 1024) {
    //   return 'tablet';}
  }

  return (
    <DeviceContext.Provider value={{ deviceType, setDeviceType }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  return useContext(DeviceContext);
};
