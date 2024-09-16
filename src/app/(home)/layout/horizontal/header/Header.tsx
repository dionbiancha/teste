import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "@/store/hooks";
import Logo from "../../shared/logo/Logo";
import { AppState } from "@/store/store";
import Profile from "./Profile";
import { IconX } from "@tabler/icons-react";
import GenericDialog from "@/components/ui-components/dialog/GenericDialog";
import { IconButton } from "@mui/material";

interface HeaderProps {
  closeAction?: boolean;
}

const Header = ({ closeAction }: HeaderProps) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const customizer = useSelector((state: AppState) => state.customizer);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",

    [theme.breakpoints.up("lg")]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    margin: "0 auto",
    width: "100%",
    color: `${theme.palette.text.secondary} !important`,
  }));

  function handleConfirm() {
    window.location.href = "/";
  }

  return (
    <AppBarStyled position="sticky" color="default" elevation={8}>
      {showDialog && (
        <GenericDialog
          cancelText="Voltar"
          confirmText="Sair"
          title="Tem certeza que deseja sair?"
          content="Os dados não salvos serão perdidos."
          handleCancel={() => setShowDialog(false)}
          handleConfirm={() => handleConfirm()}
        />
      )}
      <ToolbarStyled
        sx={{
          maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
        }}
      >
        <Box sx={{ width: lgDown ? "45px" : "auto", overflow: "hidden" }}>
          <Logo />
        </Box>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {closeAction ? (
            <>
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setShowDialog(true)}
              >
                <IconX />
              </IconButton>
            </>
          ) : (
            <Profile />
          )}
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
