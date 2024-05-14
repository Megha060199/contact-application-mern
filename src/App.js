import './App.css';
import Card from '@mui/material/Card';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';


function App() {
  const [modalActive, setModalActive] = useState(false)
  const [file, setFile] = useState()
  const [name, setName] = useState('')
  const [date, setDate] = useState(dayjs(''));
  const [modalHeader, setModalHeader] = useState('Create a New Contact')
  const [contactList, setContactList] = useState([])
  const [fetchedImges, setFetchedImages] = useState([])
  const [currentModalImage, setCurrentModalImage] = useState()
  const [activeId, setCurrentActiveId] = useState()
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState('')
  const [fileUploadInfo, setFileUploadInfo] = useState('')

  const serverBaseUrl = 'http://localhost:8080/'
  const fetchContactList = async () => {
    setLoader(true)
    try {
      const response = await fetch(`${serverBaseUrl}getContactList`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact list');
      }
      const data = await response.json();
      setContactList(data.data)
      if (data.data.length  > 0)
      {
        console.log('hereee')
      await downloadImages(data.data)
      }
      else {
        setLoader(false)
      }
      console.log('Contact list:', data);
    } catch (error) {
      console.error('Error fetching contact list:', error);
    }
  }

  const fetchIntialData = useCallback(() => {
    fetchContactList()
  }, []);

  const addImagesToContactlist = () => {
    console.log(fetchedImges, contactList, 'check-before')
    if (fetchedImges && fetchedImges.length > 0 && fetchedImges[0]) {
      const newList = contactList.map((obj, index) => {
        return {
          ...obj,
          'image_url': fetchedImges[index].url
        };
      });
      console.log(newList, 'xheckif updated')
      if (newList.length > 0)
        setContactList(newList)
      setLoader(false)
    }
  }

  const downloadImages = async (data) => {
    await processAndDownloadImages(data)
  }

  useEffect(() => {
    fetchIntialData()
  }, [fetchIntialData])

  useEffect(() => {
    addImagesToContactlist()
  }, [fetchedImges])

  async function processAndDownloadImages(array) {
    async function asyncFunction(element) {

      console.log(element, 'checkkk')
      return await getIndividualFile(element.filename);
    }
    const results = await asyncMap(array, asyncFunction);
    setFetchedImages(results)
  }
  
  async function asyncMap(array, asyncFunction) {
    const results = await Promise.all(array.map(asyncFunction));
    return results
  }

  const getIndividualFile = async (filename) => {
    try {
      const response = await fetch(`${serverBaseUrl}download/${filename}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact list');
      }
      const data = response;
      return data
    } catch (error) {
      console.error('Error fetching contact list:', error);
    }
  };
  return (
    <>
      <div>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loader}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <Container fixed>
        <Grid container >
          <Grid item md={9} >
            <h1>Contacts</h1>
          </Grid>
          <Grid item md={3}>
            <Button onClick={() => handleModal({})} variant="contained" size='medium' style={{ marginTop: 25 }}> <AddIcon style={{ fontSize: 15 }} /> Add Contact </Button>
          </Grid>
        </Grid>

        {contactList.length === 0 && !loader && <div style={{height:'80vh',justifyContent:'center', alignItems:'center',display:'flex'}}>
         < SentimentDissatisfiedIcon />
         <Typography fontSize={25} align='center' marginLeft={2}> No contacts available! </Typography>
        </div> }
        {fetchedImges && fetchedImges.length > 0 && fetchedImges[0] && <List dense sx={{ width: '100%', maxWidth: 550, bgcolor: 'background.paper' }}>
          {contactList.map((value) => {
            return (
              <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Card variant='outlined' style={{ marginBottom: 6 }} >
                  <ListItem
                    key={value}

                    disablePadding
                  >
                    <ListItemButton onClick={() => activateModal(value)}>
                      <Grid container >
                        <Grid item md={1} xs={6} sm={6} style={{ alignContent: 'center' }}>
                          <ListItemAvatar>
                            <Avatar
                              alt={`Avatar n°${value + 1}`}
                              src={value.image_url}
                            />
                          </ListItemAvatar>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12} style={{ alignContent: 'center' }}>
                          <ListItemText id={value.id} primary={value.metadata.name} />
                        </Grid>
                        <Grid item md={2}>
                        </Grid>
                        <Grid item md={6} xs={6} sm={6}>
                          <ListItemText primary={value.metadata.last_contact_date} />
                        </Grid>
                      </Grid>
                    </ListItemButton>
                  </ListItem>
                </Card>
              </div>
            );
          })}
        </List>}
      </Container >

      <Modal
        open={modalActive}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography mb={2} className='modal-heading' variant='h6' fontWeight={'bold'} >{modalHeader}</Typography>
          <Grid container direction="column" rowGap={3}>
            <Grid item>
              <Typography className='modal-subheading'>Contact Name</Typography>
              <TextField error={error} value={name} onChange={(event) => setName(event.target.value)} id="outlined-basic" variant="outlined" InputProps={{ sx: { height: 30, width: 300 } }} />
            </Grid>
            <Grid item>
              <Typography className='modal-subheading'> Image</Typography>
              <Grid container>

                <Grid item>

                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°$`}
                      src={currentModalImage}
                    />
                  </ListItemAvatar>
                </Grid>
                <Grid item style={{ alignContent: 'center' }}>

                  <Button

                    component="label"
                    variant="outlined"
                    id="outlined-basic"
                    style={{ color: '#373736', borderColor: '#c4c4c4', width: 150, height: 25, }}
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon style={{ fontSize: 18 }} />}

                  >
                    Add file
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography className='modal-subheading'>Last Contact Date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>

                  <DatePicker
                    value={date}
                    slotProps={{
                      textField: {
                        size: "small",
                        error: error,
                      },
                    }}
                    onChange={(newValue) => setDate(newValue)}
                    maxDate={dayjs(new Date())}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>

          {error && <Typography style={{ 'color': 'red', fontSize: 13 }}>{error}</Typography>}

          {modalHeader === 'Create a New Contact' ? <Button onClick={addContactData} variant="contained" size='medium' style={{ marginTop: 25 }}>Add Contact </Button> : <Button onClick={addContactData} variant="contained" size='medium' style={{ marginTop: 25 }}>Update Contact </Button>}
          {fileUploadInfo && <Snackbar
            open={fileUploadInfo}
            autoHideDuration={2000}
            onClose={handleToastClose}
            message={fileUploadInfo}
          />}
        </Box>
      </Modal>
    </>

  );
}

export default App;
