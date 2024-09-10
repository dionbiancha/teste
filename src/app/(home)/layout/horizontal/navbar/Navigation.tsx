import { Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavListing from "./NavListing/NavListing";
import Logo from "../../shared/logo/Logo";
import { useSelector, useDispatch } from "@/store/hooks";
import { toggleMobileSidebar } from "@/store/customizer/CustomizerSlice";
import { AppState } from "@/store/store";

const Navigation = () => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();

  return (
    <Drawer
      anchor="left"
      open={customizer.isMobileSidebar}
      onClose={() => dispatch(toggleMobileSidebar())}
      variant="temporary"
      PaperProps={{
        sx: {
          width: customizer.SidebarWidth,
          border: "0 !important",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <Box px={2}>
        <Logo />
      </Box>
    </Drawer>
  );
};

export default Navigation;
