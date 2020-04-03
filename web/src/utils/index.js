import { withNaming } from "@bem-react/classname";
import { createBrowserHistory } from "history";

export const cn = withNaming({ e: "__", m: "_" });
export const history = createBrowserHistory();
