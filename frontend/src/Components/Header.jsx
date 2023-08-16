import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Toolbar, Button, Typography, Select, MenuItem, FormControl, InputLabel, Box} from '@mui/material';
import {UserContext} from '../ContextAPI/userContext';
function Header(props) {
  const { sections, title } = props;
  const [age, setAge] = React.useState('');
  const{user, defineUser, setLastPageURL, storeSellerDetail} = useContext(UserContext);

  const linkStyle = {
    textDecoration: 'none',
    color: 'black',
  };

  const logoutUser = () => {
    sessionStorage.removeItem('chat');
    defineUser({});
    setLastPageURL('');
    storeSellerDetail({});
  };

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {
          user?.data?.name || <Link to="/signIn" underline="hover"> <Button variant="outlined" size="small">Sign In</Button> </Link>
        }
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        {
          user?.data?.name ? 
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Options</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Option"
                value={age}
                // onChange={handleChange}
              >
                <Link to='/' style={linkStyle}><MenuItem value={10}>Home</MenuItem></Link>
                <Link to='/postAds' style={linkStyle}><MenuItem value={10}>Post Ad</MenuItem></Link>
                <Link to='/listings' state={{listingDetail: user.data}} style={linkStyle}><MenuItem value={10}>My Ads</MenuItem></Link>
                <Link to='/chat' state={{listingDetail: user.data}} style={linkStyle}><MenuItem value={10}>Chat</MenuItem></Link>
                <MenuItem value={10} onClick={logoutUser}>Logout</MenuItem>
              </Select>
            </FormControl>
          </Box> : 
          <Link to="/signUp" underline="hover"><Button href='/signUp' variant="outlined" size="small">Sign up</Button></Link>
        }
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-around', overflowX: 'auto' }}
      >
        <Link
          color="inherit"
          key='Vehicle'
          state={{listingDetail: 'Vehicle'}}
          to='/listings'
          style={{...linkStyle, color: 'blue'}}
        >
          Vehicle
        </Link>
        <Link
          color="inherit"
          key='Electronics'
          state={{listingDetail: 'Electronics'}}
          to='/listings'
          style={{...linkStyle, color: 'blue'}}
        >
          Electronics
        </Link>
        <Link
          color="inherit"
          key='Lands'
          state={{listingDetail: 'House'}}
          to='/listings'
          style={{...linkStyle, color: 'blue'}}
        >
          Lands
        </Link>
        <Link
          color="inherit"
          key='auction'
          state={{listingDetail: 'Auction'}}
          to='/listings'
          style={{...linkStyle, color: 'blue'}}
        >
          Auction
        </Link>
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;