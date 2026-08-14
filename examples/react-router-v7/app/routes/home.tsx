import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App | EdgeOne Makers" },
    { name: "description", content: "Welcome to React Router! · Demo only · EdgeOne Makers" },
  ];
}

export default function Home() {
  return <Welcome />;
}
