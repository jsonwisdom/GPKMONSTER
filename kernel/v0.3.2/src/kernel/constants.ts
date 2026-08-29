import { BasisPoints } from "./types";

export const CONSTITUTIONAL_CONSTANTS = {
  KERNEL_VERSION: "0.3.2-RC9",
  BASIS_POINTS_MIN: 0 as BasisPoints,
  BASIS_POINTS_MAX: 10000 as BasisPoints,
  BASIS_POINTS_NEUTRAL: 5000 as BasisPoints,
  THRESHOLDS: {
    SUPPORT: 6000 as BasisPoints,
    CONTRADICT: 4000 as BasisPoints,
  },
  MAX_REASONING_STEPS: 100,
  MAX_TEXT_LENGTH: 10000,
  ONE_HOUR_MS: 3600000,
  ONE_DAY_MS: 86400000,
} as const;
