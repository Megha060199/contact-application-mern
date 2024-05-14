import logo from './logo.svg';
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

function App() {
  return (
      <Container fixed>
        <Grid container >
          <Grid item md={9} >
            <h1>Contacts</h1>
          </Grid>
          <Grid item md={3}>
            <Button onClick={() => handleModal({})} variant="contained" size='medium' style={{ marginTop: 25 }}> <AddIcon style={{ fontSize: 15 }} /> Add Contact </Button>
          </Grid>
        </Grid>


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
  );
}

export default App;
