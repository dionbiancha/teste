"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";

import PageContainer from "@/components/container/PageContainer";
import { useRouter } from "next/navigation";
import RecordsTableList from "../../components/RecordsTableList/RecordsTableList";
import TopCards from "../../components/TopCards/TopCards";
import { Button } from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import { getDashboardOverview } from "@/service/dashboard";

export default function Dashboard() {
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
  );
}
