import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [acceptedTC, setAcceptedTC] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // fetch user details 
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await userInfoRes.json();

        localStorage.setItem('user', JSON.stringify({
          token: tokenResponse,
          profile: userInfo
        }));
  
        navigate('/dashboard');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: error => console.log('Login Failed:', error),
    scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile'
  });
  

  const handleCheckboxChange = (event) => {
    setAcceptedTC(event.target.checked);
  };

  const handleLoginClick = () => {
    if (!acceptedTC) {
      alert('Please accept the Terms and Conditions to proceed.');
      return;
    }
    login();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #e0f7fa, #ffffff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Paper elevation={6} sx={{ padding: 5, width: '100%', maxWidth: 450, borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            DocPilot
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Your cloud-based document hub. Access, edit, and manage your Google Drive files effortlessly.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Sign in with Google
          </Typography>
{/* check box for terms */}
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedTC}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
               By signing in, you agree to grant access to your Google Drive documents.
              </Typography>
            }
          />
{/* signup Button  */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={handleLoginClick}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              paddingX: 3,
              borderRadius: 2,
              mt: 2,
            }}
            disabled={!acceptedTC}
          >
            Sign in with Google
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
