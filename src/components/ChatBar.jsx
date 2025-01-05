import { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Stack, 
  IconButton, 
  Badge, 
  Typography, 
  Drawer,
  TextField,
  Paper
} from '@mui/material';
import { 
  Chat as ChatIcon,
  SmartToy as AIIcon,
  Close as CloseIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { mockGroupChats, mockAiChat } from '../mockData';

const ChatBar = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  const handleChatOpen = (chatId) => {
    setSelectedChat(chatId);
  };

  const handleChatClose = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        color="default" 
        sx={{ 
          top: 'auto', 
          bottom: 0,
          height: '50px',
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: '100%', px: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {mockGroupChats.map((chat) => (
              <Box
                key={chat.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: selectedChat === chat.id ? 'action.selected' : 'transparent',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
              >
                <IconButton 
                  onClick={() => handleChatOpen(chat.id)}
                  sx={{ 
                    borderRadius: '4px',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Badge badgeContent={chat.unread} color="error">
                    <ChatIcon color="action" />
                  </Badge>
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {chat.name}
                  </Typography>
                </IconButton>
              </Box>
            ))}
          </Stack>
          <Box
            sx={{
              bgcolor: selectedChat === 'ai' ? 'action.selected' : 'transparent',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
          >
            <IconButton 
              color="secondary" 
              onClick={() => handleChatOpen('ai')}
              sx={{ 
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <AIIcon />
            </IconButton>
          </Box>
        </Stack>
      </AppBar>

      <Drawer
        anchor="right"
        open={selectedChat !== null}
        onClose={handleChatClose}
        PaperProps={{
          sx: { width: '350px' }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: selectedChat === 'ai' ? 'secondary.main' : 'primary.main'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                {selectedChat === 'ai' ? 'AI Assistant' : 
                  mockGroupChats.find(c => c.id === selectedChat)?.name}
              </Typography>
              <IconButton onClick={handleChatClose} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {selectedChat === 'ai' ? (
              mockAiChat.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      backgroundColor: msg.role === 'user' ? 'primary.main' : 'grey.100',
                      color: msg.role === 'user' ? 'white' : 'text.primary',
                      maxWidth: '80%',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2">{msg.content}</Typography>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Group chat messages will appear here
              </Typography>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <IconButton color={selectedChat === 'ai' ? 'secondary' : 'primary'}>
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatBar;
