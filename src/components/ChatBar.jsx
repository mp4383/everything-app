import { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Stack, 
  IconButton, 
  Typography, 
  Drawer,
  TextField,
  Paper,
  CircularProgress
} from '@mui/material';
import { 
  SmartToy as AIIcon,
  Close as CloseIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useChat } from '../contexts/ChatContext';

const ChatBar = () => {
  const { messages, sendMessage, createChat, currentChat, selectChat, loading } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleChatOpen = async () => {
    if (!currentChat) {
      const chat = await createChat('AI Assistant');
      await selectChat(chat);
    }
  };

  const handleChatClose = () => {
    selectChat(null);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    const message = messageInput;
    setMessageInput(''); // Clear input immediately
    setIsThinking(true);
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsThinking(false);
    }
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
            justifyContent="flex-end"
            sx={{ height: '100%', px: 2 }}
          >
            <Box
              sx={{
                bgcolor: currentChat ? 'action.selected' : 'transparent',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
            >
              <IconButton 
                color="secondary" 
                onClick={handleChatOpen}
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
        open={currentChat !== null}
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
            bgcolor: 'secondary.main'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                AI Assistant
              </Typography>
              <IconButton onClick={handleChatClose} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {currentChat ? (
              <>
                {messages.map((msg) => (
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
                ))}
                {isThinking && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        backgroundColor: 'grey.100',
                        borderRadius: 1,
                        minWidth: 100,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <CircularProgress size={20} color="secondary" />
                    </Paper>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Start a conversation with the AI Assistant
              </Typography>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={!currentChat || isThinking}
              />
              <IconButton 
                color="secondary"
                onClick={handleSendMessage}
                disabled={!currentChat || !messageInput.trim() || isThinking}
              >
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
