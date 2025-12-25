import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona imediatamente para o painel.
  // O middleware vai interceptar e pedir login se necessário.
  redirect("/dashboard");
}