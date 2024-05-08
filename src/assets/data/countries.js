const COUNTRIES = [
  {
    "name_es": "Afganistán",
    "dial_code": "+93",
    "code_2": "AF",
  },
  {
    "name_es": "Åland",
    "dial_code": "+358",
    "code_2": "AX",
  },
  {
    "name_es": "Albania",
    "dial_code": "+355",
    "code_2": "AL",
  },
  {
    "name_es": "Argelia",
    "dial_code": "+213",
    "code_2": "DZ",
  },
  {
    "name_es": "Samoa Americana",
    "dial_code": "+1684",
    "code_2": "AS",
  },
  {
    "name_es": "Andorra",
    "dial_code": "+376",
    "code_2": "AD",
  },
  {
    "name_es": "Angola",
    "dial_code": "+244",
    "code_2": "AO",
  },
  {
    "name_es": "Anguilla",
    "dial_code": "+1264",
    "code_2": "AI",
  },
  {
    "name_es": "Antártida",
    "dial_code": "+672",
    "code_2": "AQ",
  },
  {
    "name_es": "Antigua y Barbuda",
    "dial_code": "+1268",
    "code_2": "AG",
  },
  {
    "name_es": "Argentina",
    "dial_code": "+54",
    "code_2": "AR",
  },
  {
    "name_es": "Armenia",
    "dial_code": "+374",
    "code_2": "AM",
  },
  {
    "name_es": "Aruba",
    "dial_code": "+297",
    "code_2": "AW",
  },
  {
    "name_es": "Ascensión Island",
    "dial_code": "+247",
    "code_2": "AC",
  },
  {
    "name_es": "Australia",
    "dial_code": "+61",
    "code_2": "AU",
  },
  {
    "name_es": "Austria",
    "dial_code": "+43",
    "code_2": "AT",
  },
  {
    "name_es": "Azerbaiyán",
    "dial_code": "+994",
    "code_2": "AZ",
  },
  {
    "name_es": "Bahamas",
    "dial_code": "+1242",
    "code_2": "BS",
  },
  {
    "name_es": "Baréin",
    "dial_code": "+973",
    "code_2": "BH",
  },
  {
    "name_es": "Bangladés",
    "dial_code": "+880",
    "code_2": "BD",
  },
  {
    "name_es": "Barbados",
    "dial_code": "+1246",
    "code_2": "BB",
  },
  {
    "name_es": "Bielorrusia",
    "dial_code": "+375",
    "code_2": "BY",
  },
  {
    "name_es": "Bélgica",
    "dial_code": "+32",
    "code_2": "BE",
  },
  {
    "name_es": "Belice",
    "dial_code": "+501",
    "code_2": "BZ",
  },
  {
    "name_es": "Benin",
    "dial_code": "+229",
    "code_2": "BJ",
  },
  {
    "name_es": "Bermudas",
    "dial_code": "+1441",
    "code_2": "BM",
  },
  {
    "name_es": "Bután",
    "dial_code": "+975",
    "code_2": "BT",
  },
  {
    "name_es": "Bolivia",
    "dial_code": "+591",
    "code_2": "BO",
  },
  {
    "name_es": "Bonaire, San Eustaquio y Saba",
    "dial_code": "+599",
    "code_2": "BQ",
  },
  {
    "name_es": "Bosnia y Herzegovina",
    "dial_code": "+387",
    "code_2": "BA",
  },
  {
    "name_es": "Botsuana",
    "dial_code": "+267",
    "code_2": "BW",
  },
  {
    "name_es": "Brasil",
    "dial_code": "+55",
    "code_2": "BR",
  },
  {
    "name_es": "Territorio Británico del Océano Índico",
    "dial_code": "+246",
    "code_2": "IO",
  },
  {
    "name_es": "Brunéi",
    "dial_code": "+673",
    "code_2": "BN",
  },
  {
    "name_es": "Bulgaria",
    "dial_code": "+359",
    "code_2": "BG",
  },
  {
    "name_es": "Burkina Faso",
    "dial_code": "+226",
    "code_2": "BF",
  },
  {
    "name_es": "Burundi",
    "dial_code": "+257",
    "code_2": "BI",
  },
  {
    "name_es": "Camboya",
    "dial_code": "+855",
    "code_2": "KH",
  },
  {
    "name_es": "Camerún",
    "dial_code": "+237",
    "code_2": "CM",
  },
  {
    "name_es": "Canadá",
    "dial_code": "+1",
    "code_2": "CA",
  },
  {
    "name_es": "Cabo Verde",
    "dial_code": "+238",
    "code_2": "CV",
  },
  {
    "name_es": "Islas Caimán",
    "dial_code": "+1345",
    "code_2": "KY",
  },
  {
    "name_es": "República Centroafricana",
    "dial_code": "+236",
    "code_2": "CF",
  },
  {
    "name_es": "Chad",
    "dial_code": "+235",
    "code_2": "TD",
  },
  {
    "name_es": "Chile",
    "dial_code": "+56",
    "code_2": "CL",
  },
  {
    "name_es": "China",
    "dial_code": "+86",
    "code_2": "CN",
  },
  {
    "name_es": "Isla de Navidad",
    "dial_code": "+61",
    "code_2": "CX",
  },
  {
    "name_es": "Islas Cocos",
    "dial_code": "+61",
    "code_2": "CC",
  },
  {
    "name_es": "Colombia",
    "dial_code": "+57",
    "code_2": "CO",
  },
  {
    "name_es": "Comoras",
    "dial_code": "+269",
    "code_2": "KM",
  },
  {
    "name_es": "Congo",
    "dial_code": "+242",
    "code_2": "CG",
  },
  {
    "name_es": "Islas Cook",
    "dial_code": "+682",
    "code_2": "CK",
  },
  {
    "name_es": "Costa Rica",
    "dial_code": "+506",
    "code_2": "CR",
  },
  {
    "name_es": "Croacia",
    "dial_code": "+385",
    "code_2": "HR",
  },
  {
    "name_es": "Cuba",
    "dial_code": "+53",
    "code_2": "CU",
  },
  {
    "name_es": "Curazao",
    "dial_code": "+599",
    "code_2": "CW",
  },
  {
    "name_es": "Chipre",
    "dial_code": "+357",
    "code_2": "CY",
  },
  {
    "name_es": "Chequia",
    "dial_code": "+420",
    "code_2": "CZ",
  },
  {
    "name_es": "Costa de Marfil",
    "dial_code": "+225",
    "code_2": "CI",
  },
  {
    "name_es": "Dinamarca",
    "dial_code": "+45",
    "code_2": "DK",
  },
  {
    "name_es": "Yibuti",
    "dial_code": "+253",
    "code_2": "DJ",
  },
  {
    "name_es": "Dominica",
    "dial_code": "+1767",
    "code_2": "DM",
  },
  {
    "name_es": "República Dominicana",
    "dial_code": "+1849",
    "code_2": "DO",
  },
  {
    "name_es": "Ecuador",
    "dial_code": "+593",
    "code_2": "EC",
  },
  {
    "name_es": "Egipto",
    "dial_code": "+20",
    "code_2": "EG",
  },
  {
    "name_es": "El Salvador",
    "dial_code": "+503",
    "code_2": "SV",
  },
  {
    "name_es": "Guinea Ecuatorial",
    "dial_code": "+240",
    "code_2": "GQ",
  },
  {
    "name_es": "Eritrea",
    "dial_code": "+291",
    "code_2": "ER",
  },
  {
    "name_es": "Estonia",
    "dial_code": "+372",
    "code_2": "EE",
  },
  {
    "name_es": "Suazilandia",
    "dial_code": "+268",
    "code_2": "SZ",
  },
  {
    "name_es": "Etiopía",
    "dial_code": "+251",
    "code_2": "ET",
  },
  {
    "name_es": "Islas Malvinas",
    "dial_code": "+500",
    "code_2": "FK",
  },
  {
    "name_es": "Islas Feroe",
    "dial_code": "+298",
    "code_2": "FO",
  },
  {
    "name_es": "Fiyi",
    "dial_code": "+679",
    "code_2": "FJ",
  },
  {
    "name_es": "Finlandia",
    "dial_code": "+358",
    "code_2": "FI",
  },
  {
    "name_es": "Francia",
    "dial_code": "+33",
    "code_2": "FR",
  },
  {
    "name_es": "Guayana Francesa",
    "dial_code": "+594",
    "code_2": "GF",
  },
  {
    "name_es": "Polinesia Francesa",
    "dial_code": "+689",
    "code_2": "PF",
  },
  {
    "name_es": "Territorios Australes Franceses",
    "dial_code": "+262",
    "code_2": "TF",
  },
  {
    "name_es": "Gabón",
    "dial_code": "+241",
    "code_2": "GA",
  },
  {
    "name_es": "Gambia",
    "dial_code": "+220",
    "code_2": "GM",
  },
  {
    "name_es": "Georgia",
    "dial_code": "+995",
    "code_2": "GE",
  },
  {
    "name_es": "Alemania",
    "dial_code": "+49",
    "code_2": "DE",
  },
  {
    "name_es": "Ghana",
    "dial_code": "+233",
    "code_2": "GH",
  },
  {
    "name_es": "Gibraltar",
    "dial_code": "+350",
    "code_2": "GI",
  },
  {
    "name_es": "Grecia",
    "dial_code": "+30",
    "code_2": "GR",
  },
  {
    "name_es": "Groenlandia",
    "dial_code": "+299",
    "code_2": "GL",
  },
  {
    "name_es": "Granada",
    "dial_code": "+1473",
    "code_2": "GD",
  },
  {
    "name_es": "Guadalupe",
    "dial_code": "+590",
    "code_2": "GP",
  },
  {
    "name_es": "Guam",
    "dial_code": "+1671",
    "code_2": "GU",
  },
  {
    "name_es": "Guatemala",
    "dial_code": "+502",
    "code_2": "GT",
  },
  {
    "name_es": "Guernsey",
    "dial_code": "+44",
    "code_2": "GG",
  },
  {
    "name_es": "Guinea",
    "dial_code": "+224",
    "code_2": "GN",
  },
  {
    "name_es": "Guinea-Bissau",
    "dial_code": "+245",
    "code_2": "GW",
  },
  {
    "name_es": "Guyana",
    "dial_code": "+592",
    "code_2": "GY",
  },
  {
    "name_es": "Haití",
    "dial_code": "+509",
    "code_2": "HT",
  },
  {
    "name_es": "Islas Heard y McDonald",
    "dial_code": "+672",
    "code_2": "HM",
  },
  {
    "name_es": "Honduras",
    "dial_code": "+504",
    "code_2": "HN",
  },
  {
    "name_es": "Hong Kong",
    "dial_code": "+852",
    "code_2": "HK",
  },
  {
    "name_es": "Hungría",
    "dial_code": "+36",
    "code_2": "HU",
  },
  {
    "name_es": "Islandia",
    "dial_code": "+354",
    "code_2": "IS",
  },
  {
    "name_es": "India",
    "dial_code": "+91",
    "code_2": "IN",
  },
  {
    "name_es": "Indonesia",
    "dial_code": "+62",
    "code_2": "ID",
  },
  {
    "name_es": "Irán",
    "dial_code": "+98",
    "code_2": "IR",
  },
  {
    "name_es": "Irak",
    "dial_code": "+964",
    "code_2": "IQ",
  },
  {
    "name_es": "Irlanda",
    "dial_code": "+353",
    "code_2": "IE",
  },
  {
    "name_es": "Isla de Man",
    "dial_code": "+44",
    "code_2": "IM",
  },
  {
    "name_es": "Israel",
    "dial_code": "+972",
    "code_2": "IL",
  },
  {
    "name_es": "Italia",
    "dial_code": "+39",
    "code_2": "IT",
  },
  {
    "name_es": "Jamaica",
    "dial_code": "+1 876",
    "code_2": "JM",
  },
  {
    "name_es": "Japón",
    "dial_code": "+81",
    "code_2": "JP",
  },
  {
    "name_es": "Jersey",
    "dial_code": "+44",
    "code_2": "JE",
  },
  {
    "name_es": "Jordania",
    "dial_code": "+962",
    "code_2": "JO",
  },
  {
    "name_es": "Kazajistán",
    "dial_code": "+7 7",
    "code_2": "KZ",
  },
  {
    "name_es": "Kenia",
    "dial_code": "+254",
    "code_2": "KE",
  },
  {
    "name_es": "Kiribati",
    "dial_code": "+686",
    "code_2": "KI",
  },
  {
    "name_es": "Kosovo",
    "dial_code": "+383",
    "code_2": "XK",
  },
  {
    "name_es": "Kuwait",
    "dial_code": "+965",
    "code_2": "KW",
  },
  {
    "name_es": "Kirguistán",
    "dial_code": "+996",
    "code_2": "KG",
  },
  {
    "name_es": "Laos",
    "dial_code": "+856",
    "code_2": "LA",
  },
  {
    "name_es": "Letonia",
    "dial_code": "+371",
    "code_2": "LV",
  },
  {
    "name_es": "Líbano",
    "dial_code": "+961",
    "code_2": "LB",
  },
  {
    "name_es": "Lesoto",
    "dial_code": "+266",
    "code_2": "LS",
  },
  {
    "name_es": "Liberia",
    "dial_code": "+231",
    "code_2": "LR",
  },
  {
    "name_es": "Libia",
    "dial_code": "+218",
    "code_2": "LY",
  },
  {
    "name_es": "Liechtenstein",
    "dial_code": "+423",
    "code_2": "LI",
  },
  {
    "name_es": "Lituania",
    "dial_code": "+370",
    "code_2": "LT",
  },
  {
    "name_es": "Luxemburgo",
    "dial_code": "+352",
    "code_2": "LU",
  },
  {
    "name_es": "Macao",
    "dial_code": "+853",
    "code_2": "MO",
  },
  {
    "name_es": "Madagascar",
    "dial_code": "+261",
    "code_2": "MG",
  },
  {
    "name_es": "Malawi",
    "dial_code": "+265",
    "code_2": "MW",
  },
  {
    "name_es": "Malasia",
    "dial_code": "+60",
    "code_2": "MY",
  },
  {
    "name_es": "Maldivas",
    "dial_code": "+960",
    "code_2": "MV",
  },
  {
    "name_es": "Mali",
    "dial_code": "+223",
    "code_2": "ML",
  },
  {
    "name_es": "Malta",
    "dial_code": "+356",
    "code_2": "MT",
  },
  {
    "name_es": "Islas Marshall",
    "dial_code": "+692",
    "code_2": "MH",
  },
  {
    "name_es": "Martinica",
    "dial_code": "+596",
    "code_2": "MQ",
  },
  {
    "name_es": "Mauritania",
    "dial_code": "+222",
    "code_2": "MR",
  },
  {
    "name_es": "Mauricio",
    "dial_code": "+230",
    "code_2": "MU",
  },
  {
    "name_es": "Mayotte",
    "dial_code": "+262",
    "code_2": "YT",
  },
  {
    "name_es": "México",
    "dial_code": "+52",
    "code_2": "MX",
  },
  {
    "name_es": "Micronesia",
    "dial_code": "+691",
    "code_2": "FM",
  },
  {
    "name_es": "Moldavia",
    "dial_code": "+373",
    "code_2": "MD",
  },
  {
    "name_es": "Mónaco",
    "dial_code": "+377",
    "code_2": "MC",
  },
  {
    "name_es": "Mongolia",
    "dial_code": "+976",
    "code_2": "MN",
  },
  {
    "name_es": "Montenegro",
    "dial_code": "+382",
    "code_2": "ME",
  },
  {
    "name_es": "Montserrat",
    "dial_code": "+1664",
    "code_2": "MS",
  },
  {
    "name_es": "Marruecos",
    "dial_code": "+212",
    "code_2": "MA",
  },
  {
    "name_es": "Mozambique",
    "dial_code": "+258",
    "code_2": "MZ",
  },
  {
    "name_es": "Myanmar",
    "dial_code": "+95",
    "code_2": "MM",
  },
  {
    "name_es": "Namibia",
    "dial_code": "+264",
    "code_2": "NA",
  },
  {
    "name_es": "Nauru",
    "dial_code": "+674",
    "code_2": "NR",
  },
  {
    "name_es": "Nepal",
    "dial_code": "+977",
    "code_2": "NP",
  },
  {
    "name_es": "Países Bajos",
    "dial_code": "+31",
    "code_2": "NL",
  },
  {
    "name_es": "Nueva Caledonia",
    "dial_code": "+687",
    "code_2": "NC",
  },
  {
    "name_es": "Nueva Zelanda",
    "dial_code": "+64",
    "code_2": "NZ",
  },
  {
    "name_es": "Nicaragua",
    "dial_code": "+505",
    "code_2": "NI",
  },
  {
    "name_es": "Níger",
    "dial_code": "+227",
    "code_2": "NE",
  },
  {
    "name_es": "Nigeria",
    "dial_code": "+234",
    "code_2": "NG",
  },
  {
    "name_es": "Niue",
    "dial_code": "+683",
    "code_2": "NU",
  },
  {
    "name_es": "Isla Norfolk",
    "dial_code": "+672",
    "code_2": "NF",
  },
  {
    "name_es": "Corea del Norte",
    "dial_code": "+850",
    "code_2": "KP",
  },
  {
    "name_es": "Macedonia del Norte",
    "dial_code": "+389",
    "code_2": "MK",
  },
  {
    "name_es": "Islas Marianas del Norte",
    "dial_code": "+1670",
    "code_2": "MP",
  },
  {
    "name_es": "Noruega",
    "dial_code": "+47",
    "code_2": "NO",
  },
  {
    "name_es": "Omán",
    "dial_code": "+968",
    "code_2": "OM",
  },
  {
    "name_es": "Pakistán",
    "dial_code": "+92",
    "code_2": "PK",
  },
  {
    "name_es": "Palaos",
    "dial_code": "+680",
    "code_2": "PW",
  },
  {
    "name_es": "Palestina",
    "dial_code": "+970",
    "code_2": "PS",
  },
  {
    "name_es": "Panamá",
    "dial_code": "+507",
    "code_2": "PA",
  },
  {
    "name_es": "Papúa Nueva Guinea",
    "dial_code": "+675",
    "code_2": "PG",
  },
  {
    "name_es": "Paraguay",
    "dial_code": "+595",
    "code_2": "PY",
  },
  {
    "name_es": "Perú",
    "dial_code": "+51",
    "code_2": "PE",
  },
  {
    "name_es": "Filipinas",
    "dial_code": "+63",
    "code_2": "PH",
  },
  {
    "name_es": "Islas Pitcairn",
    "dial_code": "+64",
    "code_2": "PN",
  },
  {
    "name_es": "Polonia",
    "dial_code": "+48",
    "code_2": "PL",
  },
  {
    "name_es": "Portugal",
    "dial_code": "+351",
    "code_2": "PT",
  },
  {
    "name_es": "Puerto Rico",
    "dial_code": "+1939",
    "code_2": "PR",
  },
  {
    "name_es": "Catar",
    "dial_code": "+974",
    "code_2": "QA",
  },
  {
    "name_es": "Rumania",
    "dial_code": "+40",
    "code_2": "RO",
  },
  {
    "name_es": "Rusia",
    "dial_code": "+7",
    "code_2": "RU",
  },
  {
    "name_es": "Ruanda",
    "dial_code": "+250",
    "code_2": "RW",
  },
  {
    "name_es": "Reunión",
    "dial_code": "+262",
    "code_2": "RE",
  },
  {
    "name_es": "San Bartolomé",
    "dial_code": "+590",
    "code_2": "BL",
  },
  {
    "name_es": "Santa Elena",
    "dial_code": "+290",
    "code_2": "SH",
  },
  {
    "name_es": "San Cristóbal y Nieves",
    "dial_code": "+1869",
    "code_2": "KN",
  },
  {
    "name_es": "Santa Lucía",
    "dial_code": "+1758",
    "code_2": "LC",
  },
  {
    "name_es": "San Martín",
    "dial_code": "+590",
    "code_2": "MF",
  },
  {
    "name_es": "San Pedro y Miquelón",
    "dial_code": "+508",
    "code_2": "PM",
  },
  {
    "name_es": "San Vicente y las Granadinas",
    "dial_code": "+1784",
    "code_2": "VC",
  },
  {
    "name_es": "Samoa",
    "dial_code": "+685",
    "code_2": "WS",
  },
  {
    "name_es": "San Marino",
    "dial_code": "+378",
    "code_2": "SM",
  },
  {
    "name_es": "Santo Tomé y Príncipe",
    "dial_code": "+239",
    "code_2": "ST",
  },
  {
    "name_es": "Arabia Saudita",
    "dial_code": "+966",
    "code_2": "SA",
  },
  {
    "name_es": "Senegal",
    "dial_code": "+221",
    "code_2": "SN",
  },
  {
    "name_es": "Serbia",
    "dial_code": "+381",
    "code_2": "RS",
  },
  {
    "name_es": "Seychelles",
    "dial_code": "+248",
    "code_2": "SC",
  },
  {
    "name_es": "Sierra Leona",
    "dial_code": "+232",
    "code_2": "SL",
  },
  {
    "name_es": "Singapur",
    "dial_code": "+65",
    "code_2": "SG",
  },
  {
    "name_es": "Sint Maarten",
    "dial_code": "+1721",
    "code_2": "SX",
  },
  {
    "name_es": "Eslovaquia",
    "dial_code": "+421",
    "code_2": "SK",
  },
  {
    "name_es": "Eslovenia",
    "dial_code": "+386",
    "code_2": "SI",
  },
  {
    "name_es": "Islas Salomón",
    "dial_code": "+677",
    "code_2": "SB",
  },
  {
    "name_es": "Somalia",
    "dial_code": "+252",
    "code_2": "SO",
  },
  {
    "name_es": "Sudáfrica",
    "dial_code": "+27",
    "code_2": "ZA",
  },
  {
    "name_es": "Islas Georgias del Sur y Sandwich del Sur",
    "dial_code": "+500",
    "code_2": "GS",
  },
  {
    "name_es": "Corea del Sur",
    "dial_code": "+82",
    "code_2": "KR",
  },
  {
    "name_es": "Sudán del Sur",
    "dial_code": "+211",
    "code_2": "SS",
  },
  {
    "name_es": "España",
    "dial_code": "+34",
    "code_2": "ES",
  },
  {
    "name_es": "Sri Lanka",
    "dial_code": "+94",
    "code_2": "LK",
  },
  {
    "name_es": "Sudán",
    "dial_code": "+249",
    "code_2": "SD",
  },
  {
    "name_es": "Surinam",
    "dial_code": "+597",
    "code_2": "SR",
  },
  {
    "name_es": "Svalbard y Jan Mayen",
    "dial_code": "+47",
    "code_2": "SJ",
  },
  {
    "name_es": "Suecia",
    "dial_code": "+46",
    "code_2": "SE",
  },
  {
    "name_es": "Suiza",
    "dial_code": "+41",
    "code_2": "CH",
  },
  {
    "name_es": "Siria",
    "dial_code": "+963",
    "code_2": "SY",
  },
  {
    "name_es": "Taiwán",
    "dial_code": "+886",
    "code_2": "TW",
  },
  {
    "name_es": "Tayikistán",
    "dial_code": "+992",
    "code_2": "TJ",
  },
  {
    "name_es": "Tanzania",
    "dial_code": "+255",
    "code_2": "TZ",
  },
  {
    "name_es": "Tailandia",
    "dial_code": "+66",
    "code_2": "TH",
  },
  {
    "name_es": "Timor-Leste",
    "dial_code": "+670",
    "code_2": "TL",
  },
  {
    "name_es": "Togo",
    "dial_code": "+228",
    "code_2": "TG",
  },
  {
    "name_es": "Tokelau",
    "dial_code": "+690",
    "code_2": "TK",
  },
  {
    "name_es": "Tonga",
    "dial_code": "+676",
    "code_2": "TO",
  },
  {
    "name_es": "Trinidad y Tobago",
    "dial_code": "+1868",
    "code_2": "TT",
  },
  {
    "name_es": "Tristán de Acuña",
    "dial_code": "+290",
    "code_2": "TA",
  },
  {
    "name_es": "Túnez",
    "dial_code": "+216",
    "code_2": "TN",
  },
  {
    "name_es": "Turkmenistán",
    "dial_code": "+993",
    "code_2": "TM",
  },
  {
    "name_es": "Islas Turcas y Caicos",
    "dial_code": "+1649",
    "code_2": "TC",
  },
  {
    "name_es": "Tuvalu",
    "dial_code": "+688",
    "code_2": "TV",
  },
  {
    "name_es": "Turquía",
    "dial_code": "+90",
    "code_2": "TR",
  },
  {
    "name_es": "Uganda",
    "dial_code": "+256",
    "code_2": "UG",
  },
  {
    "name_es": "Ucrania",
    "dial_code": "+380",
    "code_2": "UA",
  },
  {
    "name_es": "Emiratos Árabes Unidos",
    "dial_code": "+971",
    "code_2": "AE",
  },
  {
    "name_es": "Reino Unido",
    "dial_code": "+44",
    "code_2": "GB",
  },
  {
    "name_es": "Estados Unidos",
    "dial_code": "+1",
    "code_2": "US",
  },
  {
    "name_es": "Uruguay",
    "dial_code": "+598",
    "code_2": "UY",
  },
  {
    "name_es": "Uzbekistán",
    "dial_code": "+998",
    "code_2": "UZ",
  },
  {
    "name_es": "Vanuatu",
    "dial_code": "+678",
    "code_2": "VU",
  },
  {
    "name_es": "Ciudad del Vaticano",
    "dial_code": "+379",
    "code_2": "VA",
    },
  {
    "name_es": "Venezuela",
    "dial_code": "+58",
    "code_2": "VE",
  },
  {
    "name_es": "Vietnam",
    "dial_code": "+84",
    "code_2": "VN",
  },
  {
    "name_es": "Islas Vírgenes Británicas",
    "dial_code": "+1284",
    "code_2": "VG",
  },
  {
    "name_es": "Islas Vírgenes de los Estados Unidos",
    "dial_code": "+1340",
    "code_2": "VI",
  },
  {
    "name_es": "Wallis y Futuna",
    "dial_code": "+681",
    "code_2": "WF",
  },
  {
    "name_es": "Sahara Occidental",
    "dial_code": "+212",
    "code_2": "EH",
  },
  {
    "name_es": "Yemen",
    "dial_code": "+967",
    "code_2": "YE",
  },
  {
    "name_es": "Zambia",
    "dial_code": "+260",
    "code_2": "ZM",
  },
  {
    "name_es": "Zimbabue",
    "dial_code": "+263",
    "code_2": "ZW",
  }
]

export default COUNTRIES;