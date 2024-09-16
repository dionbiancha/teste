"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import Customizer from "./layout/shared/customizer/Customizer";
import HorizontalHeader from "./layout/horizontal/header/Header";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import PageContainer from "@/components/container/PageContainer";
import { useRouter } from "next/navigation";
import RecordsTableList from "../../components/RecordsTableList/RecordsTableList";
import TopCards from "../../components/TopCards/TopCards";
import { Button } from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import { getDashboardOverview } from "@/service/dashboard";

export default function Dashboard() {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  const handleRegister = () => {
    router.push("/cadastro");
  };

  async function getOverview() {
    try {
      const res = await getDashboardOverview();
      console.log(res);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
    getOverview();
  }, [router]);

  return (
    <MainWrapper>
      <title>Dashboard</title>
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(customizer.isCollapse && {
            [theme.breakpoints.up("lg")]: {
              ml: `${customizer.MiniSidebarWidth}px`,
            },
          }),
        }}
      >
        <HorizontalHeader />

        <Container
          sx={{
            maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            <PageContainer title="Dashboard" description="this is Dashboard">
              <Box mt={3}>
                <Button
                  onClick={handleRegister}
                  variant="contained"
                  color="primary"
                  startIcon={<IconUser width={18} />}
                >
                  Cadastrar
                </Button>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={12}>
                    <TopCards />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <RecordsTableList />
                  </Grid>
                </Grid>
              </Box>
            </PageContainer>
          </Box>
        </Container>
        <Customizer />
      </PageWrapper>
    </MainWrapper>
  );
}

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  backgroundColor: "transparent",
}));
