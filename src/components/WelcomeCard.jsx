// src/components/Welcome.jsx
import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Welcome = () => {
  const Navigate=useNavigate();
  return (
    <Box
      sx={{
        py: 6,
        textAlign: 'center',
        backgroundColor: '#f0f4f8',
        maxHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Welcome to DocPilot
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Manage your files, tasks, and documents effortlessly with Google Drive integration.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={()=>Navigate("/Editor")}>
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default Welcome;
