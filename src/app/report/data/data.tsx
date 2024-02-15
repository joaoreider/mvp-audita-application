import {
  FaRegCircleCheck,
  FaCircleXmark,
  FaTriangleExclamation,
} from "react-icons/fa6";

export const statuses = [
  {
    value: "APROVADO",
    label: "Aprovado",
    icon: FaRegCircleCheck,
  },
  {
    value: "REPROVADO",
    label: "Reprovado",
    icon: FaCircleXmark,
  },
  {
    value: "VERIFICAR",
    label: "Verificar",
    icon: FaTriangleExclamation,
  },
];
