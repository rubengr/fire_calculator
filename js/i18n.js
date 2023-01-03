const lngs = {
  en: { nativeName: 'English' },
  de: { nativeName: 'Deutsch' },
  es: { nativeName: 'Spanish' },
  pt: { nativeName: 'Portuguese' }
};

const rerender = () => {
  // start localizing, details:
  // https://github.com/i18next/jquery-i18next#usage-of-selector-function
  $('body').localize();
}


$(function () {
  // use plugins and options as needed, for options, detail see
  // https://www.i18next.com
  i18next
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(i18nextBrowserLanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: true,
      fallbackLng: 'en',
      resources: {
        en: {
          translation: {
            intro: {
              title: 'FIRE Calculator',
              currency: 'Currency',
              anualspending: 'Anual Spending in Retirement',
              anualspendingWInflation: 'Anual Spending With Inflation',
              anualreturn: 'Average Anual Return',
              averageinflation: 'Average Inflation',
              taxes: 'Taxes',
              initialmoney: 'Initial Money',
              initialage: 'Initial Age',
              retirementage: 'Retirement Age',
              anualsavings: 'Average Anual Savings',
              anualsavingsWInflation: 'Anual Savings with Inflation',
              calculateportfolio: 'Calculate Portfolio',
              totalinvested: 'Total Invested',
              portfolio: 'Portfolio',
              year: 'Age',
              years: 'Years',
              mOutOfMoney: 'With the current anual spending money you will run out of money at the age of ',
              tAnualSpending: 'Net anual spending in retirement.',
              savings: 'Savings',
              tPortfolio: 'Portfolio value with anual spending after retirement',
              tAbout: 'About',
              tContact: 'Contact'
            }
            // here we will place our translations...
          }
        },
        es: {
          translation: {
            intro: {
              title: 'Calculadora de FIRE',
              currency: 'Divisa',
              anualspending: 'Gasto Anual Con Inflación',
              anualspendingWInflation: 'Gasto Anual Con Inflación',
              anualreturn: 'Rentabilidad Anual Promedio',
              averageinflation: 'Inflación Promedio',
              taxes: 'Impuestos',
              initialmoney: 'Dinero inicial',
              initialage: 'Edad Inicial',
              retirementage: 'Edad de retiro',
              anualsavings: 'Ahorro Promedio Anual',
              anualsavingsWInflation: 'Ahorro Anual con Inflación',
              calculateportfolio: 'Calcular Cartera',
              totalinvested: 'Total invertido',
              portfolio: 'Portafolio',
              year: 'Años',
              years: 'Años',
              mOutOfMoney: 'Con el dinero actual para gastos anuales, se quedará sin dinero a la edad de ',
              tAnualSpending: 'Gasto neto anual en jubilación.',
              savings: 'Ahorros',
              tPortfolio: 'Valor de la cartera con gasto anual después de la jubilación',
              tAbout: 'Sobre',
              tContact: 'Contacto'
            }
          }
        },
        pt: {
          translation: {
            intro: {
              title: 'Calculadora do FIRE',
              currency: 'Moeda',
              anualspending: 'Valor anual necessário no FIRE',
              anualspendingWInflation: 'Despesa anual c/ Inflação',
              anualreturn: 'Retorno médio anual',
              averageinflation: 'Inflação média',
              taxes: 'Imposto',
              initialmoney: 'Montante inicial',
              initialage: 'Idade initial',
              retirementage: 'Idade FIRE',
              anualsavings: 'Reforço médio anual',
              anualsavingsWInflation: 'Poupança Anual c/ Inflação',
              calculateportfolio: 'Calcular Portfolio',
              totalinvested: 'Total Investido',
              portfolio: 'Portfolio',
              year: 'Idade',
              years: 'Anos',
              mOutOfMoney: 'Com o valor anual de despesa irá ficar sem dinheiro aos ',
              tAnualSpending: 'Valor anual a despesa na reforma.',
              savings: 'Poupanças',
              tPortfolio: 'Valor de despesa anual na reforma',
              tAbout: 'Sobre',
              tContact: 'Contacto'
            }
          }
        },
        de: {
          translation: {
            intro: {
              title: 'FIRE-Rechner',
              currency: 'Münze',
              anualspending: 'Jährlicher Betrag, der in FIRE erforderlich ist',
              anualspendingWInflation: 'Jährliche Kosten mit Inflation',
              anualreturn: 'Durchschnittliche jahresrendite',
              averageinflation: 'Durchschnittliche inflation',
              taxes: 'Steuer',
              initialmoney: 'Anfangsbetrag',
              initialage: 'Anfangsalter',
              retirementage: 'FIRE-Zeitalter',
              anualsavings: 'Durchschnittliche jährliche verstärkung',
              anualsavingsWInflation: 'Jährliche Einsparungen bei Inflation',
              calculateportfolio: 'Portfolio berechnen',
              totalinvested: 'Insgesamt investiert',
              portfolio: 'Portfolio',
              year: 'Das Alter',
              years: 'Jahre',
              mOutOfMoney: 'Mit dem jetzigen jährlichen Taschengeld geht Ihnen im Alter von ',
              tAnualSpending: 'Jährliche Nettoausgaben im Ruhestand.',
              savings: 'Ersparnisse',
              tPortfolio: 'Portfoliowert mit jährlichen Ausgaben nach der Pensionierung',
              tAbout: 'Über',
              tContact: 'Kontakt'
            }
          }
        }
      }
    }, (err, t) => {
      if (err) return console.error(err);

      // for options see
      // https://github.com/i18next/jquery-i18next#initialize-the-plugin
      jqueryI18next.init(i18next, $, { useOptionsAttr: true });

      // fill language switcher
      Object.keys(lngs).map((lng) => {
        const opt = new Option(lngs[lng].nativeName, lng);
        if (lng === i18next.resolvedLanguage) {
          opt.setAttribute("selected", "selected");
        }
        $('#languageSwitcher').append(opt);
      });
      $('#languageSwitcher').change((a, b, c) => {
        const chosenLng = $(this).find("option:selected").attr('value');
        i18next.changeLanguage(chosenLng, () => {
          rerender();
        });
      });

      rerender();
    });
});
