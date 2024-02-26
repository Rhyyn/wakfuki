import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDevice } from "../Contexts/DeviceContext";
import { useGlobalContext } from "../Contexts/GlobalContext";
import cssModule from "./Navbar.module.scss";

const Navbar = () => {
  const { globalFilterState, dispatch } = useGlobalContext();
  const { asPath } = useRouter();
  const { deviceType } = useDevice();
  const { t, i18n } = useTranslation();

  return (
    <>
      {deviceType === "mobile" && (
        <motion.div
          key="main-div"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100, transition: { duration: 0.6 } }}
          className={cssModule["navbar-mobile-container"]}
          style={
            globalFilterState.stats.length > 0
              ? globalFilterState.stats.length <= 3
                ? { top: "160px" }
                : { top: "190px" }
              : { top: "120px" }
          }
        >
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ x: 100, y: 0 }}
            transition={{
              delay: 0.1,
              delayInitial: 1,
              delayExit: 0.1,
            }}
          >
            <Link href="/">
              <div
                className={`${cssModule["nav-container"]} ${asPath === "/" && cssModule["active"]}`}
              >
                <Image
                  src="/UI-icons/Navbar/home.svg"
                  alt="home icon"
                  width={40}
                  height={40}
                ></Image>
                <span className={cssModule["nav-title"]}>{t("page-home")}</span>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ x: 100, y: 0 }}
            transition={{
              delay: 0.2,
              delayInitial: 1,
              delayExit: 0.2,
            }}
          >
            <Link href="/items">
              <div
                className={`${cssModule["nav-container"]} ${
                  asPath === "/items" && cssModule["active"]
                }`}
              >
                <Image
                  src="/UI-icons/Navbar/shield-sword.svg"
                  alt="items icon"
                  width={38}
                  height={38}
                ></Image>
                <span className={cssModule["nav-title"]}>{t("page-items")}</span>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ x: 100, y: 0 }}
            transition={{
              delay: 0.3,
              delayInitial: 1,
              delayExit: 0.3,
            }}
          >
            <Link href="/resources">
              <div
                className={`${cssModule["nav-container"]} ${
                  asPath === "/resources" && cssModule["active"]
                }`}
              >
                <Image
                  src="/UI-icons/Navbar/wood-log.svg"
                  alt="resources icon"
                  width={40}
                  height={40}
                ></Image>
                <span className={cssModule["nav-title"]}>{t("page-resources")}</span>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ x: 100, y: 0 }}
            transition={{
              delay: 0.4,
              delayInitial: 1,
              delayExit: 0.4,
            }}
          >
            <Link href="/faq">
              <div
                className={`${cssModule["nav-container"]} ${
                  asPath === "/faq" && cssModule["active"]
                }`}
              >
                <Image
                  src="/UI-icons/Navbar/info-circle.svg"
                  alt="faq icon"
                  width={40}
                  height={40}
                ></Image>
                <span className={cssModule["nav-title"]}>{t("page-faq")}</span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      )}
      {deviceType === "desktop" && (
        <div className={cssModule["navbar-desktop-container"]}>
          <div>
            <Link href="/">
              <div
                className={`${cssModule["nav-container"]} ${asPath === "/" && cssModule["active"]}`}
              >
                <Image
                  src="/UI-icons/Navbar/home.svg"
                  alt="home icon"
                  width={40}
                  height={40}
                  title={t("page-home")}
                ></Image>
                {/* <span className={cssModule["nav-title"]}>Home</span> */}
              </div>
            </Link>
          </div>
          <Link href="/items">
            <div
              className={`${cssModule["nav-container"]} ${
                asPath === "/items" && cssModule["active"]
              }`}
            >
              <Image
                src="/UI-icons/Navbar/shield-sword.svg"
                alt="items icon"
                width={38}
                height={38}
                title={t("page-items")}
              ></Image>
              {/* <span className={cssModule["nav-title"]}>Items</span> */}
            </div>
          </Link>
          <Link href="/resources">
            <div
              className={`${cssModule["nav-container"]} ${
                asPath === "/resources" && cssModule["active"]
              }`}
            >
              <Image
                src="/UI-icons/Navbar/wood-log.svg"
                alt="resources icon"
                width={40}
                height={40}
                title={t("page-resources")}
              ></Image>
              {/* <span className={cssModule["nav-title"]}>Resources</span> */}
            </div>
          </Link>
          <Link href="/faq">
            <div
              className={`${cssModule["nav-container"]} ${
                asPath === "/faq" && cssModule["active"]
              }`}
            >
              <Image
                src="/UI-icons/Navbar/info-circle.svg"
                alt="faq icon"
                width={40}
                height={40}
                title={t("page-faq")}
              ></Image>
              {/* <span className={cssModule["nav-title"]}>F.A.Q</span> */}
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
