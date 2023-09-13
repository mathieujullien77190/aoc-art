import Date from "../Date";
import { Choices } from "./Choices";
import { Item } from "./types";

export const FULL = {
  padding: "12px",
  borderSize: "3px",
  fontSize: "18px",
};



export const COLORS = {
  text: "#FFFFFF",
  title: "#000000",
  backgroundContent: "#B6B7AF",
  backgroundSelection: "#0200A7",
  backgroundMessage: "#0200A7",
  backgroundTitle: "#02aaaa",
  border: "#000000",
  borderMessage: "#FFFFFF",
};

export const NB_ITEMS = 6;

export const CPU = { C4: "Quad Cors", CQ: "Quantum Cors", C2: "Dual cors" }
export const FREQ = { low: "2.94GHz", hight: "10.00GHz" }
export const ERROR = { yes: "yes", no: "no" }

export const ITEMS: (Item | "-")[] = [
  {
    label: "System time",
    id: 0,
    content: () => <Date withTime />,
    choices: undefined,
    message: "Time like the soul, are immutable",
  },
  {
    label: "System date",
    id: 1,
    content: () => <Date withDate />,
    choices: undefined,
    message: "Date like the time, are immutable",
  },
  "-",
  {
    label: "Screen Frequency",
    id: 2,
    content: (currentItem, current, value, onChange) => (
      <Choices
        currentItem={currentItem}
        current={current}
        value={value || currentItem.choices[0]}
        onChange={onChange}
      />
    ),
    choices: [FREQ.hight, FREQ.low],
    message: "",
  },
  {
    label: "CPU",
    id: 3,
    content: (currentItem, current, value, onChange) => (
      <Choices
        currentItem={currentItem}
        current={current}
        value={value || currentItem.choices[0]}
        onChange={onChange}
      />
    ),
    choices: [CPU.C4, CPU.CQ, CPU.C2],
    message: "",
  },
  {
    label: "Triggering Error",
    id: 4,
    content: (currentItem, current, value, onChange) => (
      <Choices
        currentItem={currentItem}
        current={current}
        value={value || currentItem.choices[0]}
        onChange={onChange}
      />
    ),
    choices: [ERROR.yes, ERROR.no],
    message: "",
  },
  "-",
  {
    label: "Exit",
    id: 5,
    content: () => <></>,
    choices: undefined,
    message: "Leave without save",
  },
  {
    label: "Exit and save",
    id: 6,
    content: () => <></>,
    choices: undefined,
    message: "Leave and save",
  },
];
