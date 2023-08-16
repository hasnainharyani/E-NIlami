import { useEffect, useState, useReducer, useContext } from 'react';
import { AbortedDeferredError, useNavigate } from "react-router-dom";
import { Grid, TextField, Divider, Box, FormLabel, FormControlLabel, RadioGroup, Radio, FormControl, Button, InputLabel, Select, MenuItem} from '@mui/material';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import {UserContext} from '../ContextAPI/userContext';

const initialState = {
  item_name: '',
  price: '',
  condition: '',
  activity: '',
  category: '',
  location: '',
  image: []
};

const reducer = (state, action) => {
  const {type, payload, fieldName} = action;

  switch(type){
    case 'ON_FIELD_VALUE_INPUT':
      return {...state, [fieldName]: payload};
    case 'ADD_IMAGE':
      const imgs = [];
      for(let key in payload){
        if(!isNaN(key)) imgs.push(payload[key]);
      }
      return {...state, [fieldName]: [...state[fieldName], ...imgs]};
    default: return state;
  }
};

const PostAds = () => {
  const [adDetail, dispatch] = useReducer(reducer, initialState);
  const [imgsPreview, setImgsPreview] = useState([]);
  const {user} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(!adDetail.image.length) return;

    setImgsPreview(adDetail.image.map(el => URL.createObjectURL(el)));

    return () => URL.revokeObjectURL(imgsPreview);
  }, [adDetail.image]);

  const onChangeValue = (event, fieldName) => {
    fieldName === 'image' && adDetail.image.length < 6 ? 
    dispatch({type: 'ADD_IMAGE', payload: event.target.files, fieldName}) :
    dispatch({type: 'ON_FIELD_VALUE_INPUT', payload: event.target.value, fieldName})
  };

  const deleteImg = (event) => {
    console.log(event.target.parentElement.dataset.imageNumber);
  }

  const otherImages = () => {
    const imgs = [];
    for(let i=1; i<5; i++){
      imgs.push(
        <Grid item xs={6} lg={2} key={i}>
          <div className='secondary-imgs-container'>
            <img src={imgsPreview[i] || './982990.jpg'} alt='some' className='image' />
            <div className="overlay">
              <div className="text" data-image-number={i}>{<DeleteForeverRoundedIcon sx={{fontSize: 20}} onClick={deleteImg} />}</div>
            </div>
          </div>
        </Grid>
      );
    }

    return imgs;
  };

  const submit = async () => {
    
    const promises = adDetail.image.map(async el => {
      const formData = new FormData();
      formData.append('file', el);
      formData.append("upload_preset", "yyedzrrl");

      const cloudi = await fetch(`https://api.cloudinary.com/v1_1/dwx3wmzsm/image/upload`, {
        method: 'POST',
        body: formData
      });

      return await cloudi.json();
    });

    const allImagePromises = await Promise.all(promises);

    const {item_name, price, condition, activity, category, location, image} = adDetail;
    // const formData = new FormData();
    // formData.append('user_id', user.data._id);
    // formData.append('item_name', item_name);
    // formData.append('price', price);
    // formData.append('condition', condition)
    // formData.append('activity', activity);
    // formData.append('category', category);
    // formData.append('date', new Date().getTime());
    
    // for(let i=0; i<image.length; i++){
    //   formData.append('images', image[i]);
    // }

    const imagesPublicId = allImagePromises.map(el => el.public_id);
    console.log(imagesPublicId);

    const data = {
      user_id: user.data._id,
      item_name,
      price,
      condition,
      activity,
      category,
      location,
      date: new Date().getTime(),
      images: imagesPublicId,
    };

    const resp = await fetch('http://localhost:3005/api/v1/user/userActivity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data)
    });

    // console.log(resp)
    if(resp.status === 200) navigate('/');

    // const data = await resp.json();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={12} sx={{marginBottom: 5}}>
        <h2 style={{textAlign: 'left'}}>Post An Ad</h2>
        <Divider />
      </Grid>
      <Grid item xs={12} lg={12} sx={{marginBottom: 5}}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <TextField sx={{width: 200}} onChange={e => onChangeValue(e, 'item_name')} value={adDetail.item_name} id="standard-basic" label="Item Name" variant="standard" />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField sx={{width: 200}} type='number' onChange={e => onChangeValue(e, 'price')} value={adDetail.price} label="Price" variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField sx={{width: 200}} onChange={e => onChangeValue(e, 'condition')} value={adDetail.condition} label="Condition" variant="standard" />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormControl sx={{textAlign: 'left'}}>
                  <FormLabel id="demo-row-radio-buttons-group-label">Add Type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel onChange={e => onChangeValue(e, 'activity')} value="SELL" control={<Radio />} label="Sell" />
                    <FormControlLabel onChange={e => onChangeValue(e, 'activity')} value="BID" control={<Radio />} label="Bid" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormControl variant="standard" sx={{ minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Option"
                    value={adDetail.category}
                    onChange={e => onChangeValue(e, 'category')}
                  >
                    <MenuItem value='Vehicle'>Vehicle</MenuItem>
                    <MenuItem value='Electronics'>Electronics</MenuItem>
                    <MenuItem value='House'>House</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormControl variant="standard" sx={{ minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={adDetail.location}
                    label="City"
                    onChange={e => onChangeValue(e, 'location')}
                  >
                    <MenuItem value={'Hyderabad'}>Hyderabad</MenuItem>
                    <MenuItem value={'Karachi'}>Karachi</MenuItem>
                    <MenuItem value={'Multan'}>Multan</MenuItem>
                    <MenuItem value={'Lahore'}>Lahore</MenuItem>
                    <MenuItem value={'Faislabad'}>Faislabad</MenuItem>
                    <MenuItem value={'Peshawar'}>Peshawar</MenuItem>
                    <MenuItem value={'Islamabad'}>Islamabad</MenuItem>
                    <MenuItem value={'Rawalpindi'}>Rawalpindi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Button
                  color='success'
                  variant="contained"
                  component="label"
                >
                  Upload File
                  <input
                    type="file"
                    onChange={e => onChangeValue(e, 'image')}
                    hidden
                    accept="image/png, image/jpeg"
                    multiple
                  />
                </Button>
              </Grid>
              <Grid item xs={12} lg={12}>
                <Button color='primary' variant='contained' onClick={submit}>Post Ad</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={12}>
                <div className='primary-img-container'>
                  <img src={imgsPreview[0] || './982990.jpg'} alt='some' className='image' />
                  <div className="overlay">
                    <div className="text" data-image-number='0'>{<DeleteForeverRoundedIcon sx={{fontSize: 60}} onClick={deleteImg} />}</div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} lg={12}>
                <Grid container spacing={1}>
                  {otherImages()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PostAds;