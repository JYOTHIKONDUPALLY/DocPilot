import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  InputBase,
  ClickAwayListener,
  Fade,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = ({ image, user, handleSearch, handleLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm.trim() !== "") handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const toggleSearch = () => setSearchOpen((prev) => !prev);
console.log("user", user, "image", image)
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          {/* Company Name */}
          <Typography variant="h6" noWrap sx={{ display: { sm: "block" } }}>
            DocPilot
          </Typography>

          {/* Searchbar */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", ml: 2 }}>
            {searchOpen && (
              <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                <Fade in={searchOpen}>
                  <Box sx={{ flexGrow: 1, maxWidth: 250, position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        height: "100%",
                        pointerEvents: "none",
                        display: "flex",
                        alignItems: "center",
                        pl: 2,
                      }}
                    >
                      <SearchIcon />
                    </Box>
                    <InputBase
                     autoFocus
                     placeholder="Search…"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     sx={{
                       width: "100%",
                       backgroundColor: (theme) => theme.palette.common.white,
                       opacity: 0.5,
                       color: "text.primary", 
                       borderRadius: 1,
                       pl: 5,
                       pr: 1,
                       py: 0.5,
                       "&:hover": { 
                         backgroundColor: (theme) => theme.palette.grey[100]
                       },
                       boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                     }}
                    />
                  </Box>
                </Fade>
              </ClickAwayListener>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" sx={{ display: { xs: "inline-flex" } }} onClick={toggleSearch}>
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>

            {/* Desktop Menu Items */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <MenuItem onClick={() => navigate("/Dashboard")}>Home</MenuItem>
              <MenuItem onClick={() => navigate("/Editor")}>Editor</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Box>

            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: "inline-flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* User Info */}
            <Box sx={{ display: "flex", flexDirection:'column', alignItems: "center" }}>
              <img
                src={image}
                alt="user"
                width={30}
                height={30}
                style={{ borderRadius: "50%" }}
                referrerPolicy="no-referrer"
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileAnchorEl}
        id="mobile-menu"
        keepMounted
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => { navigate("/Dashboard"); handleMobileMenuClose(); }}>Home</MenuItem>
        <MenuItem onClick={() => { navigate("/Editor"); handleMobileMenuClose(); }}>Editor</MenuItem>
        <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose(); }}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
