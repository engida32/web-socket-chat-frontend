import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import React from "react";
export const inputFieldStyle = {
  backgroundColor: "#FFF",
  mt: "10px",
  width: "100%",

  borderRadius: "12px",
  border: "1px solid #E4E4E7",

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
  },
  ".Mui-focused": {
    border: "1px solid #FC2D7C",
    borderRadius: "12px",
  },
};
const textStyles = {
  color: "#FC2D7C",
  fontFamily: "Ubuntu",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 500,
  letterSpacing: "0.035px",
};

const SignUp = () => {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  // implement the login with axios
  const handleRegister = () => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/users`, {
        username: name,
        password,
      })
      .then((res) => {
        navigate("/");
        toast.success("Registered successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.error ?? "An error occurred");
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F5F9FC",
      }}
    >
      <Toaster />
      <Stack
        sx={{
          mb: "40px",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <Stack
          sx={{
            gap: "8px",
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontFamily: "Ubuntu",
              fontSize: "26px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "36px",
              letterSpacing: "-0.3px",
              textAlign: "center",
            }}
          >
            Welcome To Chat
          </Typography>
          <Typography
            sx={{
              color: "#666",
              textAlign: "center",
              fontFamily: "Ubuntu",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "20px",
            }}
          >
            Sign up to get started
          </Typography>
        </Stack>
      </Stack>
      <Stack
        spacing={2}
        sx={{
          maxWidth: "530px",
          width: "100%",
          alignItems: "center",
          // padding: "24px",
          gap: "12px",
        }}
      >
        <Stack
          sx={{
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontFamily: "Ubuntu",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            User Name
          </Typography>
          <TextField
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="username"
            sx={{
              ...inputFieldStyle,
            }}
          />
          <Typography sx={{ color: "red", fontSize: "12px" }}>
            {name.length > 0 &&
              name.includes(" ") &&
              "Username should not contain spaces"}
          </Typography>
        </Stack>{" "}
        <Stack
          sx={{
            width: "100%",
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontFamily: "Ubuntu",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            Password
          </Typography>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            sx={{
              ...inputFieldStyle,
            }}
            InputProps={{
              endAdornment: (
                <Stack
                  sx={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M15.5112 6.27179C14.9096 5.28663 14.1507 4.40665 13.2647 3.66675L15.1307 1.80078C15.2521 1.67509 15.3193 1.50675 15.3177 1.33202C15.3162 1.15728 15.2461 0.990136 15.1226 0.866577C14.999 0.743017 14.8319 0.67293 14.6571 0.671412C14.4824 0.669894 14.3141 0.737065 14.1884 0.858459L12.1591 2.89037C10.9012 2.1432 9.46307 1.75377 8 1.76412C3.8742 1.76412 1.52307 4.58841 0.488783 6.27179C0.169253 6.7886 0 7.3842 0 7.99182C0 8.59943 0.169253 9.19503 0.488783 9.71184C1.0904 10.697 1.84927 11.577 2.73528 12.3169L0.869308 14.1829C0.805659 14.2443 0.754889 14.3179 0.719963 14.3992C0.685037 14.4805 0.666653 14.5679 0.665884 14.6564C0.665115 14.7449 0.681976 14.8327 0.715484 14.9146C0.748993 14.9965 0.798476 15.0709 0.861048 15.1334C0.92362 15.196 0.998027 15.2455 1.07993 15.279C1.16183 15.3125 1.24958 15.3294 1.33807 15.3286C1.42656 15.3278 1.514 15.3094 1.59531 15.2745C1.67661 15.2396 1.75015 15.1888 1.81163 15.1252L3.84554 13.0913C5.10192 13.8383 6.53832 14.2284 8 14.2195C12.1258 14.2195 14.4769 11.3952 15.5112 9.71184C15.8307 9.19503 16 8.59943 16 7.99182C16 7.3842 15.8307 6.7886 15.5112 6.27179ZM1.62436 9.0141C1.43452 8.70691 1.33397 8.35293 1.33397 7.99182C1.33397 7.6307 1.43452 7.27672 1.62436 6.96953C2.51337 5.52606 4.52262 3.09696 8 3.09696C9.10644 3.09076 10.1973 3.35742 11.1762 3.87334L9.83465 5.21484C9.19485 4.79007 8.42778 4.59974 7.66361 4.67614C6.89945 4.75255 6.18525 5.09098 5.64221 5.63402C5.09917 6.17707 4.76073 6.89126 4.68433 7.65543C4.60792 8.41959 4.79825 9.18666 5.22303 9.82647L3.6836 11.3659C2.8673 10.706 2.17072 9.91041 1.62436 9.0141ZM9.99926 7.99182C9.99926 8.52205 9.78862 9.03057 9.41369 9.40551C9.03876 9.78044 8.53024 9.99107 8 9.99107C7.70312 9.98993 7.41035 9.92157 7.14365 9.79115L9.79933 7.13547C9.92976 7.40217 9.99811 7.69493 9.99926 7.99182ZM6.00074 7.99182C6.00074 7.46158 6.21138 6.95306 6.58631 6.57812C6.96124 6.20319 7.46976 5.99256 8 5.99256C8.29688 5.99371 8.58965 6.06206 8.85635 6.19248L6.20067 8.84816C6.07024 8.58146 6.00189 8.2887 6.00074 7.99182ZM14.3756 9.0141C13.4866 10.4576 11.4774 12.8867 8 12.8867C6.89356 12.8929 5.80266 12.6262 4.82384 12.1103L6.16535 10.7688C6.80515 11.1936 7.57222 11.3839 8.33639 11.3075C9.10055 11.2311 9.81475 10.8926 10.3578 10.3496C10.9008 9.80657 11.2393 9.09237 11.3157 8.3282C11.3921 7.56404 11.2017 6.79697 10.777 6.15716L12.3164 4.61773C13.1327 5.27767 13.8293 6.07323 14.3756 6.96953C14.5655 7.27672 14.666 7.6307 14.666 7.99182C14.666 8.35293 14.5655 8.70691 14.3756 9.0141Z"
                      fill="#4B5563"
                    />
                  </svg>
                  <Typography sx={{ color: "red", fontSize: "12px" }}>
                    {password.length > 0 &&
                      password.length < 6 &&
                      "Password should be atleast 6 characters"}
                  </Typography>
                </Stack>
              ),
            }}
          />
        </Stack>{" "}
        <Button
          sx={{
            borderRadius: "12px",
            background: "#FC2D7C",
            width: "100%",
            color: "#FFF",
            fontFamily: "Ubuntu",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 600,
            textTransform: "none",
            py: "12px",
            "&:hover": {
              background: "#FC2D7C",
            },
          }}
          // onClick={() => router.push("/dashboard")}
          onClick={handleRegister}
          disabled={
            !password || !name || name.includes(" ") || password.length < 6
          }
        >
          Sign in
        </Button>
        <Button
          sx={{
            display: "flex",
            width: "100%",
            mt: "16px",
            backgroundColor: "#FC2D7C",
            color: "#FFF",
            padding: "12px",
            borderRadius: "12px",
            alignItems: "center",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#FC2D7C",
            },
          }}
          onClick={() => navigate("/")}
        >
          <Typography
            sx={{
              ...textStyles,
              color: "#FFF",
              fontSize: "18px",
              textAlign: "center",
            }}
            onClick={() => navigate("/")}
          >
            Already have an account? Login
          </Typography>
        </Button>
      </Stack>
    </Box>
  );
};

export default SignUp;
