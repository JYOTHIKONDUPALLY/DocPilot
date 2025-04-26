// src/components/FileCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { getFileTypeInfo } from "../Utils";
const FileCard = ({ file }) => {
  const { type, color, icon } = getFileTypeInfo(file.mimeType);
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size} ${units[unitIndex]}`;
  };

  return (
    <Card
      sx={{
        borderLeft: `6px solid ${color}`,
        mb: 2,
        transition: "0.3s",
        // width: "300px",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ width: "40px", height: "40px" }}
        >
          <Box color={color}>{icon}</Box>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "90%",
              }}
            >
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {type}-{file.size && formatFileSize(file.size)}
          </Typography>
          </Box>
         
        </Box>
      </CardContent>
    </Card>
  );
};

export default FileCard;
