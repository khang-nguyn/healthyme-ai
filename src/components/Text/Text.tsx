import { createElement, type HTMLAttributes, type ReactNode } from "react";
import { classNames } from "../../utils/classNames";
import styles from "./Text.module.scss";

type TextType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type TextVariant = "primary" | "secondary";

type TextProps = HTMLAttributes<HTMLElement> & {
  type?: TextType;
  variant?: TextVariant;
  className?: string;
  children: ReactNode;
};

function Text({
  type = "p",
  variant = "primary",
  className,
  children,
  ...rest
}: TextProps) {
  const classes = classNames(
    styles.text,
    styles[type],
    variant === "secondary" ? styles.secondary : styles.primary,
    className,
  );

  return createElement(type, { className: classes, ...rest }, children);
}

export default Text;
