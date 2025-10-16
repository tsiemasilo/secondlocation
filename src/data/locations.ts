export interface City {
  name: string;
  province: string;
}

export interface Province {
  name: string;
  cities: string[];
}

export const southAfricanProvinces: Province[] = [
  {
    name: 'Gauteng',
    cities: ['Johannesburg', 'Pretoria', 'Sandton', 'Soweto', 'Midrand', 'Centurion']
  },
  {
    name: 'Western Cape',
    cities: ['Cape Town', 'Stellenbosch', 'Paarl', 'Somerset West', 'George', 'Hermanus']
  },
  {
    name: 'KwaZulu-Natal',
    cities: ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle', 'Port Shepstone']
  },
  {
    name: 'Eastern Cape',
    cities: ['Port Elizabeth', 'East London', 'Mthatha', 'Grahamstown', 'Uitenhage']
  },
  {
    name: 'Free State',
    cities: ['Bloemfontein', 'Welkom', 'Bethlehem', 'Kroonstad', 'Sasolburg']
  },
  {
    name: 'Mpumalanga',
    cities: ['Nelspruit', 'Witbank', 'Middelburg', 'Secunda', 'Standerton']
  },
  {
    name: 'Limpopo',
    cities: ['Polokwane', 'Tzaneen', 'Thohoyandou', 'Mokopane', 'Musina']
  },
  {
    name: 'North West',
    cities: ['Rustenburg', 'Mahikeng', 'Klerksdorp', 'Potchefstroom', 'Brits']
  },
  {
    name: 'Northern Cape',
    cities: ['Kimberley', 'Upington', 'Kuruman', 'Springbok', 'De Aar']
  }
];

export const getAllCities = (): string[] => {
  return southAfricanProvinces.flatMap(province => province.cities);
};

export const getCitiesByProvince = (provinceName: string): string[] => {
  const province = southAfricanProvinces.find(p => p.name === provinceName);
  return province ? province.cities : [];
};
