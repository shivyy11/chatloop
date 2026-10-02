import React from "react";
import { Avatar, AvatarGroup, Box } from "@mui/material";
import { transfromImage } from "../../lib/features";

const AvatarCard = ({ avatar = [], groupAvatar, max = 4 }) => {
  const avatars = Array.isArray(avatar) ? avatar : [avatar];

  if (groupAvatar) {
    return (
      <Avatar
        src={transfromImage(groupAvatar)}
        sx={{
          width: 50,
          height: 50,
        }}
      />
    );
  }

  return (
    <Box sx={{ position: "relative", width: "fit-content" }}>
      <AvatarGroup max={max}>
        {avatars.map((i, index) => (
          <Avatar key={index} src={i} />
        ))}
      </AvatarGroup>
    </Box>
  );
};

export default AvatarCard;
