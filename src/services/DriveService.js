import axios from "axios";
export const DriveService = {
  //list all files and folders from drive
  listFiles: async (accessToken, searchTerm = "") => {
    try {
      const queryParts = [];

      // If a search term is provided, add a name filter
      if (searchTerm.trim()) {
        queryParts.push(`name contains '${searchTerm.replace(/'/g, "\\'")}'`);
      }

      // Optional: You can add more filters here, e.g., trashed = false
      queryParts.push("trashed = false");

      const query = queryParts.join(" and ");

      const response = await axios.get(
        "https://www.googleapis.com/drive/v3/files",
        {
          params: {
            q: query,
            pageSize: 100,
            fields:
              "nextPageToken, files(id, name, mimeType, modifiedTime, size, parents)",
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const files = response.data.files;
      const documents = files.filter(
        (file) => file.mimeType !== "application/vnd.google-apps.folder"
      );

      return {
        files: documents,
      };
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  },

  // Download a file (for non-Google formats)
  downloadFile: async (accessToken, fileId) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  },
  // Export Google Docs to other formats
  exportGoogleDoc: async (
    accessToken,
    fileId,
    mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileId}/export`,
        {
          params: { mimeType },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error exporting Google Doc:", error);
      throw error;
    }
  },

  // Upload a file to Drive
  uploadFile: async (accessToken, file, parentFolderId = null) => {
    try {
      // First, create the file metadata
      const metadata = {
        name: file.name,
      };

      if (parentFolderId) {
        metadata.parents = [parentFolderId];
      }

      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });

      // Create multipart request
      const form = new FormData();
      form.append("metadata", metadataBlob);
      form.append("file", file);

      const response = await axios.post(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  // Create a new Google Doc
  createGoogleDoc: async (
    accessToken,
    title,
    content = "",
    parentFolderId = null
  ) => {
    try {
      // First create an empty doc
      const metadata = {
        name: title,
        mimeType: "application/vnd.google-apps.document",
      };

      if (parentFolderId) {
        metadata.parents = [parentFolderId];
      }

      const response = await axios.post(
        "https://www.googleapis.com/drive/v3/files",
        metadata,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const docId = response.data.id;

      // If content is provided, update the doc with content
      if (content) {
        await DriveService.updateGoogleDocContent(accessToken, docId, content);
      }

      return response.data;
    } catch (error) {
      console.error("Error creating Google Doc:", error);
      throw error;
    }
  },

  // Get Google Doc content
  getGoogleDocContent: async (accessToken, fileId) => {
    try {
      // Use the Documents API to get the content
      const response = await axios.get(
        `https://docs.googleapis.com/v1/documents/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error getting Google Doc content:", error);
      throw error;
    }
  },

  // Update Google Doc content
  updateGoogleDocContent: async (accessToken, docId, content) => {
    try {
      // Create a batch update request
      const requests = [
        {
          insertText: {
            location: {
              index: 1, // Insert at the beginning of the document
            },
            text: content,
          },
        },
      ];

      const response = await axios.post(
        `https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`,
        { requests },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating Google Doc content:", error);
      throw error;
    }
  },

  // Update file (non-Google Doc)
  updateFile: async (accessToken, fileId, file) => {
    try {
      const response = await axios.patch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
        file,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": file.type,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  },

  // Delete a file or folder
  deleteFile: async (accessToken, fileId) => {
    try {
      const res = await axios.delete(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("delete", res.data);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },
};
