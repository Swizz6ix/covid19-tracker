import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, CardContent, FormControl, MenuItem, Select } from '@mui/material';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './utils';
import LineGraph from './LineGraph';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  

  // fetch all data (worldwide)
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  
  }, []);
  
  // fetch only countries data
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso3
          }
        ));

        const sortedData =sortData(data)
        setCountries(countries);
        setTableData(sortedData);
        setMapCountries(data);
      });
    };
    console.log("gd", mapCountries)
    
    return () => {
      getCountriesData();
    };
  }, []);

  // onclick function
  const onCountryChange = async (e) => {
    const countryCode =e.target.value;
    setCountry(countryCode)
    console.log('6ix', countryCode)

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      // setMapCenter([data.countryInfo.lat, data.countryInfo.lng]);
      setMapZoom(4);

      const { countryInfo: {lat, long}} = data;
      setMapCenter({lat, lng: long});

    });
  };
  console.log("move",mapCenter)
  console.log('COUNTRYinFO', countryInfo)


  return (
    <div className="app">
      <div className='app__left'>
      <div className='app__header'>
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select variant='outlined' value={country} onChange={onCountryChange} >
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>


      <div className='app__stats'>
            <InfoBox title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            isRed
            />
            <InfoBox title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            />
            <InfoBox title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            isRed
            />
      </div>
      <Map center={mapCenter}
      zoom={mapZoom}
      countries={mapCountries}
      casesType={casesType}
      />
      </div>


      <Card className='app__right'>
        <CardContent>
          <h3 className='app__graphTitle'>Live Cases by Country</h3>
          <Table countries={tableData} />

          <h3>Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" 
          casesType={casesType} />
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
