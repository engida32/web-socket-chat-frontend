"use client";
import {
  Alert,
  Button,
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
import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const messageEndRef = useRef(null);
  const token = JSON.parse(localStorage.getItem("authData")).token;
  const socket = new WebSocket(
    `ws://localhost:5000/?token=${
      JSON.parse(localStorage.getItem("authData"))?.token
    }`
  );
  useEffect(() => {
    socket.onmessage = (event: any) => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        let user = JSON.parse(localStorage.getItem("authData")).username;
        let users = res.data.filter((u) => u.username !== user);
        setUsers(users);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };
    fetchUsers();
    socket.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };
  }, [token]);

  const handleSendMessage = () => {
    if (!receiverId || !message) {
      setError("Receiver and message are required.");
      return;
    }
    setError("");
    const msg = { token, receiverId, message, file: file };
    socket.send(JSON.stringify(msg));
    setMessage("");
    setFile(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:5000/upload", formData);
    const filePath = res.data.filePath;
    setFile(filePath);
    // const msg = { token, receiverId, message: message, file: filePath };
    // socket.send(JSON.stringify(msg));
  };

  // useEffect(() => {
  //   messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  let domain = window.location.origin;
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Chat Application
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="receiver-label">Receiver</InputLabel>
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ m: 1 }}
          disabled={!receiverId || !message || !file}
        >
          Send
        </Button>
        <input
          type="file"
          style={{ display: "none" }}
          id="upload-file"
          onChange={handleFileUpload}
        />
        <label htmlFor="upload-file">
          <Button variant="contained" component="span" sx={{ m: 2 }}>
            Upload File
          </Button>
        </label>
        {file && (
          <Typography
            sx={{
              marginTop: 2,
              wordWrap: "break-word",
            }}
          >
            File uploaded:{" "}
            <Link
              href={domain + file}
              target="_blank"
              rel="noopener noreferrer"
            >
              {domain + file}
            </Link>
          </Typography>
        )}
      </Paper>
      <Paper
        elevation={3}
        sx={{ padding: 2, maxHeight: 400, overflow: "auto" }}
      >
        <List>
          {messages?.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <>
                    <strong>{msg.sender.username}</strong> {">"}
                    to {">"}
                    <strong>{msg.receiver.username}:</strong>
                  </>
                }
                secondary={
                  <Stack>
                    <Typography>{msg.message}</Typography>
                    {msg.file && (
                      <Link
                        href={`http://localhost:5000${msg.file}`}
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
