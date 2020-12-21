import { Backdrop, Button, Fade, makeStyles, Modal, TextField, Typography } from '@material-ui/core';
import Axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
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
}));

export default function AddPresetModal({ isModalOpen = false, setModalOpen = (_: boolean) => null, rootRef = null, onAdd = () => null }) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaker, setSpeaker] = useState('');
  const [microphone, setMicrophone] = useState('');

  const handleAdd = useCallback(() => {
    Axios.post('./api/presets', { name, speaker, microphone })
      .then(() => onAdd())
      .catch((e) => console.error(e));
    setModalOpen(false);
  }, [name, loading, microphone])

  useEffect(() => {
    setName('');
    setSpeaker('');
    setMicrophone('');
    setLoading(false);
  }, [isModalOpen])

  
  return (<Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={isModalOpen}
        onAbort={() => setModalOpen(false)}
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        className={classes.modal}
        container={() => rootRef.current}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <div className={classes.modalContent}>
            <Typography className={classes.modalTitle} variant="h3" color="textSecondary" align="left">Add preset</Typography>
            <TextField className={classes.modalInput} label="Preset name" variant="outlined" autoComplete="off" disabled={loading} value={name} onChange={(v) => setName(v.currentTarget.value)}/>
            <TextField className={classes.modalInput} label="Speakers" variant="outlined" autoComplete="off" disabled={loading} value={speaker}  onChange={(v) => setSpeaker(v.currentTarget.value)}/>
            <TextField className={classes.modalInput} label="Microphone" variant="outlined" autoComplete="off" disabled={loading} value={microphone} onChange={(v) => setMicrophone(v.currentTarget.value)}/>
            <Button className={classes.modalButton} variant="contained" color="primary" disabled={loading} onClick={handleAdd}>Add</Button>
            <Button className={classes.modalButton} variant="contained" color="secondary" disabled={loading} onClick={() => {setModalOpen(false)}}>Cancel</Button>
          </div>
        </Fade>
      </Modal>)
}