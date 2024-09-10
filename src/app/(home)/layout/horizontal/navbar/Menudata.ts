import { IconHome, IconPoint, IconUserPlus } from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Cadastro",

    icon: IconUserPlus,
    href: "/",
  },
];
export default Menuitems;
