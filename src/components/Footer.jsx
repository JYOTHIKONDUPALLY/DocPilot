// src/components/Footer.jsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 2,
        mt: 'auto',

      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} DocPilot. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
