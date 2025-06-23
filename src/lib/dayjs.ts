import dayjs from "dayjs";

import "dayjs/locale/pt-br";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
dayjs.locale("pt-br");

export default dayjs;
