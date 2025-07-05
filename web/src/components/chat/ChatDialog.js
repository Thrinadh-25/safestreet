import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import {
  Close as CloseIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import ChatRoomsList from './ChatRoomsList';
import ChatWindow from './ChatWindow';

const ChatDialog = ({ open, onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseChat = () => {
    setSelectedRoom(null);
  };

  const handleDialogClose = () => {
    setSelectedRoom(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '80vh', maxHeight: 800 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatIcon />
          <Typography variant="h6">Chat Support</Typography>
        </Box>
        <IconButton onClick={handleDialogClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: '100%' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Chat Rooms List */}
          <Grid item xs={12} md={4} sx={{ borderRight: { md: 1 }, borderColor: 'divider' }}>
            <ChatRoomsList
              onSelectRoom={handleRoomSelect}
              selectedRoomId={selectedRoom?.tenantId}
            />
          </Grid>

          {/* Chat Window */}
          <Grid item xs={12} md={8}>
            {selectedRoom ? (
              <ChatWindow
                tenantId={selectedRoom.tenantId}
                tenantName={selectedRoom.tenantName}
                onClose={handleCloseChat}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  p: 3
                }}
              >
                <ChatIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  Select a chat to start messaging
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Choose a tenant from the list to view and send messages
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
