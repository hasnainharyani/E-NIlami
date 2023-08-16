import {useEffect, useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage} from '@cloudinary/react';
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Divider, Chip} from '@mui/material';
import Banner from './Banner'
import {UserContext} from '../ContextAPI/userContext';

const MainPage = () => {
  const {ads, storeAds} = useContext(UserContext);
  const cId = new Cloudinary({
    cloud: {
      cloudName: 'dwx3wmzsm'
    }
  });

  useEffect(() => {
    getAds();
  }, []);

  const getAds = async () => {
    const resp = await fetch('http://localhost:3005/api/v1/user/userActivity');
    const data = await resp.json();
    storeAds(data.data);
  };

  const banner = {
    title: 'E-Nilami Marketplace',
    description:
      " Pakistan's Only Auction and Classified Advertisment System.Best way to sell the things that you are not using and earn some cash.",
    image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    imageText: 'graphic',
    linkText: 'Comming Soon',
  };

  const items = (category) => {
    return category.map((el, i) => {
        const image = cId.image(el.images[0]);
        image.resize(thumbnail().height(160));

        return (
          <Grid item xs={12} lg={4} key={i}>
            <Link to='/detail' state={{adDetail: el}} style={{textDecoration: 'none'}}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  {/* <CardMedia
                    component="img"
                    height="140"
                    image={el.image[0]}
                    alt="green iguana"
                  /> */}
                  <AdvancedImage cldImg={image} />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Condition: {el.condition}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {el.item_name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        );
      }
    );
  };

  const itemCategoriesList = () => {
    const categoryArray = [];

    for(let category in ads){
      ads[category].length && categoryArray.push(
        <Grid item xs={12} lg={12} key={category}>
          {/* <h2>{category}</h2> */}
          <Divider textAlign="left" style={{marginBottom: '20px'}}><h2>{category}</h2></Divider>
          <Grid container spacing={2}>
            {items(ads[category])}
          </Grid>
        </Grid>
      );
    }

    return categoryArray;
  };

  return(
    <Grid container spacing={1}>
    <Grid item xs={12}>
      <Banner post={banner} />
     </Grid>
    <Grid container spacing={2}>
      {itemCategoriesList()}
    </Grid>
    </Grid>
  );
}

export default MainPage;