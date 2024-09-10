import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";

import { IconMail } from "@tabler/icons-react";
import { Stack } from "@mui/system";
import { doLogout } from "@/service/auth";
import GenericDialog from "@/components/ui-components/dialog/GenericDialog";

const Profile = () => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  function handleLogout() {
    doLogout();
    window.location.href = "/login";
  }

  return (
    <Box>
      {showDialog && (
        <GenericDialog
          cancelText="Voltar"
          confirmText="Sair"
          title="Tem certeza que deseja sair?"
          handleCancel={() => setShowDialog(false)}
          handleConfirm={() => handleLogout()}
        />
      )}
      <IconButton
        size="large"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={""}
          alt={"ProfileImg"}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
          },
        }}
      >
        <Typography variant="h5">Conta</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar src={""} alt={"ProfileImg"} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              fontWeight={600}
            >
              Administrador
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              admin
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              admin@teste.com
            </Typography>
          </Box>
        </Stack>
        <Divider />

        <Box mt={2}>
          <Button
            onClick={() => {
              setShowDialog(true);
              handleClose2();
            }}
            variant="outlined"
            color="primary"
            component={Link}
            href=""
            fullWidth
          >
            Sair
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
