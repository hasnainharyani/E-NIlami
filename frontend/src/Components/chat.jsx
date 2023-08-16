import {useState, useEffect, useContext} from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Box, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import io from 'socket.io-client';
import {UserContext} from '../ContextAPI/userContext';
const socket  = io.connect('http://localhost:3005');

const Chat = () => {
  const [msg, setMsg] = useState('');
  const [contactList, setContactList] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedJoinId, setSelectedJoinId] = useState('');
  const [receiver, setReceiver] = useState('');
  const {user: {data: activeUser}} = useContext(UserContext);
  const {state} = useLocation();
  const {userId: sellerDetail} = state;

  console.log(sellerDetail);

  useEffect(() => {
    getChatsName();
  }, []);

  useEffect(() => {
    socket.on('recieveMsg', (data) => {
      const chat = JSON.parse(sessionStorage.getItem('chat'));

      const newMsgsList = chat.map(el => {
        if(el.joinId === data.joinId){
          el.msgs.push({userId: data.userId, text: data.message});
        }
        return el;
      });

       sessionStorage.setItem('chat', JSON.stringify(newMsgsList));
       setContactList(newMsgsList);
    })
  }, [socket]);

  const getChatsName = async () => {
    const chatIDs = activeUser.chats.map(el => el.chatId);

    const resp = await fetch(`http://localhost:3005/api/v1/chat/chatList`, {
      method: 'POST',
      headers: {'Content-Type': 'Application/json'},
      body: JSON.stringify(chatIDs)
    });

    const {data} = await resp.json();

    if(data.length){
      const list = data.map(el => {
        const obj = {joinId: el.joinId};
        obj.name = el.users[0].userId === activeUser._id ? el.users[1].name : el.users[0].name;
        obj.msgs = el.msgs;
        return obj;
      });

      sessionStorage.setItem('chat', JSON.stringify(list));
      setContactList(list);
    }
  };

  const sendMsg = async () => {
    let joinId = selectedJoinId || `${activeUser._id}${sellerDetail._id}`;
    const hasJoinId_withJoinId_combination1 = activeUser.chats.find(el => el.joinId == joinId);
    const hasJoinId_withJoinId_combination2 = activeUser.chats.find(el => {console.log(el.joinId); return el.joinId == `${sellerDetail?._id}${activeUser._id}`});
    let requestType, bodyObj = {}, checkUserFoundInContactList = false;

    if(hasJoinId_withJoinId_combination1) joinId = selectedJoinId || `${activeUser._id}${sellerDetail._id}`;
    else if(hasJoinId_withJoinId_combination2) joinId = selectedJoinId || `${sellerDetail._id}${activeUser._id}`;

    if(hasJoinId_withJoinId_combination1 || hasJoinId_withJoinId_combination2){
      requestType = 'PUT';
      bodyObj = {
        joinId,
        msg: {
          userId: activeUser._id,
          text: msg
        }
      };
    }else{
      requestType = 'POST';
      bodyObj = {
        joinId,
        users: [
          {userId: activeUser._id, name: activeUser.name},
          {userId: sellerDetail._id, name: sellerDetail.name}
        ],
        msgs: [
          {
            userId: activeUser._id,
            text: msg
          }
        ]
      };
    }

    const resp = await fetch(`http://localhost:3005/api/v1/chat/`, {
      method: requestType,
      headers: {'Content-Type': 'Application/json'},
      body: JSON.stringify(bodyObj)
    });

    const {data} = await resp.json();
    // const chat = JSON.parse(sessionStorage.getItem('chat'));
    
    const newMsgsList = contactList.map(el => {
      if(el.joinId === data.joinId){
        el.msgs = data.msgs;
        checkUserFoundInContactList = true;
      }
      return el;
    });

    if(!checkUserFoundInContactList){
      newMsgsList.push({
        joinId: data.joinId,
        msgs: data.msgs,
        name: data.users[0]._id === activeUser._id ? data.users[0].name : data.users[1].name,
      });
    }

    // setIsMsgSent(msg);
    setContactList(newMsgsList);
    sessionStorage.setItem('chat', JSON.stringify(newMsgsList));
    socket.emit('sendMsg', {joinId, userId: activeUser._id, message: msg});
    onChatSelect(joinId, sellerDetail?.name || receiver);
  };

  const onChatSelect = (joinId, chatWith)   => {
    setShowChat(true);
    setSelectedJoinId(joinId);
    setReceiver(chatWith);
  };

  const renderChatList = () => {
    return contactList?.map((el, index) => (
      <ListItem key={index} disablePadding onClick={() => onChatSelect(el.joinId, el.name)}>
        <ListItemButton>
          <ListItemText primary={el.name} />
        </ListItemButton>
      </ListItem>
    ));
  };

  const renderMsgs = () => {
    const contact = contactList?.filter(el => {
      if(el.joinId === selectedJoinId){
        return el;
      }
    });

    return contact[0]?.msgs?.map((el, index) => {
      return (
          <div key={index}>
            <div className={el.userId === activeUser._id ? "msg-box-sender" : 'msg-box-reciever'}>
              <div className={el.userId === activeUser._id ? 'msg' : 'msg2'}>
              {el.text}
              </div>
            </div>
          </div>
        );
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item lg={4} style={{border: '1px solid lightBlue', overflow: 'auto'}}>
        Chat List
        <List>
          {
            renderChatList()
          }
        </List>  
      </Grid>
      <Grid item lg={8} style={{border: '1px solid lightBlue', padding: 0}}>
        <Box sx={{
          width: '752px',
          height: '500px',
        }}>
          <div className='chatBox-conversation'>
            <p className='receiverName'>{sellerDetail?.name || receiver}</p>
            <div style={{flexGrow: 8}} className='conversation'>
              {showChat && renderMsgs()}
            </div>
            <div className='typeBox'>
              <input placeholder='message...' onChange={event => setMsg(event.target.value)} style={{width: '90%', fontSize: '16px', outline: 'none'}} />
              <button style={{width: '10%'}} onClick={sendMsg}>Send</button>
            </div>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Chat;