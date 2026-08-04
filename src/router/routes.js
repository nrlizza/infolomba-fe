import { root } from "./route";
import { dashboard } from "./route/dashboard";
import { peserta } from "./route/peserta";
import { panitia } from "./route/panitia";
import { admin } from "./route/admin";

export const routes = root.concat(
    dashboard,
    peserta,
    panitia,
    admin
);
