import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import {
  Chat as ChatIcon
} from '@mui/icons-material';
import ChatRoomsList from '../components/chat/ChatRoomsList';
import ChatWindow from '../components/chat/ChatWindow';

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = React.useState(null);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseChat = () => {
    setSelectedRoom(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4
        }}
      >
        <ChatIcon sx={{ color: 'primary.main', fontSize: 40 }} />
        Chat Support
      </Typography>
      
      <Grid container spacing={3} sx={{ height: 'calc(100vh - 220px)' }}>
        {/* Chat Rooms List */}
        <Grid item xs={12} md={4}>
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
              contactName={selectedRoom.contactName}
              onClose={handleCloseChat}
            />
          ) : (
            <Paper 
              elevation={3} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'text.secondary', 
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChatIcon sx={{ 
                fontSize: 80, 
                mb: 3, 
                opacity: 0.4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                Select a chat to start messaging
              </Typography>
              <Typography variant="body1" textAlign="center" sx={{ maxWidth: 300, lineHeight: 1.6 }}>
                Choose a conversation from the list to view and send messages
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
