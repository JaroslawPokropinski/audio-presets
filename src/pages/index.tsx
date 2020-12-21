import { Backdrop, Button, Container, CssBaseline, Fab, Fade, makeStyles, Modal, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Axios from 'axios'
import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react'
import AddPresetModal from '../components/AddPresetModal';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    height: '100vh',
    width: '100vw'
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalTitle: {
    marginBottom: theme.spacing(4)
  },
  modalInput: {
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  modalButton: {
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(8),
  },
  button: {
    marginBottom: theme.spacing(4),
    minWidth: '200px'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(8),
    right: theme.spacing(8),
  },
}));

export default function Home() {
  const classes = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [devices, setDevices] = useState([]);

  const handleClick = useCallback((id: number) => {
    Axios.post(`./api/presets/toogle/${id}`);
  }, []);

  const reload = useCallback(() => {
    Axios.get(`./api/presets`)
      .then((response) => {
        setDevices(response.data);
      })
      .catch((e) => console.error(e));
  }, [])

  useEffect(() => {
    reload();
  }, [reload]);
  

  return (
    <div className={classes.root} ref={rootRef}>
      <Head>
        <title>Audio controller</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography className={classes.title} variant="h1" color="textSecondary" align="center">Presets</Typography>
          {devices.map((device) => <Button key={device.id} className={classes.button} variant="contained" size="large" color="primary" onClick={() => handleClick(device.id)}>
            {device.name}
          </Button>)}

          <Fab className={classes.fab} color="primary" aria-label="add" onClick={() => {setModalOpen(true)}}>
            <AddIcon />
          </Fab>
        </div>
      </Container>
      </main>

      <AddPresetModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} rootRef={rootRef} onAdd={reload}/>

    </div>
  )
}
