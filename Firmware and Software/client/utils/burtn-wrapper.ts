import { Alert } from "react-native";
import React from "react";

// Define the options interface based on Burnt's API
interface NotificationOptions {
  title: string;
  message?: string;
  preset?: "done" | "error" | "none" | "custom" | "heart";
  duration?: number;
  haptic?: "success" | "warning" | "error" | "none";
  shouldDismissByDrag?: boolean;
  from?: "top" | "bottom";
  layout?: {
    iconSize?: {
      height?: number;
      width?: number;
    };
  };
  icon?: {
    ios?: {
      name?: string;
      color?: string;
    };
    web?: React.ReactNode;
  };
}

// Fallback Implementations (using Alert)

const fallbackToast = (options: NotificationOptions) => {
  const alertTitle =
    options.preset === "error" ? `Error: ${options.title}` : options.title;
  Alert.alert(alertTitle, options.message);
};

const fallbackAlert = (options: NotificationOptions) => {
  const alertTitle =
    options.preset === "error" ? `Error: ${options.title}` : options.title;
  Alert.alert(alertTitle, options.message);
};

let toastImplementation = fallbackToast;
let alertImplementation = fallbackAlert;

try {
  // Try to load Real Burnt
  const RealBurnt = require("burnt");
  console.log("Successfully loaded burnt module.");

  toastImplementation = (options: NotificationOptions) =>
    RealBurnt.toast(options);

  if (RealBurnt.alert) {
    alertImplementation = (options: NotificationOptions) =>
      RealBurnt.alert(options);
  } else {
    console.log(
      "RealBurnt.alert not found, using RealBurnt.toast as fallback for alerts."
    );
    alertImplementation = (options: NotificationOptions) =>
      RealBurnt.toast(options);
  }
} catch (error) {
  console.log("Failed to load burnt module. Using Alert fallback.", error);
  // Fallback implementations remain active
}

export const toast = toastImplementation;
export const alert = alertImplementation;
