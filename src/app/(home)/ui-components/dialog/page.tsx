"use client";

import { Grid } from "@mui/material";
import Breadcrumb from "@/app/(home)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ParentCard from "@/components/shared/ParentCard";
import ChildCard from "@/components/shared/ChildCard";
import SimpleDialog from "@/components/ui-components/dialog/SimpleDialog";
import AlertDialog from "@/components/ui-components/dialog/AlertDialog";
import TransitionDialog from "@/components/ui-components/dialog/TransitionDialog";
import FormDialog from "@/components/ui-components/dialog/FormDialog";
import FullscreenDialog from "@/components/ui-components/dialog/FullscreenDialog";
import MaxWidthDialog from "@/components/ui-components/dialog/MaxWidthDialog";
import ScrollContentDialog from "@/components/ui-components/dialog/ScrollContentDialog";
import ResponsiveDialog from "@/components/ui-components/dialog/ResponsiveDialog";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Dialog",
  },
];

const MuiDialog = () => (
  <PageContainer title="Dialog" description="this is Dialog">
    {/* breadcrumb */}
    <Breadcrumb title="Dialog" items={BCrumb} />
    {/* end breadcrumb */}

    <ParentCard title="Dialog">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Simple">
            <SimpleDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Alert">
            <AlertDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Transition">
            <TransitionDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Form">
            <FormDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Full screen">
            <FullscreenDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Max width">
            <MaxWidthDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Scrolling Content">
            <ScrollContentDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Responsive Fullscreen">
            <ResponsiveDialog />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiDialog;
