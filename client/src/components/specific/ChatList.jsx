import { Stack, Box, Typography } from "@mui/material";
import Chatitem from "../shared/Chatitem";

const Chatlist = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [],
  handleDeleteChat,
}) => {
  return (
    <Stack
      width={w}
      direction={"column"}
      height={"100%"}
      sx={{
        // WhatsApp Official Sidebar Charcoal
        background: "#111b21",
        overflowY: "auto",
        position: "relative",
        // Scrollbar ko ekdum patla aur matching rakhte hain
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.1)",
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          px: "1rem",
          py: "1.5rem",
          background: "#111b21", // Sticky background must match
          borderBottom: "1px solid #222d34",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#e9edef", // Soft Ivory (No black text)
            letterSpacing: "-0.5px",
          }}
        >
          Chats
        </Typography>

        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "#00a884", // WhatsApp Green
            fontWeight: 600,
            textTransform: "uppercase",
            mt: 0.5,
          }}
        >
          {chats?.length} active conversations
        </Typography>
      </Box>

      {/* List Section - Edge to Edge for better highlighting */}
      <Stack direction="column">
        {chats?.map((data, index) => {
          const { avatar,groupAvatar, _id, name, groupChat, members } = data;
          
          const messageAlert = newMessageAlert.find(
            (alert) => alert.chatId === _id,
          );

          const isOnline = members?.some((member) =>
            onlineUsers.includes(member),
          );

          return (
            <Chatitem
              index={index}
              newMessageAlert={messageAlert}
              isOnline={isOnline}
              avatar={avatar}
              groupAvatar={groupAvatar}
              _id={_id}
              key={_id}
              groupChat={groupChat}
              members={members}
              name={name}
              // Active highlight ke liye current chatId check
              isActive={chatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default Chatlist;
