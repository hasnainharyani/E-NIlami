import { useContext } from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import {Container, Grid} from '@mui/material';
import { styled, Paper } from '@mui/material';
import SearchSection from './Components/SearchSection';
import { UserContext, UserContextProvider } from './ContextAPI/userContext';
import MainPage from './Components/MainPage';
import DetailPage from './Components/detailPage';
import Listings from './Components/listingsPage';
import SignInPage from './Components/SignInPage';
import SignUp from './Components/SignUp';
import Header from './Components/Header';
import PostAds from './Components/adsPage';
import Chat from './Components/chat';
import './styles/style.css';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const sections = [
  { title: 'Mobile', url: '#' },
  { title: 'Furniture', url: '#' },
  { title: 'Car', url: '#' },
  { title: 'Motorcycles', url: '#' },
  { title: 'Houses', url: '#' },
  { title: 'TV', url: '#' },
  { title: 'Tablets', url: '#' },
  { title: 'Land & Plots', url: '#' },
  { title: 'Animals', url: '#' },
  { title: 'Books', url: '#' },
];

const UnAuthorizedAccess = () => {
  return <h2>You are not logged in. <Link to='/signIn'>Click here to login</Link></h2>
}

function App() {
  const {user} = useContext(UserContext);

  return (
    <Container fixed>
      <Grid container spacing={2}>
      <Grid item xs={12} lg={12}>
          <Item> <Header title="E-Nilami" sections={sections} /> </Item>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Item> <SearchSection /> </Item>
        </Grid>
        <Grid item xs={12} lg={12}>
          {/* <div style={{border: '1px solid black'}}></div> */}
          <Item>
            <Routes>
                <Route path='/' element={<MainPage />} />
                <Route path='/detail' element={<DetailPage />} />
                <Route path='/postAds' element={user?.data?._id ? <PostAds /> : <UnAuthorizedAccess />} />
                <Route path='/listings' element={<Listings />} />
                <Route path='/chat' element={user?.data?._id ? <Chat /> : <UnAuthorizedAccess />} />
                <Route path='/signIn' element={<SignInPage/>} />
                <Route path='/signUp' element={<SignUp/>} />
                <Route path='*' element={<h1>404 Not Found!</h1>} />
            </Routes>
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
