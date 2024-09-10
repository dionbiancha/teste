"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Button, snackbarClasses } from "@mui/material";
import CustomTextField from "@/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/components/forms/theme-elements/CustomFormLabel";
import Logo from "@/app/(home)/layout/shared/logo/Logo";
import PageContainer from "@/components/container/PageContainer";
import { doLogin, LoginInterface } from "@/service/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "@/store/hooks";
import { showSnack } from "@/store/snack/snackSlice";

interface LoginProps {
  user?: string;
  password?: string;
}

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState<LoginProps>();
  const dispatch = useDispatch();

  async function handleLogin() {
    if (!login?.user || !login?.password) return;
    try {
      await doLogin({ user: login.user, password: login.password });
      router.push("/");
    } catch (err) {
      dispatch(
        showSnack({
          title: "Usuário ou senha inválidos",
          type: "error",
        })
      );
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, user: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, password: e.target.value });
  };

  return (
    <PageContainer title="Login" description="Pagina de login">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "450px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <Stack mb={5}>
                <Box>
                  <CustomFormLabel htmlFor="username">Usuário</CustomFormLabel>
                  <CustomTextField
                    id="username"
                    variant="outlined"
                    fullWidth
                    onChange={handleUsernameChange}
                  />
                </Box>
                <Box>
                  <CustomFormLabel htmlFor="password">Senha</CustomFormLabel>
                  <CustomTextField
                    id="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    onChange={handlePasswordChange}
                  />
                </Box>
              </Stack>
              <Box>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleLogin}
                  type="submit"
                >
                  Entrar
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
