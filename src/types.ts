type FrameworkVariant = {
  name: string;
  display: string;
  color: Function;
  customCommand?: string;
};

export type Framework = {
  name: string;
  display: string;
  color: Function;
  variants: FrameworkVariant[];
};
