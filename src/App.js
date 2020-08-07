import React, { useState, useEffect } from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Grid, Card, CardContent, Typography } from '@material-ui/core';

import axios from 'axios';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import { sortData, prettyPrintStat } from './util';
import 'leaflet/dist/leaflet.css';
import image from './components/159648632934455623.png';
import { makeStyles, withTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		border: '2px solid #8395A7',
		borderRadius: '7px'
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}));

function App() {
	const classes = useStyles();
	const [ countries, setCountries ] = useState([]);
	const [ country, setCountry ] = useState('worldwide');
	const [ countryInfo, setCountryInfo ] = useState({});
	const [ tableData, setTableData ] = useState([]);
	const [ mapCenter, setMapCenter ] = useState({ lat: 34.80746, lng: -40.4796 });
	const [ mapZoom, setMapZoom ] = useState(2);
	const [ mapCountries, setMapCountries ] = useState([]);
	const [ casesType, setCasesType ] = useState('cases');

	useEffect(() => {
		const initialValues = async () => {
			const { data } = await axios.get('https://disease.sh/v3/covid-19/all');
			setCountryInfo(data);
		};
		initialValues();
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			const { data } = await axios.get('https://disease.sh/v3/covid-19/countries');
			const requiredData = data.map((country) => ({
				name: country.country,
				value: country.countryInfo.iso2
			}));

			/*
			We can also use fetch instead of axios
			CODE for using fetch:

			await fetch('https://disease.sh/v3/covid-19/countries').then((response) => response.json()).then((data) => {
				const countryData = data.map((country) => ({
					name: country.country,
					value: country.countryInfo.iso2
				}));
			*/
			const sortedData = sortData(data);
			setTableData(sortedData);
			setCountries(requiredData);
			setMapCountries(data);
		};
		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;

		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		const { data } = await axios.get(url);
		setCountryInfo(data);
		setCountry(countryCode);
		setMapCenter([ data.countryInfo.lat, data.countryInfo.long ]);
		setMapZoom(4);
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<img src={image} />

					<FormControl variant="outlined" className={classes.formControl}>
						<Select
							variant="outlined"
							onChange={onCountryChange}
							className="dropdown__display"
							value={country}
						>
							<MenuItem className="dropDown_Select" value="worldwide">
								World Wide
							</MenuItem>;
							{countries.map((country) => {
								return (
									<MenuItem className="dropDown_Select" value={country.value}>
										{country.name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
				<div className="app__stats">
					<InfoBox
						onClick={(e) => setCasesType('cases')}
						isRed
						active={casesType === 'cases'}
						title="Coronavirus Cases"
						total={prettyPrintStat(countryInfo.cases)}
						cases={prettyPrintStat(countryInfo.todayCases)}
					/>

					<InfoBox
						onClick={(e) => setCasesType('recovered')}
						title="Recovered"
						active={casesType === 'recovered'}
						total={prettyPrintStat(countryInfo.recovered)}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
					/>

					<InfoBox
						onClick={(e) => setCasesType('deaths')}
						isRed
						title="Deaths"
						active={casesType === 'deaths'}
						total={prettyPrintStat(countryInfo.deaths)}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
					/>
				</div>
				<Map casesType={casesType} center={mapCenter} zoom={mapZoom} countries={mapCountries} />
			</div>

			<div className="app__right">
				<div className="app__information">
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
					<div className="lineGraph">
						<h3 className="graph">Worldwide new {casesType}</h3>
						<LineGraph casesType={casesType} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
