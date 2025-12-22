import { root } from "./route";
import { dashboard } from "./route/dashboard";
import { peserta } from "./route/peserta";
import { panitia  } from "./route/panitia";       

export const routes = root.concat(
    dashboard,
    peserta,
    panitia   
);
