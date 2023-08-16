import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {FormControl, Autocomplete} from '@mui/material';
import { json } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const [location, setLocation] = useState('');

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
    
  const handleChange = (event, city) => setLocation(city.label);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);

    formData.set('username', formData.get('firstName') + 'gg');

    const signUpDetail = {
      name: formData.get('firstName'),
      lastname: formData.get('lastName'),
      contact: formData.get('phone'),
      nic: formData.get('nic'),
      email: formData.get('email'),
      password: formData.get('password'),
      userName: formData.get('username'),
      location 
    };

    console.log(signUpDetail);

    const resp = await fetch('http://localhost:3005/api/v1/user/signUp', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(signUpDetail)
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nic"
                  label="NIC"
                  name="nic"
                  // autoComplete="nic"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
              fullWidth 
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              name="phone"
              id="phone"
              autoComplete="phone"
              label="Phone"
               />
              </Grid>
              <Grid item xs={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={cities}
            fullWidth
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}