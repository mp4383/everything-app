import { useState } from 'react';
import { Box, Typography, Stack, Card, CardContent, Avatar, IconButton, TextField, Button, Menu, MenuItem, Divider, Tooltip } from '@mui/material';
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
              <Avatar>{post.author.slice(2, 4)}</Avatar>
              <Box>
                <Typography variant="subtitle2">
                  {post.author.slice(0, 6)}...{post.author.slice(-4)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
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

const SocialPage = () => {
  return (
    <Box sx={{ 
      display: 'flex',
      height: '100%',
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Main Feed */}
      <Box sx={{ 
        width: '600px',
        margin: '0 auto',
        height: '100%',
        overflow: 'auto',
        p: 2,
        bgcolor: '#fafafa',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#bdbdbd',
          borderRadius: '4px',
        }
      }}>
        <CreatePost />
        {mockPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
};

export default SocialPage;
