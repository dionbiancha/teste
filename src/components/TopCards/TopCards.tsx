import Image from "next/image";
import { Box, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import { DashboardOverview, getDashboardOverview } from "@/service/dashboard";
import { useEffect, useState } from "react";

const TopCards = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  async function getOverview() {
    try {
      const res = await getDashboardOverview();
      setOverview(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    getOverview();
  }, []);

  if (loading)
    return (
      <>
        <Grid container spacing={3} mt={1}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} item xs={12} sm={4} lg={2}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={150}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  return (
    <Grid container spacing={3} mt={1}>
      <Grid item xs={12} sm={4} lg={2}>
        <Box bgcolor={"primary" + ".light"} textAlign="center">
          <CardContent>
            <Image
              src={"/images/svgs/icon-user-male.svg"}
              alt={"topcard.icon"}
              width="50"
              height="50"
            />
            <Typography
              color={"primary" + ".main"}
              mt={1}
              variant="subtitle1"
              fontWeight={600}
            >
              Cadastros
            </Typography>
            <Typography
              color={"primary" + ".main"}
              variant="h4"
              fontWeight={600}
            >
              {overview?.clients}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4} lg={2}>
        <Box bgcolor={"success" + ".light"} textAlign="center">
          <CardContent>
            <Image
              src={"/images/svgs/jetski.png"}
              alt={"topcard.icon"}
              width="50"
              height="50"
            />
            <Typography
              color={"success" + ".main"}
              mt={1}
              variant="subtitle1"
              fontWeight={600}
            >
              Jetski
            </Typography>
            <Typography
              color={"success" + ".main"}
              variant="h4"
              fontWeight={600}
            >
              {overview?.waverunners}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4} lg={2}>
        <Box bgcolor={"error" + ".light"} textAlign="center">
          <CardContent>
            <Image
              src={"/images/svgs/roda-do-navio.png"}
              alt={"topcard.icon"}
              width="50"
              height="50"
            />
            <Typography
              color={"error" + ".main"}
              mt={1}
              variant="subtitle1"
              fontWeight={600}
            >
              Embarcações
            </Typography>
            <Typography color={"error" + ".main"} variant="h4" fontWeight={600}>
              {overview?.vessels}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4} lg={2}>
        <Box bgcolor={"warning" + ".light"} textAlign="center">
          <CardContent>
            <Image
              src={"/images/svgs/engrenagens.png"}
              alt={"topcard.icon"}
              width="50"
              height="50"
            />
            <Typography
              color={"warning" + ".main"}
              mt={1}
              variant="subtitle1"
              fontWeight={600}
            >
              Motores
            </Typography>
            <Typography
              color={"warning" + ".main"}
              variant="h4"
              fontWeight={600}
            >
              {overview?.engines}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TopCards;
