import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {Grid, TextField, Button, FormControl, Autocomplete, Box} from '@mui/material';

const SearchSection = () => {
  const cities = [
    {label: 'Hyderabad', key: 1},
    {label: 'Multan', key: 2},
    {label: 'Faislabad', key: 3},
    {label: 'Peshawar', key: 4},
    {label: 'Lahore', key: 5},
    {label: 'Karachi', key: 6},
    {label: 'Islamabad', key: 7},
    {label: 'Rawalpindi', key: 8},
  ]

  const [location, setLocation] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (event, city) => {
    console.log(city);
    setLocation(city.label);
  };

  const handleItemSearch = (state) => (event) => {
    state(event.target.value);
  };

  const handleSearch = async () => {
    const resp = await fetch(`http://localhost:3005/api/v1/user/search`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({location, item: searchItem})
    });
    console.log(resp);
    const {data} = await resp.json();

    if(data.length) navigate('/listings', {state: {listingDetail: data}});
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={2}>
      <Link to="/" underline="hover" style={{marginBottom: '5px'}} >
        <h2 >E-NILAMI</h2>
      </Link>
      </Grid>
      <Grid item xs={12} lg={4}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={cities}
            autoHighlight
            getOptionLabel={(option) => option.label}
            onChange={handleChange}
            renderOption={(props, option) => (
              // <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Box component="li" {...props}>
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose a city"
                inputProps={{
                  ...params.inputProps,
                  // autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={4}>
        <FormControl sx={{ m: 1, minWidth: 160 }}>
          <TextField id="standard-basic" label="Search item" onChange={handleItemSearch(setSearchItem)} variant="outlined" sx={{minWidth: 300}} />
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={1}>
        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={1}>
        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <Link to="/signIn" underline="hover" style={{marginBottom: '5px'}}>
            Login
          </Link>
          <Link to="/signUp" underline="hover" style={{marginBottom: '5px'}} >
            sign up
          </Link>
        </FormControl>
      </Grid>
    </Grid>
  )
};

export default SearchSection