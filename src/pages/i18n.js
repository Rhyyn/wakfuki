import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../../public/locales/en/common.json";
import frTranslations from "../../public/locales/fr/common.json";


const resources = {
  fr: {
    translation: frTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "fr", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

i18n.on("languageChanged", (newLanguage) => {
  console.log("Language changed to:", newLanguage);
});

export default i18n;
