
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';;
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';

function ModalComponent(
    {
        modalActive,
        name,
        date,
        modalHeader,
        currentModalImage,
        activeId,
        error,
        handleClose,
        fetchContactList,
        setError,
        setName,
        setDate,
        

    }) {
    const [file, setFile] = useState()
    const [fileUploadInfo, setFileUploadInfo] = useState('')
    const serverBaseUrl = 'http://localhost:8080/'
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 6,
    };

    const handleToastClose = () => {
        setFileUploadInfo('')
    }

    const handleFileChange = (event) => {
        console.log(event.target.files, typeof (event.target.value), 'check-vallll')
        console.log(event.target.files[0], 'check-file')
        setFile(event.target.files[0])
        setFileUploadInfo("File Uploaded Successfully")
    }

    const addContactData = () => {
        console.log(name,date,file,'check-data oopss')
        if (!name || !file || !date) {
            setError('Please enter all the fields')
        }
        else {
            setError('')
            const formData = new FormData()
            formData.append("name", name)
            formData.append("last_contact_date", date)
            if (activeId)
                formData.append("id", activeId)
            formData.append("image", file)


            postData(`${serverBaseUrl}upload`, formData)
                .then(data => {
                    if (data.name) {
                        fetchContactList()
                        handleClose()
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    const postData = async (url, formData) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            return response.json();
        } catch (error) {
            console.error('There was an error!', error);
            throw error;
        }
    };
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

      const handleDataChange =(newValue)=>{
        console.log('called')
        setDate(dayjs(newValue))
      }
    return (
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
                                    onChange={(newValue) => handleDataChange(newValue)}
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
    )
}
export default ModalComponent