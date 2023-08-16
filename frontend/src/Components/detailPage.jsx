import {useState, useContext, useEffect} from 'react';
import { useLocation, Link } from "react-router-dom";
import { Grid, Box, TextField, Button, Modal, Typography } from "@mui/material";
import { UserContext } from '../ContextAPI/userContext';
import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage} from '@cloudinary/react';
import {thumbnail, fit, fill} from "@cloudinary/url-gen/actions/resize";

const AuctionEndCounter = ({end_date}) => {
  const [counter, setCounter] = useState('');

  useEffect(() => {
    const endDate = new Date(end_date).getTime();
    
    let time = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeLeft = endDate - currentTime;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      setCounter(`${days}:${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => {clearInterval(time)};
  }, []);

  return (
    <Grid item lg={12}>
      <h2>Auction ends in {counter || 'TT:MM:SS'}</h2>
    </Grid>
  );
};

const style = {
  display: 'flex',
  flexDirection: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DetailPage = () => {
  const location = useLocation();
  const {user: {data: loggedinUser}, setLastPageURL} = useContext(UserContext);
  const [bid, setBid] = useState(0);
  const {adDetail} = location.state;
  const bidContainerStyle = {
    border: '1px solid lightBlue',
    borderRadius: '5px',
    margin: '2px 0',
    paddingBottom: '10px',
  };
  const cId = new Cloudinary({
    cloud: {
      cloudName: 'dwx3wmzsm'
    }
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // useEffect(() => {
  //   console.log(socket.connected);
  // }, []);

  const otherImages = () => {
    const imgs = [];
    for(let i=1; i<adDetail?.images?.length; i++){
      const img = cId.image(adDetail.images[i]);
      img.resize(fill().width(50));

      imgs.push(
        <Grid item xs={6} lg={2} key={i}>
          <Box
            sx={{
              width: 50,
              height: 50,
              // backgroundColor: 'primary.dark',
              '&:hover': {
                // backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            <AdvancedImage cldImg={img} />
            {/* <img src={adDetail.image[i]} alt='some image6' style={{width: 'auto', height: '100%'}} /> */}
          </Box>
        </Grid>
      );
    }

    return imgs;
  };

  const placeBid = async () => {
    if(bid){
      const resp = await fetch(`http://localhost:3005/api/v1/user/placeBid/${adDetail._id}`, {
        method: 'PATCH',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_Id: loggedinUser._id,
          name: loggedinUser.name,
          bid
        })
      });
      const data = await resp.json();
      console.log(data);
    }
  }

  const renderBids = () => {
    const bidsList = () => {
      const bidsInDescendingOrder = adDetail.highest_bidder.sort((a, b) => b.bid - a.bid);

      return bidsInDescendingOrder.map(({_id, name, bid, user_Id}) => (
        <Grid container spacing={1} style={bidContainerStyle} key={_id}>
          <Grid item lg={3}>{name}</Grid>
          <Grid item lg={5}>
            Bid: <strong>Rs.{bid}</strong>
          </Grid>
          <Grid item lg={4}>
            <Link to='/chat' state={{userId: user_Id}} className='chat-btn'>Chat With Bidder</Link>
          </Grid>
        </Grid>
      ))
    };

    if(loggedinUser && adDetail.user_id._id === loggedinUser._id){
      return (<>{bidsList()}</>);
    }
    else if(loggedinUser && adDetail.user_id._id !== loggedinUser._id){
      return (
        <>
          <Grid container spacing={1} style={bidContainerStyle}>
            <Grid item lg={3}>User Name</Grid>
            <Grid item lg={6}>
              <TextField sx={{width: 200}} type='number' value={bid} onChange={event => {setBid(event.target.value)}} label="Bid" variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            </Grid>
            <Grid item lg={3}>
              <Button color='primary' variant='contained' onClick={placeBid}>Place Bid</Button>
            </Grid>
          </Grid>
          {bidsList()}
        </>
      );
    }
    else{
      return (
        <>
          <Grid container spacing={1} style={bidContainerStyle}>
            <Grid item lg={12}><h3>Please login to place your bid.</h3></Grid>
          </Grid>
          {bidsList()}
        </>
      );
    }
  };

  const mainImage = cId.image(adDetail.images[0]);
  mainImage.resize(fill().width(300));

  return(
    <Grid container spacing={2}>
      {adDetail?.end_date && <AuctionEndCounter end_date={adDetail.end_date}/>}
      <Grid item xs={12} lg={6}>
        <h3>Details</h3>
        <Grid container spacing={2}>
          <Grid item lg={4}><strong>Item Name</strong>: {adDetail.item_name}</Grid>
          <Grid item lg={4}><strong>Price</strong>: Rs.{adDetail.price}</Grid>
          <Grid item lg={4}><strong>Condition</strong>: {adDetail.condition}</Grid>
          <Grid item lg={4}><strong>Type</strong>: {adDetail.category}</Grid>
          {/* <Grid item lg={12} sx={{textAlign:'left'}}>
            <h3>Description</h3>
            <p>
              This is first line.
              This is second line with some more words.
              This is third line on third line.
            </p>
          </Grid> */}
          <Grid item lg={12} sx={{textAlign:'left'}}>
            <h3>Seller Information</h3>
            <p><strong>Name:</strong> {adDetail.user_id.name}</p>
            <p><strong>Contact:</strong> {adDetail.user_id.contact}</p>
            <p><strong>Email:</strong> {adDetail.user_id.email}</p>
            <p><strong>Location:</strong> {adDetail.location}</p>
            {
              loggedinUser?._id !== adDetail?.user_id?._id && 
              <p><Link to='/chat' onClick={() => setLastPageURL('/chat')} state={{userId: adDetail.user_id}} className='chat-btn'>Chat With Seller</Link></p>
            }
            {adDetail.activity === 'BID' && renderBids()}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <Box
              sx={{
                width: 300,
                height: 300,
                // backgroundColor: 'primary.dark',
                '&:hover': {
                  // backgroundColor: 'primary.main',
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
              onClick={handleOpen}
            >
              <AdvancedImage cldImg={mainImage} />
              {/* <img src={adDetail.images[0]} alt='some' style={{width: 'auto', height: '100%'}} /> */}
            </Box>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Grid container spacing={1}>
              {otherImages()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <AdvancedImage cldImg={mainImage} />
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
        </Box>
      </Modal>
    </Grid>
  );
}

export default DetailPage;