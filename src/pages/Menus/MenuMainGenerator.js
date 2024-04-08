import React, { useState, useContext } from 'react';
import { createTheme, ThemeProvider, Box, Modal, Button, TextField, Typography } from '@mui/material';
import BlogPost from '../../components/blog/BlogPost';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function MenuMainGenerator() {
  const [blogPosts, setBlogPosts] = useState([
    { id: 1, title: 'Primer Post', content: 'Este es el contenido del primer post.' },
    { id: 2, title: 'Segundo Post', content: 'Este es el contenido del segundo post.' },
  ]);
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddPost = () => {
    setBlogPosts([...blogPosts, { ...newPost, id: blogPosts.length + 1 }]);
    setNewPost({ title: '', content: '' }); // Reset form
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevState => ({ ...prevState, [name]: value }));
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Blog Rennueva
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          Agregar Post
        </Button>
        {blogPosts.map((post) => (
          <BlogPost key={post.id} title={post.title} content={post.content} />
        ))}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Agregar nueva entrada
            </Typography>
            <TextField
              margin="dense"
              id="title"
              name="title"
              label="Título del Post"
              type="text"
              fullWidth
              variant="standard"
              value={newPost.title}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="content"
              name="content"
              label="Contenido"
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              value={newPost.content}
              onChange={handleChange}
            />
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleAddPost} variant="contained">Agregar</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export { MenuMainGenerator};
