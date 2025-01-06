import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  IconButton, 
  Stack,
  TextField,
  Button,
  Menu,
  MenuItem,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Repeat as RetweetIcon,
  MoreVert as MoreVertIcon,
  Share as ShareIcon,
  EmojiEmotions as EmojiIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { mockPosts } from '../mockData';

const CreatePost = () => {
  const [content, setContent] = useState('');

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Avatar>74</Avatar>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
            />
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1}>
              <IconButton size="small" color="primary">
                <ImageIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <EmojiIcon />
              </IconButton>
            </Stack>
            <Button 
              variant="contained" 
              color="primary"
              disabled={!content.trim()}
              size="small"
            >
              Post
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(likes + (liked ? -1 : 1));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>{post.nickname.slice(0, 2).toUpperCase()}</Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {post.nickname}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {post.author.slice(0, 6)}...{post.author.slice(-4)}
              </Typography>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Stack>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Copy Link</MenuItem>
              <MenuItem onClick={handleMenuClose}>Report</MenuItem>
            </Menu>
          </Stack>

          <Typography variant="body1">{post.content}</Typography>

          <Stack direction="row" spacing={3} alignItems="center">
            <Tooltip title="Like">
              <IconButton size="small" onClick={handleLike} color={liked ? 'primary' : 'default'}>
                {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {likes}
            </Typography>

            <Tooltip title="Comment">
              <IconButton size="small">
                <CommentIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Repost">
              <IconButton size="small">
                <RetweetIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share">
              <IconButton size="small">
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const SocialFeed = () => {
  return (
    <Stack sx={{ height: '100%' }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          position: 'sticky', 
          top: 0,
          bgcolor: 'primary.main',
          zIndex: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        Social Feed
      </Typography>
      <Box sx={{ p: 2, overflow: 'auto', flex: 1, bgcolor: '#fafafa' }}>
        <CreatePost />
        {mockPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Stack>
  );
};

export default SocialFeed;
