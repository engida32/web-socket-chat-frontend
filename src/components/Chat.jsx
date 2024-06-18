"use client";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const token = JSON.parse(localStorage.getItem("authData")).token;
  const domain = process.env.REACT_APP_API_BASE_URL;
  const [refresh, setRefresh] = useState(false);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket(
      `wss://${domain.replace("https://", "")}/?token=${token}`
    );

    socket.current.onopen = () => {
      setSocketStatus("Connected");
    };

    socket.current.onclose = () => {
      setSocketStatus("Disconnected");
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocketStatus("Error");
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    return () => {
      socket.current.close();
    };
  }, [token, domain]);

  //retry connection if disconnected

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${domain}/users`);
        const currentUser = JSON.parse(
          localStorage.getItem("authData")
        ).username;
        const filteredUsers = res.data.filter(
          (user) => user.username !== currentUser
        );
        setUsers(filteredUsers);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [domain]);

  const handleSendMessage = () => {
    if (!receiverId || !message) {
      setError("Receiver and message are required.");
      return;
    }
    setError("");
    const msg = { token, receiverId, message, file };
    socket.current.send(JSON.stringify(msg));
    setMessage("");
    setFile(null);
    setRefresh(!refresh);
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
      setError("Please select a file to upload.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const res = await axios.post(`${domain}/upload`, formData);
      setLoading(false);
      setFile(res.data.filePath);
    } catch (err) {
      setLoading(false);
      setError("Failed to upload file.");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload({ target: { files: acceptedFiles } });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "*",
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 2 }}>
        Chat Application
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          my: 2,
          color: socketStatus === "Connected" ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {socketStatus}
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="receiver-label">Select Receiver</InputLabel>
          <Select
            labelId="receiver-label"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            label="Receiver"
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Message"
          multiline
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <div
            {...getRootProps()}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              border: "1px dashed #ccc",
              borderRadius: "5px",
              width: "100%",
              justifyContent: "center",
              height: "150px",
            }}
          >
            <input {...getInputProps()} />
            <label htmlFor="upload-file">
              <Button
                variant="contained"
                component="span"
                disabled={loading}
                sx={{
                  m: 2,
                  color: "white",
                  backgroundColor: "green",
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                }}
              >
                Upload File
              </Button>
            </label>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Drag and drop a file here or click to select a file.
            </Typography>
            {loading && <CircularProgress size={24} />}
          </div>
        </Box>
        {file && (
          <Typography sx={{ marginTop: 2, wordWrap: "break-word" }}>
            File uploaded:{" "}
            <Link
              href={`${domain}${file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file}
            </Link>
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{
            m: 1,
            backgroundColor: "green",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
            padding: "10px 20px",
          }}
          disabled={
            !receiverId || !message || !file || socketStatus !== "Connected"
          }
        >
          Send
        </Button>
      </Paper>
      <Paper
        elevation={3}
        sx={{ padding: 2, maxHeight: 400, overflow: "auto" }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <>
                    <strong>{msg.sender.username}</strong> {">"} to {">"}{" "}
                    <strong>{msg.receiver.username}</strong>:
                  </>
                }
                secondary={
                  <Stack>
                    <Typography>{msg.message}</Typography>
                    {msg.file && (
                      <Link
                        href={`${domain}${msg.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </Link>
                    )}
                  </Stack>
                }
              />
            </ListItem>
          ))}
          <div ref={messageEndRef} />
        </List>
      </Paper>
    </Container>
  );
};

export default Chat;
