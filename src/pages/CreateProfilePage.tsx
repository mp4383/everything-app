import React, { useState, useMemo } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateProfilePage = () => {
  const { createProfile } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createProfile({
        nickname: nickname.trim(),
        bio: bio.trim(),
      });
      // Navigate to dashboard after successful profile creation
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar URL based on nickname
  const avatarUrl = useMemo(() => {
    if (!nickname.trim()) return '';
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(nickname.trim())}`;
  }, [nickname]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Create Your Profile
          </Typography>
          {nickname.trim() && (
            <Avatar
              src={avatarUrl}
              alt={nickname}
              sx={{ 
                width: 100, 
                height: 100, 
                mb: 2,
                border: 1,
                borderColor: 'grey.300'
              }}
            />
          )}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nickname"
              label="Nickname"
              name="nickname"
              autoFocus
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="bio"
              label="Bio"
              id="bio"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !nickname.trim() || !bio.trim()}
            >
              {loading ? 'Creating...' : 'Create Profile'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateProfilePage;
