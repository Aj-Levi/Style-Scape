'use client';

import { Provider } from "react-redux";
import { ReduxStore } from "@/lib/stores/ReduxStore";

export default function ReduxStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={ReduxStore}>{children}</Provider>;
}